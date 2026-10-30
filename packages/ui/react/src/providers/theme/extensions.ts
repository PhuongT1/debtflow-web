import type { CSSProperties } from 'react';

import { designTokens } from '@packages/ui-tokens';

type CustomShadows = Record<keyof typeof designTokens.shadow, string>;

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadows;
    brandPanel: string;
  }
  interface ThemeOptions {
    customShadows?: CustomShadows;
    brandPanel?: string;
  }
  interface TypeText {
    brand: string;
  }
  interface TypeBackground {
    navigation: string;
    inset: string;
    raised: string;
  }
}

// Map framework-neutral elevation roles into the React theme once.
export const customShadows: CustomShadows = designTokens.shadow;

declare module '@mui/material/styles' {
  interface TypographyVariants {
    headerTitle: CSSProperties;
    headerSubtitle: CSSProperties;
    identity: CSSProperties;
    locale: CSSProperties;
  }
  interface TypographyVariantsOptions {
    headerTitle?: CSSProperties;
    headerSubtitle?: CSSProperties;
    identity?: CSSProperties;
    locale?: CSSProperties;
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    headerTitle: true;
    headerSubtitle: true;
    identity: true;
    locale: true;
  }
}
