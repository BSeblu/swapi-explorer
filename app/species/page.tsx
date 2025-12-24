import { searchSpecies, extractIdFromUrl } from "@/lib/swapi/species";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Dna, Globe, Languages } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { Suspense } from "react";
import { SearchField } from "@/components/search-field";

export default async function SpeciesPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; page?: string }>;
}) {
    const { search = "", page = "1" } = await searchParams;
    const pageNumber = Number(page) || 1;
    const response = await searchSpecies(search, pageNumber);

    if (response.results.length === 0) {
        return (
            <div className="flex flex-col gap-8">
                <SearchField
                    action="/species"
                    placeholder="Search species..."
                    defaultValue={search}
                />
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground text-lg">No species found matching "{search}"</p>
                    <p className="text-sm text-muted-foreground">Try a different search term.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <SearchField
                action="/species"
                placeholder="Search species..."
                defaultValue={search}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {response.results.map((species) => {
                    const id = extractIdFromUrl(species.url);
                    return (
                        <Link key={species.url} href={`/species/${id}`} className="group">
                            <Card className="h-full transition-colors hover:border-primary/50">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Dna className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                            {species.name}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Languages className="h-4 w-4" />
                                        <span>Language: {species.language}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Globe className="h-4 w-4" />
                                        <span className="capitalize">Classification: {species.classification}</span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            {species.designation}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            <Suspense>
                <Pagination count={response.count} />
            </Suspense>
        </div>
    );
}
