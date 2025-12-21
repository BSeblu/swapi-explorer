import { PeopleSearchField } from "@/components/people-search-field";
import { Suspense } from "react";

export default function PeopleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">People</h1>
                    <p className="text-muted-foreground">
                        Search and explore characters from the Star Wars universe.
                    </p>
                </div>

                <Suspense fallback={<div className="h-10 w-full max-w-sm rounded-lg bg-muted animate-pulse" />}>
                    <PeopleSearchField />
                </Suspense>

                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}
