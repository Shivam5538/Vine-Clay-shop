import type { Metadata } from "next";
import { Fraunces, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vine & Clay — Unhurried Coffee & Ceramic Studio",
  description:
    "An earthy, slow-crafted cafe and ceramic workshop. Savor single-origin pourovers, stoneground matcha, slow-fermented pastries, and handmade stoneware in an unhurried atmosphere.",
  keywords: ["Vine and Clay", "Craft Coffee", "Ceramic Studio", "Artisanal Bakery", "Pourover Coffee", "Slow Living"],
  openGraph: {
    title: "Vine & Clay — Unhurried Coffee & Ceramic Studio",
    description: "Savor single-origin pourovers, stoneground matcha, and handmade stoneware.",
    url: "https://vineandclay.com",
    siteName: "Vine & Clay",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased selection:bg-[#C1633B] selection:text-[#FBF6EF]`}
    >
      <body className="min-h-full flex flex-col bg-[#FBF6EF] text-[#33241A] font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

