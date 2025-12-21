import { searchStarships, extractIdFromUrl } from "@/lib/swapi/starships";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Rocket, Users, Settings } from "lucide-react";

export default async function StarshipsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) {
    const { search } = await searchParams;
    const response = await searchStarships(search || "");

    if (response.results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground text-lg">No starships found matching "{search}"</p>
                <p className="text-sm text-muted-foreground">Try a different search term.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {response.results.map((starship) => {
                const id = extractIdFromUrl(starship.url);
                return (
                    <Link key={starship.url} href={`/starships/${id}`} className="group">
                        <Card className="h-full transition-colors hover:border-primary/50">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Rocket className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                        {starship.name}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Settings className="h-4 w-4" />
                                    <span className="capitalize">{starship.starship_class}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>Crew: {starship.crew}</span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                        {starship.model.split(',')[0]}
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
