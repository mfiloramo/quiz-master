import React from "react";
import type { Metadata } from "next";
import { NextFont } from "next/dist/compiled/@next/font";
import "./globals.css";
import { Poppins } from 'next/font/google'
import Navbar from "@/components/navbar/navbar";

const poppins_light: NextFont = Poppins({ weight: "200" });
const poppins_heavy: NextFont = Poppins({ weight: "400" });

export const metadata: Metadata = {
  title: "QuizMaster",
  description: "A Simple Quiz Platform for Learning",
};

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ poppins_heavy.className } suppressHydrationWarning>
    <body className="antialiased bg-white">
    <Navbar/>
    { children }
    </body>
    </html>
  );
}
