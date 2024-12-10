import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "QuizMaster",
  description: "A Simple Quiz Platform for Learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
