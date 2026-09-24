import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import SiteLayoutWrapper from "@/components/SiteLayoutWrapper";
import ScrollToTop from "@/components/ScrollToTop";
import JsonLd from "@/components/JsonLd";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--sans",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--serif",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://drrattanentclinic.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dr. Rattan ENT Clinic — Best ENT Specialists in Chandigarh",
    template: "%s | Dr. Rattan ENT Clinic",
  },
  description: "Expert ENT care in Chandigarh by PGI-trained surgeons. Ear, nose, throat, hearing aids, vertigo, cochlear implants, skull base surgery. Sector 33C, Chandigarh.",
  keywords: [
    "ENT Specialist Chandigarh",
    "Best ENT Doctor Chandigarh",
    "Dr Ganesh Dutt Rattan",
    "Dr Anav Rattan",
    "Ear Surgery Chandigarh",
    "Cochlear Implant Chandigarh",
    "Sinus Surgery FESS",
    "Hearing Loss Clinic",
    "Vertigo Treatment Chandigarh",
  ],
  authors: [{ name: "Dr. Ganesh Dutt Rattan" }, { name: "Dr. Anav Rattan" }],
  creator: "Dr. Rattan ENT Clinic",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Dr. Rattan ENT Clinic",
    title: "Dr. Rattan ENT Clinic — Best ENT Specialists in Chandigarh",
    description: "Expert ENT care in Chandigarh by PGI-trained surgeons. Comprehensive ear, nose, throat, hearing, voice, and skull base care.",
    images: [
      {
        url: "/images/dr-rattan-and-dr-anav-rattan-hero2.png",
        width: 1200,
        height: 630,
        alt: "Dr. Ganesh Dutt Rattan & Dr. Anav Rattan - ENT Specialists Chandigarh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Rattan ENT Clinic — Best ENT Specialists in Chandigarh",
    description: "Expert ENT care in Chandigarh by PGI-trained surgeons. Sector 33C, Chandigarh.",
    images: ["/images/dr-rattan-and-dr-anav-rattan-hero2.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <body>
        <JsonLd />
        <ScrollToTop />
        <SiteLayoutWrapper>{children}</SiteLayoutWrapper>
      </body>
    </html>
  );
}
