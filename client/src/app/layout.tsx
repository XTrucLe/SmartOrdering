import AppProvider from "@/components/common/Provider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="">
      <body className="min-h-screen bg-background">
        <AppProvider>
          <main className="w-full flex-1">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
