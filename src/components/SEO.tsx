import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  articlePublishedTime?: string;
  articleAuthor?: string;
}

const SITE_NAME = "AktivNatura - Planinarsko Društvo";
const DEFAULT_DESCRIPTION = "Pridruži se AktivNatura planinskom društvu i istraži najljepše planine Hrvatske. Organiziramo redovite izlete za sve uzraste i razine kondicije.";
const BASE_URL = "https://pd-aktivnatura.hr";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

// JSON-LD Structured Data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AktivNatura - Planinarsko Društvo",
  "alternateName": "PD AktivNatura",
  "url": BASE_URL,
  "logo": `${BASE_URL}/og-image.jpg`,
  "description": DEFAULT_DESCRIPTION,
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "HR"
  },
  "sameAs": []
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SITE_NAME,
  "url": BASE_URL,
  "description": DEFAULT_DESCRIPTION,
  "inLanguage": "hr-HR",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${BASE_URL}/izleti`,
    "query-input": "required name=search_term_string"
  }
};

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noindex = false,
  articlePublishedTime,
  articleAuthor,
}: SEOProps) => {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;

  // Create breadcrumb schema for better navigation in search results
  const breadcrumbSchema = canonical ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Početna",
        "item": BASE_URL
      },
      ...(canonical !== "/" ? [{
        "@type": "ListItem",
        "position": 2,
        "name": title,
        "item": `${BASE_URL}${canonical}`
      }] : [])
    ]
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Planinarsko Društvo AktivNatura" />
      <meta name="geo.region" content="HR" />
      <meta name="geo.placename" content="Hrvatska" />
      <meta name="language" content="Croatian" />
      <meta httpEquiv="content-language" content="hr" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="hr_HR" />
      
      {/* Article specific OG tags */}
      {ogType === "article" && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {ogType === "article" && articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};
