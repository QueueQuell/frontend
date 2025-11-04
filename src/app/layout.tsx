"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MuiProviders from "./components/MuiProviders";
import PageTransition from "./components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="queuequell-logo.png" />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: "Segoe UI, Roboto, system-ui, sans-serif",
        }}
      >
        <MuiProviders>
          <PageTransition>
            {children}
          </PageTransition>
        </MuiProviders>
      </body>
    </html>
  );
}
