import { Inter, Poppins } from "next/font/google";
import MuiProviders from "../components/providers/MuiProviders";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>QueueQuell - Restaurant Management</title>
        <meta name="description" content="Restaurant management system" />
        <link rel="icon" href="/queuequell-logo.png" />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily:
            "var(--font-inter), var(--font-poppins), Segoe UI, Roboto, system-ui, sans-serif",
        }}
        className={`${inter.variable} ${poppins.variable}`}
      >
        <MuiProviders>{children}</MuiProviders>
      </body>
    </html>
  );
}
