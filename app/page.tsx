import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] bg-linear-to-b from-background to-accent/20 px-4 text-center">
            <div className="max-w-3xl space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-balance">
                    Explore the Galaxy with <span className="text-primary">SWAPI Explorer</span>
                </h1>
                <p className="text-xl text-muted-foreground text-balance">
                    Access data from the Star Wars universe. Browse people, planets, films, and more.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Link
                        href="/people"
                        className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}
                    >
                        <Users className="mr-2 h-5 w-5" />
                        Browse People
                    </Link>
                    <Link
                        href="https://swapi.dev/documentation"
                        target="_blank"
                        className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-8")}
                    >
                        API Documentation
                    </Link>
                </div>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 w-full max-w-5xl">
                <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Users className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-bold italic tracking-tighter">People</h2>
                    <p className="text-sm text-muted-foreground">82 characters from the saga</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-card border border-border shadow-sm opacity-50 grayscale cursor-not-allowed">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <span className="font-bold text-xs uppercase">Soon</span>
                    </div>
                    <h2 className="text-lg font-bold italic tracking-tighter">Planets</h2>
                    <p className="text-sm text-muted-foreground">Coming in next slice</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-card border border-border shadow-sm opacity-50 grayscale cursor-not-allowed">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <span className="font-bold text-xs uppercase">Soon</span>
                    </div>
                    <h2 className="text-lg font-bold italic tracking-tighter">Movies</h2>
                    <p className="text-sm text-muted-foreground">Coming in next slice</p>
                </div>
            </div>
        </div>
    );
}