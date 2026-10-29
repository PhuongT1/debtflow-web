import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = path.join(root, 'packages/ui/react');
const config = ts.readConfigFile(path.join(directory, 'tsconfig.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, directory);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();
function exportsOf(file) {
  const source = program.getSourceFile(path.join(directory, 'src', file));
  return new Map(
    checker
      .getExportsOfModule(checker.getSymbolAtLocation(source))
      .map((symbol) => [symbol.name, symbol]),
  );
}
function implementation(symbol) {
  return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
}

test('root exposes the complete supported core and adapter APIs without copied implementations', () => {
  const facade = exportsOf('index.ts');
  const supported = new Map([...exportsOf('core.ts'), ...exportsOf('adapters/next/index.ts')]);
  assert.deepEqual([...facade.keys()].sort(), [...supported.keys()].sort());
  for (const [name, symbol] of supported)
    assert.equal(
      implementation(facade.get(name)),
      implementation(symbol),
      `${name} must resolve to the same implementation`,
    );
});

test('public component props are available as types from the package root', () => {
  const facade = exportsOf('index.ts');
  for (const name of [
    'AppShellProps',
    'AppPaginationLinksProps',
    'DataTableProps',
    'PlatformDialogProps',
    'SignOutDialogProps',
    'AppIconProps',
    'AppLocaleMenuProps',
    'SortableTableHeaderProps',
    'DataTableRowsSkeletonProps',
    'ListPageSkeletonProps',
  ]) {
    assert.ok(facade.has(name), `Missing public type ${name}`);
    assert.equal(
      implementation(facade.get(name)).flags & ts.SymbolFlags.Value,
      0,
      `${name} must remain type-only`,
    );
  }
});

test('workspace modules reachable through the facade have no runtime import cycle', () => {
  const graph = new Map();
  for (const source of program.getSourceFiles()) {
    if (!source.fileName.startsWith(path.join(root, 'packages') + path.sep)) continue;
    const dependencies = [];
    for (const statement of source.statements) {
      if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
      if (!statement.moduleSpecifier || statement.isTypeOnly || statement.importClause?.isTypeOnly)
        continue;
      const bindings = statement.importClause?.namedBindings ?? statement.exportClause;
      if (bindings?.elements?.length && bindings.elements.every((item) => item.isTypeOnly))
        continue;
      const symbol = checker.getSymbolAtLocation(statement.moduleSpecifier);
      const target = symbol?.declarations?.find(ts.isSourceFile)?.fileName;
      if (target) dependencies.push(target);
    }
    graph.set(source.fileName, dependencies);
  }
  const active = new Set();
  const visited = new Set();
  function visit(file, chain = []) {
    if (!graph.has(file) || visited.has(file)) return;
    assert.ok(
      !active.has(file),
      `Runtime cycle: ${[...chain, file].map((item) => path.relative(root, item)).join(' -> ')}`,
    );
    active.add(file);
    for (const target of graph.get(file)) visit(target, [...chain, file]);
    active.delete(file);
    visited.add(file);
  }
  visit(path.join(directory, 'src/index.ts'));
});
