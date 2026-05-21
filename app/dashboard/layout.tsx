import { redirect } from "next/navigation";

export default function LegacyDashboardRedirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  void children;
  redirect("/cms");
}
