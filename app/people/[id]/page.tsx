import { getPerson } from "@/lib/swapi/people";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Calendar, Scale, Ruler, Palette } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    try {
        const person = await getPerson(id);
        return {
            title: `${person.name} - SWAPI Explorer`,
            description: `Details for Star Wars character ${person.name}`,
        };
    } catch {
        return {
            title: "Character Not Found - SWAPI Explorer",
        };
    }
}

export default async function PersonPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    try {
        const person = await getPerson(id);

        return (
            <div className="flex flex-col gap-6">
                <Link
                    href="/people"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to list
                </Link>

                <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                    <Card className="h-fit">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <User className="h-10 w-10" />
                            </div>
                            <CardTitle className="text-2xl">{person.name}</CardTitle>
                            <CardDescription>Character Profile</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Born: {person.birth_year}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Homeworld: {person.homeworld}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Badge variant="secondary">{person.gender}</Badge>
                                {person.species.length > 0 && <Badge>Species</Badge>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Physical Attributes</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3">
                                    <Ruler className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Height</span>
                                        <span className="font-medium">{person.height} cm</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Scale className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Mass</span>
                                        <span className="font-medium">{person.mass} kg</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Palette className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Hair Color</span>
                                        <span className="font-medium capitalize">{person.hair_color}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Palette className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Skin Color</span>
                                        <span className="font-medium capitalize">{person.skin_color}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Palette className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Eye Color</span>
                                        <span className="font-medium capitalize">{person.eye_color}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Films</CardTitle>
                                    <CardDescription>Appeared in {person.films.length} films</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground list-disc pl-4">
                                        {person.films.slice(0, 5).map(film => (
                                            <li key={film} className="mb-1 truncate">{film}</li>
                                        ))}
                                        {person.films.length > 5 && <li>...and {person.films.length - 5} more</li>}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Vehicles & Ships</CardTitle>
                                    <CardDescription>Piloted {person.vehicles.length + person.starships.length} crafts</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Vehicles:</span> {person.vehicles.length}
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Starships:</span> {person.starships.length}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <h2 className="text-2xl font-bold">Character not found</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    We couldn't find the character with ID "{id}". It might not exist in the database or there was an error fetching the data.
                </p>
                <Link href="/people" className="text-primary hover:underline">
                    Return to directory
                </Link>
            </div>
        );
    }
}
