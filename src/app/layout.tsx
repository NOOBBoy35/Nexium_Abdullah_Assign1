import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import AnimatedSnakeBackground from "@/components/AnimatedSnakeBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quote Generator",
  description: "An inspiring quote generator built with Next.js and ShadCN UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700 text-white`}
      >
        {/* SVG dot pattern overlay for subtle texture */}
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'3\' fill=\'white\' fill-opacity=\'0.10\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            opacity: 0.5,
          }}
        />
        {/* Animated snake/connecting lines background */}
        <AnimatedSnakeBackground />
        <NavBar />
        <main className="px-4 sm:px-8 md:px-12">{children}</main>
      </body>
    </html>
  );
}
