import { redirect } from "next/navigation";

export default function LegacyAdminRedirectPage() {
  redirect("/cms/login");
}
