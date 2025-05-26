import { Suspense } from "react";
import ProvidersDirectoryFallback from "@/components/providers-directory-fallback";
import ProvidersDirectory from "@/components/providers-directory";

export const metadata = {
  title: "Hosting Providers Directory - MyWebsitesDirectory",
};

export default function Page() {
  return (
    <Suspense fallback={<ProvidersDirectoryFallback />}>
      <ProvidersDirectory />
    </Suspense>
  );
}
