import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./Provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// Get base URL with fallback for build time
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // browser
    return window.location.origin;
  }
  // server
  return process.env.NEXT_PUBLIC_APP_URL || 'https://macroj.tausifansari.com/';
};

export const metadata: Metadata = {
  title: "MACROJ",
  description: "Publish your article with us.",
  authors: [
    {
      name: "Tausif Ansari",
      url: "https://tausifansari.com/",
    },
    {
      name: "Tausif Ansari (GitHub)",
      url: "https://github.com/tausif64",
    },
    {
      name: "Tausif Ansari (LinkedIn)",
      url: "https://linkedin.com/in/tausifansari64",
    },
  ],
  openGraph: {
    title: "MACROJ",
    description: "Publish your article with us.",
    url: getBaseUrl(),
    siteName: "MACROJ",
    images: [
      {
        url: `${getBaseUrl()}/og.jpg`,
        width: 1200,
        height: 63,
        alt: "MACROJ Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MACROJ",
    description: "Publish your article with us.",
    images: [`${getBaseUrl()}/og.jpg`],
    creator: "@tausif_ansari64",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <Toaster position="top-center" offset="45vh" duration={3500} closeButton />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}