import { getFilm } from "@/lib/swapi/films";
import { getPerson, extractIdFromUrl as extractPersonId } from "@/lib/swapi/people";
import { getPlanet, extractIdFromUrl as extractPlanetId } from "@/lib/swapi/planets";
import { getStarship, extractIdFromUrl as extractStarshipId } from "@/lib/swapi/starships";
import { getVehicle, extractIdFromUrl as extractVehicleId } from "@/lib/swapi/vehicles";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, Film, User, Calendar, Quote, Users, Globe, Box, Rocket, Truck } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    try {
        const film = await getFilm(id);
        return {
            title: `${film.title} - SWAPI Explorer`,
            description: `Details for Star Wars film ${film.title}`,
        };
    } catch {
        return {
            title: "Film Not Found - SWAPI Explorer",
        };
    }
}

export default async function FilmPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    try {
        const film = await getFilm(id);

        const [characters, planets, starships, vehicles] = await Promise.all([
            Promise.all(
                film.characters.slice(0, 8).map(url => {
                    const pid = extractPersonId(url);
                    return getPerson(pid).catch(() => ({ name: "Unknown Character", url }));
                })
            ),
            Promise.all(
                film.planets.slice(0, 8).map(url => {
                    const pid = extractPlanetId(url);
                    return getPlanet(pid).catch(() => ({ name: "Unknown Planet", url }));
                })
            ),
            Promise.all(
                film.starships.slice(0, 5).map(url => {
                    const sid = extractStarshipId(url);
                    return getStarship(sid!).catch(() => ({ name: "Unknown Starship", url }));
                })
            ),
            Promise.all(
                film.vehicles.slice(0, 5).map(url => {
                    const vid = extractVehicleId(url);
                    return getVehicle(vid!).catch(() => ({ name: "Unknown Vehicle", url }));
                })
            )
        ]);

        return (
            <div className="flex flex-col gap-6">
                <Link
                    href="/films"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to list
                </Link>

                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                <Film className="h-8 w-8" />
                            </div>
                            <div className="flex flex-col">
                                <CardTitle className="text-3xl">{film.title}</CardTitle>
                                <CardDescription className="text-lg">Episode {film.episode_id}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Director</span>
                                        <span className="font-semibold">{film.director}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Producers</span>
                                        <span className="font-semibold">{film.producer}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Release Date</span>
                                        <span className="font-semibold">{new Date(film.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                            <Card className="bg-muted/50 border-none">
                                <CardContent className="pt-6 italic text-muted-foreground relative">
                                    <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
                                    <p className="text-sm leading-relaxed whitespace-pre-line line-clamp-[10]">
                                        {film.opening_crawl}
                                    </p>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Users className="h-4 w-4" /> Characters
                                </CardTitle>
                                <CardDescription>{film.characters.length} characters appeared</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm space-y-2">
                                    {characters.map((person, index) => {
                                        const pid = extractPersonId(film.characters[index]);
                                        return (
                                            <li key={film.characters[index]}>
                                                <Link
                                                    href={`/people/${pid}`}
                                                    className="text-primary hover:underline block truncate"
                                                >
                                                    {person.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                    {film.characters.length > 8 && (
                                        <li className="text-xs text-muted-foreground pt-1">
                                            ...and {film.characters.length - 8} more
                                        </li>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Globe className="h-4 w-4" /> Planets
                                </CardTitle>
                                <CardDescription>{film.planets.length} featured locations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm space-y-2">
                                    {planets.map((planet, index) => {
                                        const pid = extractPlanetId(film.planets[index]);
                                        return (
                                            <li key={film.planets[index]}>
                                                <Link
                                                    href={`/planets/${pid}`}
                                                    className="text-primary hover:underline block truncate"
                                                >
                                                    {planet.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                    {film.planets.length > 8 && (
                                        <li className="text-xs text-muted-foreground pt-1">
                                            ...and {film.planets.length - 8} more
                                        </li>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Box className="h-4 w-4" /> Tech
                                </CardTitle>
                                <CardDescription>{film.starships.length} ships, {film.vehicles.length} vehicles</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                        <Rocket className="h-3 w-3" /> Starships
                                    </span>
                                    <ul className="text-sm space-y-1">
                                        {starships.map((ship, index) => {
                                            const sid = extractStarshipId(film.starships[index]);
                                            return (
                                                <li key={film.starships[index]}>
                                                    <Link
                                                        href={`/starships/${sid}`}
                                                        className="text-primary hover:underline block truncate"
                                                    >
                                                        {ship.name}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                        {film.starships.length > 5 && (
                                            <li className="text-xs text-muted-foreground">
                                                ...and {film.starships.length - 5} more
                                            </li>
                                        )}
                                        {film.starships.length === 0 && (
                                            <li className="text-muted-foreground italic text-xs">None recorded</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                        <Truck className="h-3 w-3" /> Vehicles
                                    </span>
                                    <ul className="text-sm space-y-1">
                                        {vehicles.map((vehicle, index) => {
                                            const vid = extractVehicleId(film.vehicles[index]);
                                            return (
                                                <li key={film.vehicles[index]}>
                                                    <Link
                                                        href={`/vehicles/${vid}`}
                                                        className="text-primary hover:underline block truncate"
                                                    >
                                                        {vehicle.name}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                        {film.vehicles.length > 5 && (
                                            <li className="text-xs text-muted-foreground">
                                                ...and {film.vehicles.length - 5} more
                                            </li>
                                        )}
                                        {film.vehicles.length === 0 && (
                                            <li className="text-muted-foreground italic text-xs">None recorded</li>
                                        )}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <h2 className="text-2xl font-bold">Film not found</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    We couldn't find the film with ID "{id}". It might not exist in the database or there was an error fetching the data.
                </p>
                <Link href="/films" className="text-primary hover:underline">
                    Return to list
                </Link>
            </div>
        );
    }
}
