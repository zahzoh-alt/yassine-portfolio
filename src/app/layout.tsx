import React from "react";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../styles/tailwind.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Ezzahi Yassine — Digital Learning Engineer",
  description:
    "Portfolio of Ezzahi Yassine, Digital Learning Engineer, LMS & Moodle Specialist, and Front-End Creative Developer specializing in immersive educational experiences.",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
  },
  openGraph: {
    title: "Ezzahi Yassine — Digital Learning Engineer",
    description:
      "Crafting the future of digital learning through immersive, learner-centred experiences.",
    images: [{ url: "/assets/images/app_logo.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        {children}
</body>
    </html>
  );
}