import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "ICS C Programming Learning Lab | Interactive Visual Execution",
  description:
    "An interactive visual programming lab designed for first-trimester undergraduate novices learning C. Understand memory, state changes, conditions, and loops through step-by-step execution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
