import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import Header from "~/components/header";
import { Providers } from "~/providers";

export const metadata: Metadata = {
  title: "Contractor",
  description: "Manage construction project contracts and proposals",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${geist.variable}`}>
      <body>
        <Providers>
          <div className="bg-background min-h-screen">
            <Header />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
