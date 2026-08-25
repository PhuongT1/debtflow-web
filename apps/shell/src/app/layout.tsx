import type { Metadata } from "next";
import { AppProviders } from "@debtflow/react-ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sales Debt Management",
  description: "Quản lý công nợ phải thu và phải trả",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
