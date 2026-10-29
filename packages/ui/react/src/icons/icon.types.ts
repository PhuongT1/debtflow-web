import type { SvgIconProps } from '@mui/material';
import type { NavigationIcon } from '@packages/platform-navigation';

export type AppIconName =
  | NavigationIcon
  | 'add'
  | 'back'
  | 'chevronDown'
  | 'chevronLeft'
  | 'chevronRight'
  | 'close'
  | 'collapse'
  | 'delete'
  | 'download'
  | 'edit'
  | 'filter'
  | 'fullscreen'
  | 'fullscreenExit'
  | 'help'
  | 'info'
  | 'list'
  | 'logout'
  | 'menu'
  | 'refresh'
  | 'search'
  | 'visibility'
  | 'visibilityOff'
  | 'warning';
export type AppIconProps = SvgIconProps & { name: AppIconName };

export interface AppIconBadgeProps {
  name: AppIconName;
  tone?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}
