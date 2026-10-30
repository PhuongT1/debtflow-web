import 'dayjs/locale/vi';

import { createTheme } from '@mui/material';
import type {} from '@mui/x-date-pickers/themeAugmentation';

import { designTokens } from '@packages/ui-tokens';

import { buttonComponents } from './theme/components/buttons';
import { formControls } from './theme/components/form-controls';
import { surfaceComponents } from './theme/components/surfaces';
import { customShadows } from './theme/extensions';
import { colorSchemes } from './theme/palette';
import { typography } from './theme/typography';

// Compose the shared theme from tokens and responsibility-specific overrides.

export const appTheme = createTheme({
  customShadows,
  brandPanel: designTokens.effect.brandPanel,
  breakpoints: { values: designTokens.layout.breakpoints },
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes,
  shape: {
    borderRadius: designTokens.radius.md,
  },
  typography,
  components: {
    ...buttonComponents,
    ...formControls,
    ...surfaceComponents,
  },
});
