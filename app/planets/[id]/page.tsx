import { getPlanet } from "@/lib/swapi/planets";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, Globe, Users, Thermometer, Box, Compass, RotateCcw } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    try {
        const planet = await getPlanet(id);
        return {
            title: `${planet.name} - SWAPI Explorer`,
            description: `Details for Star Wars planet ${planet.name}`,
        };
    } catch {
        return {
            title: "Planet Not Found - SWAPI Explorer",
        };
    }
}

export default async function PlanetPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    try {
        const planet = await getPlanet(id);

        return (
            <div className="flex flex-col gap-6">
                <Link
                    href="/planets"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to list
                </Link>

                <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                    <Card className="h-fit">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Globe className="h-10 w-10" />
                            </div>
                            <CardTitle className="text-2xl">{planet.name}</CardTitle>
                            <CardDescription>Planet Profile</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Population: {planet.population}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Thermometer className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm capitalize">Climate: {planet.climate}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Badge variant="secondary">{planet.terrain}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Orbital & Geographic Data</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3">
                                    <Box className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Diameter</span>
                                        <span className="font-medium">{planet.diameter} km</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Compass className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Gravity</span>
                                        <span className="font-medium">{planet.gravity}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Rotation Period</span>
                                        <span className="font-medium">{planet.rotation_period} hours</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Orbital Period</span>
                                        <span className="font-medium">{planet.orbital_period} days</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Films</CardTitle>
                                    <CardDescription>Featured in {planet.films.length} films</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground list-disc pl-4">
                                        {planet.films.map(film => (
                                            <li key={film} className="mb-1 truncate text-xs">{film}</li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Residents</CardTitle>
                                    <CardDescription>{planet.residents.length} notable residents</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm text-muted-foreground list-disc pl-4">
                                        {planet.residents.slice(0, 5).map(person => (
                                            <li key={person} className="mb-1 truncate text-xs">{person}</li>
                                        ))}
                                        {planet.residents.length > 5 && <li>...and {planet.residents.length - 5} more</li>}
                                    </ul>
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
                <h2 className="text-2xl font-bold">Planet not found</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    We couldn't find the planet with ID "{id}". It might not exist in the database or there was an error fetching the data.
                </p>
                <Link href="/planets" className="text-primary hover:underline">
                    Return to list
                </Link>
            </div>
        );
    }
}
