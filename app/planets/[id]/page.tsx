import { getPlanet } from "@/lib/swapi/planets";
import { getFilm, extractIdFromUrl as extractFilmId } from "@/lib/swapi/films";
import { getPerson, extractIdFromUrl as extractPersonId } from "@/lib/swapi/people";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, Globe, Users, Thermometer, Box, Compass, RotateCcw, Film as FilmIcon, User } from "lucide-react";
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

        const [films, residents] = await Promise.all([
            Promise.all(
                planet.films.map(url => {
                    const fid = extractFilmId(url);
                    return getFilm(fid).catch(() => ({ title: "Unknown Film", url }));
                })
            ),
            Promise.all(
                planet.residents.slice(0, 5).map(url => {
                    const pid = extractPersonId(url);
                    return getPerson(pid).catch(() => ({ name: "Unknown Resident", url }));
                })
            )
        ]);

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
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FilmIcon className="h-4 w-4" /> Films
                                    </CardTitle>
                                    <CardDescription>Featured in {planet.films.length} films</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm space-y-2">
                                        {films.map((film, index) => {
                                            const fid = extractFilmId(planet.films[index]);
                                            return (
                                                <li key={planet.films[index]}>
                                                    <Link
                                                        href={`/films/${fid}`}
                                                        className="text-primary hover:underline block truncate"
                                                    >
                                                        {film.title}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                        {films.length === 0 && (
                                            <li className="text-muted-foreground italic">No films recorded</li>
                                        )}
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <User className="h-4 w-4" /> Residents
                                    </CardTitle>
                                    <CardDescription>{planet.residents.length} notable residents</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm space-y-2">
                                        {residents.map((person, index) => {
                                            const pid = extractPersonId(planet.residents[index]);
                                            return (
                                                <li key={planet.residents[index]}>
                                                    <Link
                                                        href={`/people/${pid}`}
                                                        className="text-primary hover:underline block truncate"
                                                    >
                                                        {person.name}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                        {planet.residents.length > 5 && (
                                            <li className="text-xs text-muted-foreground pt-1">
                                                ...and {planet.residents.length - 5} more
                                            </li>
                                        )}
                                        {planet.residents.length === 0 && (
                                            <li className="text-muted-foreground italic">No residents recorded</li>
                                        )}
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
