import type { SxProps, Theme } from '@mui/material';

export type SectionCardProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  contentSx?: SxProps<Theme>;
};
