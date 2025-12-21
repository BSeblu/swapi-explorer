import { searchPeople, extractIdFromUrl } from "@/lib/swapi/people";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function PeoplePage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) {
    const query = (await searchParams).search || "";
    const data = await searchPeople(query);

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.results.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                    No characters found matching "{query}"
                </div>
            ) : (
                data.results.map((person) => {
                    const id = extractIdFromUrl(person.url);
                    return (
                        <Link key={person.url} href={`/people/${id}`} className="group">
                            <Card className="h-full transition-colors group-hover:border-primary/50 group-hover:bg-accent/50">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl">{person.name}</CardTitle>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                    </div>
                                    <CardDescription>
                                        {person.gender !== "n/a" ? person.gender : "No gender"} • Birth Year: {person.birth_year}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            {person.height}cm
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {person.mass}kg
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })
            )}
        </div>
    );
}
