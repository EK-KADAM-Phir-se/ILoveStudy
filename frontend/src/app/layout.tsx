import type { Metadata, Viewport } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { TestProvider } from "./context/TestContext";

export const metadata: Metadata = {
  title: {
    default: "Love Study | PYQ Tests for JEE, NEET, SSC & GATE",
    template: "%s | Love Study",
  },
  description:
    "Prepare, practice, and excel in JEE, NEET, SSC, GATE and national competitive exams with real-time analytics, official CBT mock test workspaces, and full PYQ papers on ilovestudy.in.",
  keywords: [
    "Love Study",
    "ilovestudy.in",
    "JEE Main PYQ",
    "NEET Mock Test",
    "GATE CBT Exam",
    "SSC CGL Practice",
    "Mock Test Portal",
  ],
  authors: [{ name: "Love Study", url: "https://ilovestudy.in" }],
  metadataBase: new URL("https://ilovestudy.in"),
  alternates: {
    canonical: "https://ilovestudy.in",
  },
  icons: {
    icon: [
      { url: "/logo.jpeg", type: "image/jpeg" },
      { url: "/icon.jpeg", type: "image/jpeg" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/logo.jpeg",
    apple: "/apple-icon.jpeg",
  },
  openGraph: {
    title: "Love Study | PYQ Tests for JEE, NEET, SSC & GATE",
    description:
      "Prepare, practice, and excel in your exams with real-time analytics, official CBT mock test workspaces, and full PYQ papers on ilovestudy.in.",
    url: "https://ilovestudy.in",
    siteName: "Love Study",
    images: [
      {
        url: "/logo.jpeg",
        width: 800,
        height: 800,
        alt: "Love Study Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Love Study | PYQ Tests for JEE, NEET, SSC & GATE",
    description:
      "Prepare, practice, and excel in your exams with real-time analytics, official CBT mock test workspaces, and full PYQ papers on ilovestudy.in.",
    images: ["/logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.jpeg" type="image/jpeg" sizes="any" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/logo.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/apple-icon.jpeg" />
      </head>
      <body>
        <TestProvider>{children}</TestProvider>
      </body>
    </html>
  );
}