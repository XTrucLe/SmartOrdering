import { redirect } from "next/navigation";

export default function StaffPage({
  params,
}: {
  params: { store_slug: string };
}) {
  redirect(`/staff/${params.store_slug}/dashboard`);
}
