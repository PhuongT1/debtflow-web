import { SvgIcon, type SvgIconProps } from "@mui/material";
import type { NavigationIcon } from "@debtflow/navigation";

export type AppIconName = NavigationIcon
  | "collapse"
  | "logout"
  | "menu";

const paths: Record<AppIconName, string> = {
  aging: "M4 19h16v2H4v-2Zm1-8h3v6H5v-6Zm5-6h3v12h-3V5Zm5 3h3v9h-3V8Z",
  calendar: "M7 2h2v2h6V2h2v2h3v18H4V4h3V2Zm11 8H6v10h12V10ZM6 6v2h12V6H6Z",
  collapse: "m15.4 16.6-4.6-4.6 4.6-4.6L14 6l-6 6 6 6 1.4-1.4Z",
  dashboard: "M3 3h8v8H3V3Zm10 0h8v5h-8V3Zm0 7h8v11h-8V10ZM3 13h8v8H3v-8Z",
  debts: "M6 2h9l5 5v15H6V2Zm2 2v16h10V9h-5V4H8Zm7 1.5V7h1.5L15 5.5ZM9 12h6v2H9v-2Zm0 4h6v2H9v-2Z",
  import: "M5 20h14v-2H5v2ZM12 2 6.5 7.5 8 9l3-3v9h2V6l3 3 1.5-1.5L12 2Z",
  logout: "M10 17v2H5V5h5v2H7v10h3Zm5.59-1.41L18.17 13H10v-2h8.17l-2.58-2.59L17 7l5 5-5 5-1.41-1.41Z",
  menu: "M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z",
  parties: "M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C23 14.17 18.33 13 16 13Z",
  payments: "M3 6h18v12H3V6Zm2 3v6h14V9H5Zm2 1h4v2H7v-2Zm9 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  users: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z",
};

export function AppIcon({ name, ...props }: { name: AppIconName } & SvgIconProps) {
  return <SvgIcon {...props}><path d={paths[name]} /></SvgIcon>;
}
