import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="">
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  );
}
