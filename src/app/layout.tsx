import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/Nav/Nav";
import PhoneMenu from "./components/Nav/PhoneMenu";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import ReduxProvider from "./ReduxProvider";
import AuthInitializer from "./components/Auth/AuthInitializer";
import AIChatBot from "./components/AI/AIChatBot";

export const metadata: Metadata = {
  title: "DevMap",
  description: "Master your tech journey with structured learning roadmaps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans">
        <Suspense>
          <ReduxProvider>
            <AuthInitializer />
            <Toaster reverseOrder={false} position="top-center" />
            <Nav />
            {children}
            <AIChatBot />
            <PhoneMenu />
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  );
}
