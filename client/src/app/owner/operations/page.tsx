import { redirect } from "next/navigation";

function page() {
  return redirect("/owner/operations/orders");
}

export default page;
