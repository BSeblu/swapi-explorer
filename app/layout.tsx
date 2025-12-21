import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SWAPI Explorer",
  description: "Explore the Star Wars universe with SWAPI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, "dark")} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center gap-4 px-4 mx-auto">
              <Link href="/" className="font-bold text-xl tracking-tighter">
                SWAPI <span className="text-primary text-sm font-mono tracking-normal">Explorer</span>
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium">
                <Link href="/people" className="transition-colors hover:text-primary">
                  People
                </Link>
                <Link href="/planets" className="transition-colors hover:text-primary">
                  Planets
                </Link>
                <Link href="/species" className="transition-colors hover:text-primary">
                  Species
                </Link>
                <Link href="/starships" className="transition-colors hover:text-primary">
                  Starships
                </Link>
                <Link href="/films" className="transition-colors hover:text-primary">
                  Films
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

