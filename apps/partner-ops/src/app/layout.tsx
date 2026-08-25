import type { Metadata } from "next";
import { AppProviders } from "@debtflow/react-ui";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Customer Operations | Debt Flow",
  description: "Customer and supplier operations micro frontend",
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
