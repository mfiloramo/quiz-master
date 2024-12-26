import React from "react";
import type { Metadata } from "next";
import { NextFont } from "next/dist/compiled/@next/font";
import "./globals.css";
import { Bitter } from 'next/font/google'
import Navbar from "@/components/navbar/navbar";

const bitter: NextFont = Bitter({ subsets: [ 'latin' ]});

export const metadata: Metadata = {
  title: "QuizMaster",
  description: "A Simple Quiz Platform for Learning",
};

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ bitter.className } suppressHydrationWarning>
    <body className="antialiased bg-white">
    <Navbar/>
    { children }
    </body>
    </html>
  );
}
