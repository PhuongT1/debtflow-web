import type { AppLocale } from "@debtflow/contracts";

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
  label: string | { vi: string; en: string };
  icon: NavigationIcon;
  group: "workspace" | "manage";
  owner: FrontendZone;
  roles?: readonly string[];
};

export function getNavigationLabel(item: NavigationItem, locale: AppLocale = "vi"): string {
  if (typeof item.label === "string") return item.label;
  return item.label[locale] ?? item.label.vi;
}

export const navigationItems: readonly NavigationItem[] = [
  {
    href: "/",
    label: { vi: "Tổng quan", en: "Overview" },
    icon: "dashboard",
    group: "workspace",
    owner: "shell",
  },
  {
    href: "/parties",
    label: { vi: "Khách hàng & NCC", en: "Partners" },
    icon: "parties",
    group: "workspace",
    owner: "partner-ops",
  },
  {
    href: "/debts",
    label: { vi: "Công nợ", en: "Debts" },
    icon: "debts",
    group: "workspace",
    owner: "shell",
  },
  {
    href: "/overdue",
    label: { vi: "Quá hạn", en: "Overdue" },
    icon: "calendar",
    group: "workspace",
    owner: "shell",
  },
  {
    href: "/reports/aging",
    label: { vi: "Tuổi nợ", en: "Aging" },
    icon: "aging",
    group: "workspace",
    owner: "shell",
  },
  {
    href: "/payments",
    label: { vi: "Thanh toán", en: "Payments" },
    icon: "payments",
    group: "workspace",
    owner: "payments",
  },
  {
    href: "/imports",
    label: { vi: "Import Excel", en: "Import Excel" },
    icon: "import",
    group: "manage",
    owner: "shell",
  },
  {
    href: "/users",
    label: { vi: "Phân quyền", en: "User Access" },
    icon: "users",
    group: "manage",
    owner: "shell",
    roles: ["ADMIN"],
  },
] as const;
