import type { Metadata } from "next";
import localFont from "next/font/local";
import { Manrope } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SvgPageTransitionProvider } from "@/components/SvgPageTransition";
import BackToTop from "@/components/BackToTop";
import CustomCursor from "@/components/CustomCursor";

const clashDisplay = localFont({
  src: "../public/fonts/ClashDisplay-Medium.woff2",
  variable: "--font-clash",
  weight: "500",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const themeScript = `
  (function() {
    try {
      var saved = localStorage.getItem('converge_theme_preference');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'light' || (saved === 'system' && !prefersDark)) {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch (e) {}
  })();
`;

export const metadata: Metadata = {
  title: "Converge Digitals® — Full-Cycle Digital Growth Company",
  description:
    "We run the full digital growth cycle for ambitious brands — website, brand, content, ads, and AI automation.",
  keywords: [
    "Converge Digitals",
    "Full-Cycle Digital Company",
    "Web Development",
    "Branding",
    "Social Media Marketing",
    "Performance Ads",
    "AI Automation",
    "India Company",
  ],
  authors: [{ name: "Converge Digitals Team" }],
  creator: "Converge Digitals",
  openGraph: {
    title: "Converge Digitals® — Full-Cycle Digital Growth Company",
    description:
      "We run the full digital growth cycle for ambitious brands — website, brand, content, ads, and AI automation.",
    url: "https://convergedigitals.com",
    siteName: "Converge Digitals",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Converge Digitals Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Converge Digitals® — Full-Cycle Digital Growth Company",
    description:
      "We run the full digital growth cycle for ambitious brands — website, brand, content, ads, and AI automation.",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/favicon.jpeg",
    shortcut: "/favicon.ico",
    apple: "/images/favicon.jpeg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Converge Digitals",
  url: "https://convergedigitals.com",
  description:
    "We craft high-performing digital experiences that elevate brands and drive measurable growth. Branding, Web Design, AI & Development.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.linkedin.com/company/converge-digitals/",
    "https://x.com/ConvergeDigit",
    "https://www.instagram.com/convergedigitals",
    "https://contra.com/converge_digitals_4d28indg",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${clashDisplay.variable} ${manrope.variable} dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#f7f8fa] dark:bg-[#050507] text-neutral-900 dark:text-white font-sans antialiased selection:bg-accent selection:text-white" suppressHydrationWarning>
        <ThemeProvider>
          <SvgPageTransitionProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-md focus:font-sans focus:text-xs focus:font-semibold focus:uppercase focus:tracking-wider"
            >
              Skip to content
            </a>
            <BackToTop />
            <CustomCursor />
            <SmoothScroll>
              <main id="main">{children}</main>
            </SmoothScroll>
          </SvgPageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

