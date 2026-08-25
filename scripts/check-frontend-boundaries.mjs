import { builtinModules } from "node:module";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const neutralPackageNames = new Set([
  "@debtflow/contracts",
  "@debtflow/design-tokens",
  "@debtflow/navigation",
  "@debtflow/platform-sdk",
]);
const forbiddenNeutralDependencies = new Set([
  "react",
  "react-dom",
  "next",
  "@angular/core",
  "vue",
  "@mui/material",
]);
const builtins = new Set([...builtinModules, ...builtinModules.map((name) => `node:${name}`)]);
const sourceExtensions = /\.(?:ts|tsx|js|jsx|mjs|cjs)$/;
const importPatterns = [
  /(?:import|export)\s+(?:type\s+)?(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g,
  /import\s*\(\s*["']([^"']+)["']\s*\)/g,
  /require\s*\(\s*["']([^"']+)["']\s*\)/g,
];

const errors = [];

async function directories(parent) {
  return (await readdir(parent, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(parent, entry.name));
}

async function sourceFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (["node_modules", ".next", "dist", "coverage"].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await sourceFiles(absolute)));
    else if (sourceExtensions.test(entry.name)) files.push(absolute);
  }
  return files;
}

function packageNameFromSpecifier(specifier) {
  if (!specifier.startsWith("@")) return specifier.split("/")[0];
  return specifier.split("/").slice(0, 2).join("/");
}

function importsFrom(source) {
  const imports = [];
  for (const pattern of importPatterns) {
    pattern.lastIndex = 0;
    for (let match = pattern.exec(source); match; match = pattern.exec(source)) imports.push(match[1]);
  }
  return imports;
}

const workspaceDirectories = [
  ...(await directories(path.join(root, "apps"))),
  ...(await directories(path.join(root, "packages"))),
];
const workspaces = [];

for (const directory of workspaceDirectories) {
  const manifestPath = path.join(directory, "package.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  workspaces.push({
    directory,
    kind: path.relative(root, directory).startsWith("apps/") ? "app" : "package",
    manifest,
  });
}

const workspaceByName = new Map(workspaces.map((workspace) => [workspace.manifest.name, workspace]));

for (const workspace of workspaces) {
  const { directory, kind, manifest } = workspace;
  const runtimeDependencies = {
    ...manifest.dependencies,
    ...manifest.peerDependencies,
  };
  const allDeclaredDependencies = {
    ...runtimeDependencies,
    ...manifest.devDependencies,
  };

  for (const dependency of Object.keys(allDeclaredDependencies)) {
    const target = workspaceByName.get(dependency);
    if (!target) continue;
    if (target.kind === "app") {
      errors.push(`${manifest.name} must not depend on deployable app ${dependency}`);
    }
    if (neutralPackageNames.has(manifest.name) && !neutralPackageNames.has(dependency)) {
      errors.push(`${manifest.name} neutral package must not depend on adapter ${dependency}`);
    }
  }

  if (neutralPackageNames.has(manifest.name)) {
    for (const dependency of Object.keys(allDeclaredDependencies)) {
      if (forbiddenNeutralDependencies.has(dependency)) {
        errors.push(`${manifest.name} must remain framework-neutral; remove ${dependency}`);
      }
    }
  }

  const tsconfigPath = path.join(directory, "tsconfig.json");
  try {
    const tsconfig = JSON.parse(await readFile(tsconfigPath, "utf8"));
    for (const [alias, targets] of Object.entries(tsconfig.compilerOptions?.paths ?? {})) {
      for (const target of targets) {
        const resolved = path.resolve(directory, target.replace(/\*.*$/, ""));
        if (resolved !== directory && !resolved.startsWith(`${directory}${path.sep}`)) {
          errors.push(`${manifest.name} TypeScript alias ${alias} escapes its workspace: ${target}`);
        }
      }
    }
    if ((tsconfig.references ?? []).length > 0) {
      errors.push(`${manifest.name} must not use TypeScript project references to another workspace`);
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  for (const file of await sourceFiles(directory)) {
    const source = await readFile(file, "utf8");
    const sourceRoot = path.join(directory, "src");
    const isRuntimeSource = file === sourceRoot || file.startsWith(`${sourceRoot}${path.sep}`);
    const allowedDependencies = isRuntimeSource
      ? runtimeDependencies
      : allDeclaredDependencies;
    for (const specifier of importsFrom(source)) {
      if (specifier.startsWith("@/")) continue;
      if (specifier.startsWith(".")) {
        const resolved = path.resolve(path.dirname(file), specifier);
        if (resolved !== directory && !resolved.startsWith(`${directory}${path.sep}`)) {
          errors.push(`${path.relative(root, file)} imports outside ${manifest.name}: ${specifier}`);
        }
        continue;
      }
      if (builtins.has(specifier) || specifier.startsWith("node:")) continue;

      const dependency = packageNameFromSpecifier(specifier);
      if (!allowedDependencies[dependency]) {
        const dependencyKind = isRuntimeSource ? "runtime dependency" : "tooling dependency";
        errors.push(`${path.relative(root, file)} imports undeclared ${dependencyKind} ${dependency}`);
      }
      const target = workspaceByName.get(dependency);
      if (target?.kind === "app") {
        errors.push(`${path.relative(root, file)} imports deployable app ${dependency}`);
      }
      if (neutralPackageNames.has(manifest.name) && forbiddenNeutralDependencies.has(dependency)) {
        errors.push(`${path.relative(root, file)} imports UI framework ${dependency}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(
    "Frontend architecture boundary violations:\n" +
      [...new Set(errors)].map((error) => `- ${error}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  `Frontend architecture boundaries are valid across ${workspaces.length} workspaces.`,
);
