import { PlanetsSearchField } from "@/components/planets-search-field";
import { Suspense } from "react";

export default function PlanetsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Planets</h1>
                    <p className="text-muted-foreground">
                        Explore the worlds of the Star Wars universe.
                    </p>
                </div>

                <Suspense fallback={<div className="h-10 w-full max-w-sm rounded-lg bg-muted animate-pulse" />}>
                    <PlanetsSearchField />
                </Suspense>

                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}
