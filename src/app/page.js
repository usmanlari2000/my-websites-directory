import { Suspense } from "react";
import MainDirectoryFallback from "@/components/main-directory-fallback";
import MainDirectory from "@/components/main-directory";

export const metadata = {
  title: "Global Websites Directory - MyWebsitesDirectory",
};

export default function Page() {
  return (
    <Suspense fallback={<MainDirectoryFallback />}>
      <MainDirectory />
    </Suspense>
  );
}
