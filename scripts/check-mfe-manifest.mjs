import Ajv from "ajv";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
const schemaPath = path.join(root, "platform/manifests/schema.json");
const manifestPath = path.join(root, "packages/mfe-registry/src/manifest.json");
const [schema, manifest] = await Promise.all([
  readJson(schemaPath),
  readJson(manifestPath),
]);

const validate = new Ajv({
  allErrors: true,
  strict: true,
  strictRequired: false,
}).compile(schema);
if (!validate(manifest)) {
  console.error("Invalid Micro Frontend manifest:");
  for (const error of validate.errors ?? []) {
    console.error(`- ${error.instancePath || "/"} ${error.message}`);
  }
  process.exit(1);
}

const appDirectories = (
  await readdir(path.join(root, "apps"), { withFileTypes: true })
)
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(root, "apps", entry.name));

const appPackages = new Map();
for (const directory of appDirectories) {
  try {
    const packageJson = await readJson(path.join(directory, "package.json"));
    appPackages.set(packageJson.name, { directory, packageJson });
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

const contractsVersion = Number(
  (
    await readJson(path.join(root, "packages/contracts/package.json"))
  ).version.split(".")[0],
);
const eventsVersion = Number(
  (
    await readJson(path.join(root, "packages/platform-sdk/package.json"))
  ).version.split(".")[0],
);

const errors = [];
const names = new Set();
const packages = new Set();
const envKeys = new Set();
const publicPaths = new Map();
const proxyPaths = new Map();

for (const application of manifest.applications) {
  if (names.has(application.name))
    errors.push(`duplicate application name: ${application.name}`);
  names.add(application.name);

  if (packages.has(application.package))
    errors.push(`duplicate application package: ${application.package}`);
  packages.add(application.package);

  for (const key of [application.enabledEnv, application.originEnv]) {
    if (envKeys.has(key)) errors.push(`environment key is reused: ${key}`);
    envKeys.add(key);
  }

  const workspace = appPackages.get(application.package);
  if (!workspace) {
    errors.push(
      `${application.name} references missing workspace ${application.package}`,
    );
  } else if (workspace.packageJson.version !== application.version) {
    errors.push(
      `${application.name} manifest version ${application.version} does not match package version ${workspace.packageJson.version}`,
    );
  }

  if (application.contracts.api !== contractsVersion) {
    errors.push(
      `${application.name} requires API contract v${application.contracts.api}; workspace provides v${contractsVersion}`,
    );
  }
  if (application.contracts.events !== eventsVersion) {
    errors.push(
      `${application.name} requires event contract v${application.contracts.events}; workspace provides v${eventsVersion}`,
    );
  }

  const { composition } = application;
  if (
    composition.publicPath === "/mfe-compose" ||
    composition.publicPath.startsWith("/mfe-compose/") ||
    composition.publicPath === "/__mfe" ||
    composition.publicPath.startsWith("/__mfe/")
  ) {
    errors.push(
      `${application.name} publicPath uses a Platform-reserved namespace: ${composition.publicPath}`,
    );
  }

  for (const [registry, value, label] of [
    [publicPaths, composition.publicPath, "public path"],
    [proxyPaths, composition.proxyPath, "proxy path"],
  ]) {
    const owner = registry.get(value);
    if (owner)
      errors.push(
        `${label} ${value} is owned by both ${owner} and ${application.name}`,
      );
    registry.set(value, application.name);
  }

  if (composition.integration === "web-component" && !composition.elementName) {
    errors.push(
      `${application.name} web-component integration requires elementName`,
    );
  }
  if (composition.integration !== "web-component" && composition.elementName) {
    errors.push(
      `${application.name} may only declare elementName for web-component integration`,
    );
  }
  if (composition.layout === "none" && composition.integration !== "route") {
    errors.push(`${application.name} layout=none requires route integration`);
  }
  if (composition.integration === "route" && composition.layout !== "none") {
    errors.push(`${application.name} route integration requires layout=none`);
  }
  if (
    ["main", "minimal"].includes(composition.layout) &&
    !["web-component", "iframe"].includes(composition.integration)
  ) {
    errors.push(
      `${application.name} composed layouts require web-component or iframe integration`,
    );
  }
}

const sortedPublicPaths = [...publicPaths.keys()].sort();
for (let index = 0; index < sortedPublicPaths.length; index += 1) {
  for (let nested = index + 1; nested < sortedPublicPaths.length; nested += 1) {
    const left = sortedPublicPaths[index];
    const right = sortedPublicPaths[nested];
    if (right.startsWith(left + "/")) {
      errors.push(`public route namespaces overlap: ${left} and ${right}`);
    }
  }
}

if (errors.length) {
  console.error(
    "Micro Frontend manifest violations:\n" +
      [...new Set(errors)].map((error) => `- ${error}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  `Micro Frontend manifest v${manifest.schemaVersion} is valid for ${manifest.applications.length} independently deployable applications.`,
);
