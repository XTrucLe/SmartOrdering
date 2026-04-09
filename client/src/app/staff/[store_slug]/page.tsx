import { redirect } from "next/navigation";

export default async function StaffPage({
  params,
}: {
  params: { store_slug: string };
}) {
  const { store_slug } = await params;
  redirect(`${store_slug}/order`);
}
