import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import { GlobalOverlays } from "@/components/ui/GlobalOverlays";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { DataProvider } from "@/components/auth/DataProvider";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";
import { ServiceWorkerRegister } from "@/components/ui/ServiceWorkerRegister";
import "./globals.css";

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const fontWordmark = Fraunces({
  subsets: ["latin"],
  variable: "--font-wordmark",
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "AMISTRIÉ — Precision 3D Printing Studio",
  description:
    "Scroll-driven, cinematic 3D printing showcase. Real-time material switching, a live printed-object catalog, and custom STL/OBJ/3MF upload with instant estimates.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Amistrié",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${fontDisplay.variable} ${fontWordmark.variable} ${fontSans.variable} ${fontMono.variable} font-sans bg-studio-void`}
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <AuthProvider />
        <DataProvider />
        <GlobalOverlays />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
