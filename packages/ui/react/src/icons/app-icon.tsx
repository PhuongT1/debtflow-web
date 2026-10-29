import { SvgIcon } from '@mui/material';
import type { AppIconProps } from './icon.types';
import { iconPaths } from './icon.paths';
export type { AppIconName, AppIconProps } from './icon.types';

export function AppIcon({ name, strokeWidth = 1.8, ...props }: AppIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        d={iconPaths[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}
