import React from "react";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "../styles/tailwind.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

/** Display face for monumental titles. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050816",
  colorScheme: "dark",
};

const description =
  "Portfolio of Ezzahi Yassine, Digital Learning Engineer, LMS & Moodle Specialist, and Front-End Creative Developer specializing in immersive educational experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Ezzahi Yassine — Digital Learning Engineer",
  description,
  keywords: [
    "Ezzahi Yassine",
    "Digital Learning",
    "Instructional Design",
    "Moodle LMS",
    "SCORM",
    "STEM Robotics",
    "E-learning",
    "Ingénieur Digital Learning",
  ],
  authors: [{ name: "Ezzahi Yassine" }],
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
  },
  openGraph: {
    type: "website",
    title: "Ezzahi Yassine — Digital Learning Engineer",
    description: "Crafting the future of digital learning through immersive, learner-centred experiences.",
    images: [{ url: "/assets/images/app_logo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ezzahi Yassine — Digital Learning Engineer",
    description,
    images: ["/assets/images/app_logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables JS-only reveal animations without hiding content for no-JS visitors */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className={plusJakartaSans.className}>{children}</body>
    </html>
  );
}
