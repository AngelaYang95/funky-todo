import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from 'next/font/google'
import "./globals.css";

 
const inter = Inter({
  variable: '--font-inter',
  subsets: ["latin"],
})

const ABCRomWide = localFont({
  src: "./fonts/ABCROMWide-Black-Trial.otf",
  variable: "--font-abcromwide",
});

export const metadata: Metadata = {
  title: "Funky Todo List",
  description: "Not your average todo list.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ABCRomWide.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
