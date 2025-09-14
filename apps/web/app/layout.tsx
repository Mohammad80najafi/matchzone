import type { ReactNode } from "react";

export const metadata = {
  title: "Matchzone",
  description: "Phase 0 — Full Foundation"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
