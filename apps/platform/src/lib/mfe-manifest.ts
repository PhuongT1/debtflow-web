import { readFileSync } from "node:fs";
import { z } from "zod";

const absolutePathSchema = z
  .string()
  .startsWith("/")
  .refine(
    (value) =>
      !value.startsWith("//") && !value.includes("?") && !value.includes("#"),
    "Path must not contain query or fragment metadata.",
  );
const remoteBasePathSchema = z
  .string()
  .refine(
    (value) =>
      value === "" ||
      (value.startsWith("/") &&
        !value.startsWith("//") &&
        !value.includes("?") &&
        !value.includes("#")),
    "Remote base path must be empty or an absolute path without query or fragment metadata.",
  );

const routeSchema = z.object({
  source: absolutePathSchema,
  destination: absolutePathSchema,
});

const compositionSchema = z.object({
  integration: z.enum(["web-component", "iframe", "route"]),
  layout: z.enum(["main", "minimal", "none"]),
  publicPath: absolutePathSchema,
  proxyPath: absolutePathSchema.refine((value) => value.startsWith("/__mfe/")),
  remoteBasePath: remoteBasePathSchema,
  entryPath: absolutePathSchema,
  elementName: z.string().optional(),
});

const applicationSchema = z.object({
  name: z.string().min(1),
  package: z.string().startsWith("@debtflow/"),
  version: z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/),
  framework: z.string().min(1),
  enabledEnv: z.string().regex(/^[A-Z][A-Z0-9_]*_ENABLED$/),
  originEnv: z.string().regex(/^[A-Z][A-Z0-9_]*_ORIGIN$/),
  healthPath: absolutePathSchema,
  contracts: z.object({
    api: z.number().int().positive(),
    events: z.number().int().positive(),
  }),
  composition: compositionSchema,
  assetRoutes: z.array(routeSchema),
});

const manifestSchema = z.object({
  schemaVersion: z.literal(2),
  applications: z.array(applicationSchema).min(1),
});

export type MfeApplication = z.infer<typeof applicationSchema>;
export type MfeRewrite = { source: string; destination: string };

export function loadMfeManifest(manifestPath: string) {
  return manifestSchema.parse(JSON.parse(readFileSync(manifestPath, "utf8")));
}

function resolveEnabledOrigin(
  application: MfeApplication,
  environment: NodeJS.ProcessEnv,
) {
  const enabled = environment[application.enabledEnv] ?? "false";
  if (enabled !== "true" && enabled !== "false") {
    throw new Error(
      `${application.enabledEnv} must be either "true" or "false".`,
    );
  }
  if (enabled === "false") return null;

  const rawOrigin = environment[application.originEnv];
  if (!rawOrigin) {
    throw new Error(
      `${application.originEnv} is required when ${application.enabledEnv}=true.`,
    );
  }

  const origin = new URL(rawOrigin);
  if (!["http:", "https:"].includes(origin.protocol)) {
    throw new Error(`${application.originEnv} must use HTTP or HTTPS.`);
  }
  return origin.toString().replace(/\/$/, "");
}

export function loadMfeRewrites(
  manifestPath: string,
  environment: NodeJS.ProcessEnv = process.env,
): MfeRewrite[] {
  return loadMfeManifest(manifestPath).applications.flatMap((application) => {
    const origin = resolveEnabledOrigin(application, environment);
    if (!origin) return [];

    const {
      integration,
      layout,
      publicPath,
      proxyPath,
      remoteBasePath,
      entryPath,
    } = application.composition;
    const remoteRoot = origin + remoteBasePath;
    const publicRewrites: MfeRewrite[] = [];

    if (layout === "minimal") {
      const composer = `/mfe-compose/minimal/${application.name}`;
      publicRewrites.push(
        { source: publicPath, destination: composer },
        {
          source: `${publicPath}/:path*`,
          destination: `${composer}/:path*`,
        },
      );
    }

    if (layout === "none" && integration === "route") {
      const routeRoot = origin + entryPath.replace(/\/$/, "");
      publicRewrites.push(
        { source: publicPath, destination: routeRoot || origin },
        {
          source: `${publicPath}/:path*`,
          destination: `${routeRoot}/:path*`,
        },
      );
    }

    const runtimeProxyRewrites: MfeRewrite[] =
      integration === "web-component"
        ? []
        : [
            { source: proxyPath, destination: remoteRoot || origin },
            {
              source: `${proxyPath}/:path*`,
              destination: `${remoteRoot}/:path*`,
            },
          ];

    return [
      ...publicRewrites,
      ...runtimeProxyRewrites,
      ...application.assetRoutes.map((route) => ({
        source: route.source,
        destination: origin + route.destination,
      })),
    ];
  });
}

export function getMfeApplication(manifestPath: string, name: string) {
  const application = loadMfeManifest(manifestPath).applications.find(
    (candidate) => candidate.name === name,
  );
  if (!application) throw new Error(`Unknown micro frontend: ${name}`);
  return application;
}
