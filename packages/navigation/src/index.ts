export type FrontendZone =
  "shell" | "partner-ops" | "payments" | "collection-ops";

export type NavigationIcon =
  | "aging"
  | "calendar"
  | "dashboard"
  | "debts"
  | "import"
  | "parties"
  | "payments"
  | "users";

export type NavigationItem = {
  href: string;
  label: string;
  icon: NavigationIcon;
  group: "workspace" | "manage";
  owner: FrontendZone;
  roles?: readonly string[];
};

export const navigationItems: readonly NavigationItem[] = [
  {
    href: "/",
    label: "Tổng quan",
    icon: "dashboard",
    group: "workspace",
    owner: "shell",
  },
  {
    href: "/parties",
    label: "Khách hàng & NCC",
    icon: "parties",
    group: "workspace",
    owner: "partner-ops",
  },
  {
    href: "/debts",
    label: "Công nợ",
    icon: "debts",
    group: "workspace",
    owner: "shell",
  },
  {
    href: "/overdue",
    label: "Quá hạn",
    icon: "calendar",
    group: "workspace",
    owner: "shell",
  },
  {
    href: "/reports/aging",
    label: "Tuổi nợ",
    icon: "aging",
    group: "workspace",
    owner: "shell",
  },
  {
    href: "/payments",
    label: "Thanh toán",
    icon: "payments",
    group: "workspace",
    owner: "payments",
  },
  {
    href: "/imports",
    label: "Import Excel",
    icon: "import",
    group: "manage",
    owner: "shell",
  },
  {
    href: "/users",
    label: "Phân quyền",
    icon: "users",
    group: "manage",
    owner: "shell",
    roles: ["ADMIN"],
  },
] as const;
