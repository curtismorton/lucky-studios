import { CmsAuthProvider } from "@/components/cms/CmsAuthProvider";
import { CmsShell } from "@/components/cms/CmsShell";

export default function CmsProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CmsAuthProvider>
      <CmsShell>{children}</CmsShell>
    </CmsAuthProvider>
  );
}
