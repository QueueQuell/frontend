"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MuiProviders from "./components/MuiProviders";

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
  // Do NOT wrap children with CommonLayout here so the landing/login page can render standalone.
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Segoe UI, Roboto, system-ui, sans-serif",
          background: "#f5f6f8",
        }}
      >
        <MuiProviders>{children}</MuiProviders>
      </body>
    </html>
  );
}
