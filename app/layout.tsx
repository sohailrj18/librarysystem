import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { Toaster } from "@/components/ui/toaster";
// import { ThemeProvider } from "@/components/theme-provider";
// import { Provider } from "react-redux";
// import { store } from "@/hooks/redux/store";
import Extreme from "@/layouts/Extreme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Library System",
  description: "A library management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Extreme>{children}</Extreme>
      </body>
    </html>
  );
}
