import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Users, Globe, Film, ChevronRight, Dna, Rocket, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] bg-linear-to-b from-background to-accent/20 px-4 py-12 text-center">
            <div className="max-w-3xl space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-balance">
                    Explore the Galaxy with <span className="text-primary font-mono tracking-tighter">SWAPI Explorer</span>
                </h1>
                <p className="text-xl text-muted-foreground text-balance">
                    Access deep data from the Star Wars universe. Browse characters, worlds, cinematic history, and more.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Link
                        href="/people"
                        className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}
                    >
                        <Users className="mr-2 h-5 w-5" />
                        Start Exploring
                    </Link>
                    <Link
                        href="https://swapi.py4e.com/api/"
                        target="_blank"
                        className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-8")}
                    >
                        API Source
                    </Link>
                </div>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl px-4">
                <Link href="/people" className="group">
                    <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-card border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/50 hover:-translate-y-1">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Users className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight">People</h2>
                            <p className="text-sm text-muted-foreground">Browse characters from the saga</p>
                        </div>
                        <div className="flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            View People <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                    </div>
                </Link>

                <Link href="/planets" className="group">
                    <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-card border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/50 hover:-translate-y-1">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Globe className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight">Planets</h2>
                            <p className="text-sm text-muted-foreground">Explore worlds and systems</p>
                        </div>
                        <div className="flex items-center text-xs font-semibold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Planets <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                    </div>
                </Link>

                <Link href="/species" className="group">
                    <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-card border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/50 hover:-translate-y-1">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <Dna className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight">Species</h2>
                            <p className="text-sm text-muted-foreground">Discover diverse inhabitants</p>
                        </div>
                        <div className="flex items-center text-xs font-semibold text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Species <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                    </div>
                </Link>

                <Link href="/starships" className="group">
                    <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-card border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/50 hover:-translate-y-1">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <Rocket className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight">Starships</h2>
                            <p className="text-sm text-muted-foreground">Behold majestic vessels</p>
                        </div>
                        <div className="flex items-center text-xs font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Starships <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                    </div>
                </Link>

                <Link href="/vehicles" className="group">
                    <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-card border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/50 hover:-translate-y-1">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight">Vehicles</h2>
                            <p className="text-sm text-muted-foreground">Explore various transports</p>
                        </div>
                        <div className="flex items-center text-xs font-semibold text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Vehicles <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                    </div>
                </Link>

                <Link href="/films" className="group">
                    <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-card border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/50 hover:-translate-y-1">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            <Film className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight">Films</h2>
                            <p className="text-sm text-muted-foreground">Relive the cinematic saga</p>
                        </div>
                        <div className="flex items-center text-xs font-semibold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Films <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}