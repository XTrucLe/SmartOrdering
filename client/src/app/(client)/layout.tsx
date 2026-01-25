export default function ClientLayout({
  children,
  // params,
}: {
  children: React.ReactNode;
  params: { store_slug: string };
}) {
  return <main>{children}</main>;
}
