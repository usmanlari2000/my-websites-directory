import { toSlug } from "@/utils";
import { Suspense } from "react";
import OtherDirectoryFallback from "@/components/other-directory-fallback";
import OtherDirectory from "@/components/other-directory";

export const dynamicParams = false;

export async function generateStaticParams() {
  const { hostingProviders } = await fetch(
    `${process.env.SITE_URL}/api/providers`
  ).then((res) => res.json());

  return hostingProviders.map((item) => ({
    slug: toSlug(item.name),
  }));
}

export async function generateMetadata({ params }) {
  const { hostingProviders } = await fetch(
    `${process.env.SITE_URL}/api/providers`
  ).then((res) => res.json());

  const { slug } = await params;

  const hostingProvider = hostingProviders.find(
    (item) => toSlug(item.name) === slug
  );

  return {
    title: `${hostingProvider.name} Hosted Websites Directory - MyWebsitesDirectory`,
  };
}

export default async function Page({ params }) {
  const { hostingProviders } = await fetch(
    `${process.env.SITE_URL}/api/providers`
  ).then((res) => res.json());

  const { slug } = await params;

  const hostingProvider = hostingProviders.find(
    (item) => toSlug(item.name) === slug
  );

  return (
    <Suspense
      fallback={<OtherDirectoryFallback hostingProvider={hostingProvider} />}
    >
      <OtherDirectory hostingProvider={hostingProvider} />
    </Suspense>
  );
}
