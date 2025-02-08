import type { Metadata } from "next";
import { Poppins, Zen_Kaku_Gothic_Antique } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const zenKakuGothicAntique = Zen_Kaku_Gothic_Antique({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-zen-kaku-gothic-antique",
});

export const metadata: Metadata = {
  title: "Collection Management",
  description: "Collection Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${zenKakuGothicAntique.variable}`}>
      <body className="font-poppins antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
