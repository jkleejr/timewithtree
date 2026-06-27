import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description: string;
  path: string; // route path beginning with "/"
  ogType?: "website" | "article" | "product";
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

const SITE_URL = "https://timewithtree.co.kr";

export const Seo = ({ title, description, path, ogType = "website", image, jsonLd, noindex }: SeoProps) => {
  const url = `${SITE_URL}${path}`;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};

