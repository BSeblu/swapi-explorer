import { searchPlanets, extractIdFromUrl } from "@/lib/swapi/planets";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Globe, Users, Thermometer } from "lucide-react";

export default async function PlanetsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) {
    const { search } = await searchParams;
    const response = await searchPlanets(search || "");

    if (response.results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground text-lg">No planets found matching "{search}"</p>
                <p className="text-sm text-muted-foreground">Try a different search term.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {response.results.map((planet) => {
                const id = extractIdFromUrl(planet.url);
                return (
                    <Link key={planet.url} href={`/planets/${id}`} className="group">
                        <Card className="h-full transition-colors hover:border-primary/50">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                        {planet.name}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>Population: {planet.population === "unknown" ? "Unknown" : Number(planet.population).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Thermometer className="h-4 w-4" />
                                    <span className="capitalize">Climate: {planet.climate}</span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                        {planet.terrain.split(',')[0]}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}
