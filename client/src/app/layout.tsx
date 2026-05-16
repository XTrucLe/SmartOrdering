import AppProvider from "@/components/common/Provider";
import { Toaster } from "sonner";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="">
      <body className="min-h-screen bg-background">
        <AppProvider>
          <Toaster position="top-right" closeButton />
          <div className="flex-1">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}
