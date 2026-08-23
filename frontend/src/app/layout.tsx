import type { Metadata, Viewport } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { TestProvider } from "./context/TestContext";

export const metadata: Metadata = {
  title: {
    default: "ILoveStudy — Free Official PYQ Tests for JEE, NEET, SSC & GATE",
    template: "%s | ILoveStudy",
  },
  description:
    "ILoveStudy (ilovestudy.in) is India's leading free platform for official PYQ question papers, real CBT mock test workspaces, and step-by-step solutions for JEE Main, NEET, SSC CGL, and GATE exams.",
  keywords: [
    "ILoveStudy",
    "ilovestudy",
    "i love study",
    "ilovestudy.in",
    "ilovestudy.com",
    "ilovestudy app",
    "ilovestudy pyq",
    "ilovestudy jee",
    "ilovestudy neet",
    "ilovestudy ssc",
    "ilovestudy gate",
    "JEE Main PYQ",
    "NEET Mock Test",
    "GATE CBT Exam",
    "SSC CGL Practice",
    "Free Mock Test Portal",
  ],
  authors: [{ name: "ILoveStudy", url: "https://ilovestudy.in" }],
  metadataBase: new URL("https://ilovestudy.in"),
  alternates: {
    canonical: "https://ilovestudy.in",
  },
  icons: {
    icon: [
      { url: "/logo_card.jpeg", type: "image/jpeg" },
      { url: "/icon.jpeg", type: "image/jpeg" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/logo_card.jpeg",
    apple: "/logo_card.jpeg",
  },
  openGraph: {
    title: "ILoveStudy — Free Official PYQ Tests for JEE, NEET, SSC & GATE",
    description:
      "Prepare, practice, and excel in national competitive exams with real-time analytics, official CBT mock test workspaces, and full PYQ papers on ilovestudy.in.",
    url: "https://ilovestudy.in",
    siteName: "ILoveStudy",
    images: [
      {
        url: "/logo_card.jpeg",
        width: 800,
        height: 800,
        alt: "ILoveStudy Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ILoveStudy — Free Official PYQ Tests for JEE, NEET, SSC & GATE",
    description:
      "Prepare, practice, and excel in national competitive exams with real-time analytics, official CBT mock test workspaces, and full PYQ papers on ilovestudy.in.",
    images: ["/logo_card.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google1f8dfddf4851634e",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ilovestudy.in/#website",
      "url": "https://ilovestudy.in",
      "name": "ILoveStudy",
      "alternateName": ["ilovestudy", "I Love Study", "ILoveStudy.in"],
      "description": "Free Official PYQ Tests for JEE, NEET, SSC & GATE Exams",
      "publisher": {
        "@id": "https://ilovestudy.in/#organization"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://ilovestudy.in/#organization",
      "name": "ILoveStudy",
      "url": "https://ilovestudy.in",
      "logo": "https://ilovestudy.in/logo_card.jpeg",
      "sameAs": [
        "https://ilovestudy.in"
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo_card.jpeg?v=2" type="image/jpeg" sizes="any" />
        <link rel="icon" href="/icon.jpeg?v=2" type="image/jpeg" sizes="any" />
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="shortcut icon" href="/logo_card.jpeg?v=2" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo_card.jpeg?v=2" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <TestProvider>{children}</TestProvider>
      </body>
    </html>
  );
}