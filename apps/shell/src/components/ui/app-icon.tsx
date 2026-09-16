import { SvgIcon, type SvgIconProps } from '@mui/material';

export type AppIconName =
  | 'add'
  | 'aging'
  | 'back'
  | 'calendar'
  | 'chevronLeft'
  | 'chevronRight'
  | 'close'
  | 'collapse'
  | 'dashboard'
  | 'debts'
  | 'delete'
  | 'download'
  | 'edit'
  | 'filter'
  | 'help'
  | 'import'
  | 'info'
  | 'list'
  | 'logout'
  | 'menu'
  | 'parties'
  | 'payments'
  | 'refresh'
  | 'users'
  | 'visibility'
  | 'visibilityOff'
  | 'warning';

const paths: Record<AppIconName, string> = {
  add: 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z',
  aging: 'M4 19h16v2H4v-2Zm1-8h3v6H5v-6Zm5-6h3v12h-3V5Zm5 3h3v9h-3V8Z',
  back: 'm15.4 16.6-4.6-4.6 4.6-4.6L14 6l-6 6 6 6 1.4-1.4Z',
  calendar: 'M7 2h2v2h6V2h2v2h3v18H4V4h3V2Zm11 8H6v10h12V10ZM6 6v2h12V6H6Z',
  chevronLeft: 'm15.4 16.6-4.6-4.6 4.6-4.6L14 6l-6 6 6 6 1.4-1.4Z',
  chevronRight: 'm8.6 16.6 4.6-4.6-4.6-4.6L10 6l6 6-6 6-1.4-1.4Z',
  close:
    'M18.3 5.71 12 12l6.3 6.29-1.41 1.41L10.59 13.41 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.3-6.3 1.41 1.42Z',
  collapse: 'm15.4 16.6-4.6-4.6 4.6-4.6L14 6l-6 6 6 6 1.4-1.4Z',
  dashboard: 'M3 3h8v8H3V3Zm10 0h8v5h-8V3Zm0 7h8v11h-8V10ZM3 13h8v8H3v-8Z',
  debts: 'M6 2h9l5 5v15H6V2Zm2 2v16h10V9h-5V4H8Zm7 1.5V7h1.5L15 5.5ZM9 12h6v2H9v-2Zm0 4h6v2H9v-2Z',
  delete:
    'M7 21q-.825 0-1.412-.587A1.93 1.93 0 0 1 5 19V7H4V5h5V4h6v1h5v2h-1v12q0 .825-.587 1.413A1.93 1.93 0 0 1 17 21H7Zm2-4h2V9H9v8Zm4 0h2V9h-2v8Z',
  download: 'M11 3h2v10.17l3.59-3.58L18 11l-6 6-6-6 1.41-1.41L11 13.17V3ZM5 19h14v2H5v-2Z',
  edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.42l-2.34-2.34a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82Z',
  filter: 'M3 5h18l-7 8v5.5L10 21v-8L3 5Zm4.5 2 4.5 5.14L16.5 7h-9Z',
  help: 'M11 18h2v-2h-2v2Zm1-16a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-14a4 4 0 0 0-4 4h2a2 2 0 1 1 3.17 1.62C12.07 12.4 11 13.31 11 15h2c0-.79.56-1.29 1.33-1.84A4 4 0 0 0 12 6Z',
  import: 'M5 20h14v-2H5v2ZM12 2 6.5 7.5 8 9l3-3v9h2V6l3 3 1.5-1.5L12 2Z',
  info: 'M11 17h2v-6h-2v6Zm0-8h2V7h-2v2Zm1-7a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z',
  list: 'M4 5h16v3H4V5Zm0 5h16v3H4v-3Zm0 5h16v4H4v-4Z',
  logout:
    'M10 17v2H5V5h5v2H7v10h3Zm5.59-1.41L18.17 13H10v-2h8.17l-2.58-2.59L17 7l5 5-5 5-1.41-1.41Z',
  menu: 'M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z',
  parties:
    'M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C23 14.17 18.33 13 16 13Z',
  payments: 'M3 6h18v12H3V6Zm2 3v6h14V9H5Zm2 1h4v2H7v-2Zm9 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  refresh: 'M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6a6 6 0 0 1-10.48 4H5a8 8 0 1 0 7-12Z',
  users:
    'M12 12c2.21 0 4 -1.79 4 -4s-1.79 -4 -4 -4 -4 1.79 -4 4 1.79 4 4 4Zm0 2c-2.67 0 -8 1.34 -8 4v2h16v-2c0-2.66 -5.33 -4 -8 -4Z',
  visibility:
    'M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7Zm0 12c-4.44 0-7.54-3.57-8.73-5C4.46 10.57 7.56 7 12 7s7.54 3.57 8.73 5c-1.19 1.43-4.29 5-8.73 5Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  visibilityOff:
    'M3.27 2 2 3.27l3.05 3.05A11.8 11.8 0 0 0 1 12s4 7 11 7a10.8 10.8 0 0 0 4.16-.82L20.73 22 22 20.73 3.27 2ZM12 17c-4.44 0-7.54-3.57-8.73-5 .64-.77 1.83-2.12 3.28-3.17l1.55 1.55A4 4 0 0 0 13.62 15l1.06 1.06A8.8 8.8 0 0 1 12 17Zm4.19-.49-1.53-1.53A4 4 0 0 0 9.02 9.34L6.84 7.16A10.7 10.7 0 0 1 12 5c7 0 11 7 11 7s-2.33 4.08-6.81 5.51Z',
  warning: 'M1 21 12 2l11 19H1Zm12-3v-2h-2v2h2Zm0-4v-4h-2v4h2Z',
};

export function AppIcon({ name, ...props }: { name: AppIconName } & SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={paths[name]} />
    </SvgIcon>
  );
}
