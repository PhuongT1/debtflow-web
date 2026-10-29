# @packages/ui-tokens

Framework-neutral visual tokens for React, Angular and future micro frontends.

Typography roles are available as `designTokens.typography` in TypeScript and
`--df-font-*` / `--df-line-height-*` CSS variables. Keep both representations in
sync. All apps use the same font stack, 16px/400 body text, 24px/650 domain page
titles, 16px/700 header titles, 14px/400 table cells, 12px/750 table headings, and
12px/600 language triggers. The platform overview may use a larger page title.

TypeScript consumers:

```ts
import { designTokens } from '@packages/ui-tokens';
```

CSS consumers, including Angular:

```css
@import '@packages/ui-tokens/tokens.css';
```

## Run check

```bash
npm run typecheck -w @packages/ui-tokens
```

## Theme layers and primary color

1. `src/palette/brand.ts`: blue-to-sky brand ramp and paired action/text colors.
   `palette/neutral.ts` and `palette/status.ts` own neutral and status colors.
2. `src/schemes/`: semantic light/dark roles for canvas (`background`), card
   (`surface`), popup/modal (`surfaceRaised`), recessed/table-header (`surfaceInset`),
   `surfaceHover`, `primarySelected`, text, borders, disabled states and elevation.
   `src/effects/` derives brand gradients and elevation from the same palette.
3. React maps these roles through MUI `colorSchemes` in
   `packages/ui/react/src/providers/theme/palette.ts`. Components use MUI CSS
   variables or semantic `designTokens` references, never a fixed light palette.
   Angular reads the same `--df-*` variables.

`designTokens.color` and `designTokens.shadow` are CSS-variable references.
For static server values such as browser metadata, use `themeSchemes.light` or
`themeSchemes.dark`. Palette values belong in schemes; component overrides own
presentation, not alternate copies of the palette.

`surface`, `floating`, `dialog`, `primary`, `fixedLeft` and `fixedRight` shadow
roles have separate light/dark values. Layout sizes remain independent of color
and elevation so theme switching preserves table and skeleton geometry.

## Generate and verify CSS

`src/tokens.css` is generated from `src/base.css` (type/size roles), `palette/`, `schemes/` and `effects/`. Commit the generated CSS because Angular consumes it directly.
Do not hand-edit it.

```bash
npm run generate -w @packages/ui-tokens
npm run check -w @packages/ui-tokens
```

`check:architecture` checks generated CSS freshness. New scheme roles must exist
in both modes; TypeScript validates their shape.

## Mode behavior

The shared React provider uses MUI's `defaultMode="system"`, CSS class selectors
and `InitColorSchemeScript` before hydration. System preference selects the initial
mode, including embedded pages. MUI's `useColorScheme().setMode('light' | 'dark' |
'system')` is the supported integration point for a future settings control; do
not create another store. MUI persists mode and synchronizes same-origin tabs.
Native CSS follows the system preference unless the document root explicitly has
`light` or `dark`. Cross-origin applications follow their own setting/system;
adding explicit cross-origin preference messaging requires its own SDK contract.

The structure follows [Minimals settings](https://docs.minimals.cc/settings/) and
[MUI color schemes](https://mui.com/material-ui/customization/dark-mode/).

## Foreground and background pairing

`primary` / `primaryDark` are solid blue action backgrounds in both modes;
`primaryContrast` is their white foreground. Gradients stay within the same
foreground-safe range. `primaryText` is the readable blue for links, outline/text
buttons, navigation and focus labels; dark mode uses a lighter tone without
turning filled actions into pale boxes with dark text.

Cards use opaque `surface`, floating content uses opaque `surfaceRaised`, and
table headers use `surfaceInset`. Only selected/hover feedback, backdrops and
shadows use intentional opacity. Do not stack translucent brand colors on card
content or infer a foreground from a background ad hoc.

MUI overrides live under `packages/ui/react/src/providers/theme/components/` by
control family. Button states use MUI prop variants, not obsolete combined CSS
classes. See [Velora themes](https://velora.colorlib.com/themes) for the brand-ramp
reference; this package retains the project's MUI contracts and density.
