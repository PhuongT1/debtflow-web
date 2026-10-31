import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const app = join(root, 'apps/partner-ops');
export async function loadPure(source) {
  const text = await readFile(join(app, 'src', source), 'utf8');
  const compiled = ts.transpileModule(text, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const temporary = await mkdtemp(join(root, 'node_modules/.party-contract-'));
  try {
    const file = join(temporary, 'module.mjs');
    await writeFile(file, compiled);
    return await import(pathToFileURL(file).href);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}
