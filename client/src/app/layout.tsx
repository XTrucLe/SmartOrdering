import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Ordering",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="">{children}</body>
    </html>
  );
}
