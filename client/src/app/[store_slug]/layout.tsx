import "@/app/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Ordering System ",
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
