# DebtFlow Marketing

Use the root AGENTS.md and the project Next.js rules. Marketing owns the public product website and campaign landing pages. Shell owns sign-in and workspace pages.

- Keep route composition and metadata in `src/app`, product content in `src/features`, and reusable site chrome in `src/components`.
- Co-locate each feature component with its CSS module. Keep global CSS for app-wide tokens, typography, and shared layout primitives.
- Put reusable public images under `public/images/shared/<purpose>/` and page-specific images under `public/images/<page-or-campaign>/<section>/`.
- Use public workspace package exports. Keep session, private API access and remote composition in the owning apps.
- Add public pages to the relevant content or route owner. Add campaign pages under `/lp` and keep canonical product pages in the sitemap.
- Run `npm run check:marketing` from the workspace root. Verify pages and links on desktop and mobile without a signed-in session.
