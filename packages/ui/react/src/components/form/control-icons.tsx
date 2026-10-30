import type { SvgIconProps } from '@mui/material';

import { AppIcon } from '../../icons/app-icon';

export function PickerCalendarIcon(props: SvgIconProps) {
  return <AppIcon {...props} name="calendar" />;
}
export function PickerPreviousIcon(props: SvgIconProps) {
  return <AppIcon {...props} name="chevronLeft" />;
}
export function PickerNextIcon(props: SvgIconProps) {
  return <AppIcon {...props} name="chevronRight" />;
}

export function ControlChevronIcon(props: SvgIconProps) {
  return <AppIcon {...props} name="chevronDown" />;
}
