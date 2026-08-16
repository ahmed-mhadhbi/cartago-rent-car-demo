import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cartago-rent-car.pages.dev"),
  title: "Cartago Rent Car Mahdia | Location de voitures",
  description: "Location de voitures à Mahdia. Consultez les véhicules, obtenez une estimation et envoyez votre demande de réservation directement sur WhatsApp.",
  openGraph: {
    title: "Cartago Rent Car Mahdia | Location de voitures",
    description: "Votre voiture à Mahdia, avec estimation instantanée et confirmation WhatsApp.",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Cartago Rent Car — Votre voiture. Votre liberté." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cartago Rent Car Mahdia",
    description: "Location simple et rapide à Mahdia.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body className={`${geist.variable} antialiased`}>{children}</body></html>;
}
