# Documentation Viewer

Framework-independent viewer for the canonical Markdown files. Requires Node.js 20+; no application dependencies or package installation. Run these commands from the project root:

```bash
node tooling/rules-viewer/server.mjs
node tooling/rules-viewer/build.mjs
node tooling/rules-viewer/preview.mjs
```

Development defaults to port 4317; preview defaults to 4318. Build output is `dist/docs/`. Publish the output directory on a static host supporting directory `index.html` pages; no Node API is needed after build. Serve over HTTP, not `file://`.

For deployment under a subdirectory, use matching base paths:

```bash
node tooling/rules-viewer/build.mjs --base /handbook/
node tooling/rules-viewer/preview.mjs --base /handbook/
```

Edit `site.config.mjs` beside this file for project branding, approved source roots and navigation groups. Only those Markdown sources are published; review the selection before sharing externally. Do not add secrets or private plans to published roots.

The viewer does not depend on React, Next.js or Angular and does not configure an AI tool. Developers may read source Markdown directly. Complete the local project profile and connect the agent entry separately. Source paths remain visible even though page URLs are clean.
