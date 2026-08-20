"use client";
// Force rebuild
import "./globals.css";
import "katex/dist/katex.min.css";
import { TestProvider } from "./context/TestContext"; // Relative bypass mapping!

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TestProvider>
          {children}
        </TestProvider>
      </body>
    </html>
  );
}