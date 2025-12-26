import { getPerson, extractIdFromUrl as extractPersonId } from "@/lib/swapi/people";
import { getPlanet, extractIdFromUrl as extractPlanetId } from "@/lib/swapi/planets";
import { getFilm, extractIdFromUrl as extractFilmId } from "@/lib/swapi/films";
import { getSpecies, extractIdFromUrl as extractSpeciesId } from "@/lib/swapi/species";
import { getStarship, extractIdFromUrl as extractStarshipId } from "@/lib/swapi/starships";
import { getVehicle, extractIdFromUrl as extractVehicleId } from "@/lib/swapi/vehicles";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Calendar, Scale, Ruler, Palette, Film, Dna, Rocket, Truck } from "lucide-react";
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
        const homeworldId = extractPlanetId(person.homeworld);

        // Resolve related data in parallel
        const [homeworld, films, speciesList, starshipList, vehicleList] = await Promise.all([
            homeworldId ? getPlanet(homeworldId).catch(() => null) : Promise.resolve(null),
            Promise.all(
                person.films.map(url => {
                    const fid = extractFilmId(url);
                    return fid ? getFilm(fid).catch(() => null) : Promise.resolve(null);
                })
            ),
            Promise.all(
                person.species.map(url => {
                    const sid = extractSpeciesId(url);
                    return sid ? getSpecies(sid).catch(() => null) : Promise.resolve(null);
                })
            ),
            Promise.all(
                person.starships.map(url => {
                    const sid = extractStarshipId(url);
                    return sid ? getStarship(sid).catch(() => null) : Promise.resolve(null);
                })
            ),
            Promise.all(
                person.vehicles.map(url => {
                    const vid = extractVehicleId(url);
                    return vid ? getVehicle(vid).catch(() => null) : Promise.resolve(null);
                })
            )
        ]);

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
                                <span className="text-sm">
                                    Homeworld:{" "}
                                    {homeworld ? (
                                        <Link href={`/planets/${homeworldId}`} className="text-primary hover:underline">
                                            {homeworld.name}
                                        </Link>
                                    ) : (
                                        "Unknown"
                                    )}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Badge variant="secondary" className="capitalize">{person.gender}</Badge>
                                {speciesList.filter(Boolean).map((s, i) => {
                                    const sid = extractSpeciesId(person.species[i]);
                                    return (
                                        <Link key={person.species[i]} href={`/species/${sid}`}>
                                            <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                                                {s!.name}
                                            </Badge>
                                        </Link>
                                    );
                                })}
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
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Film className="h-4 w-4" /> Films
                                    </CardTitle>
                                    <CardDescription>Appeared in {person.films.length} films</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm list-none space-y-2">
                                        {films.filter(Boolean).map((film, index) => {
                                            const fid = extractFilmId(person.films[index]);
                                            return (
                                                <li key={person.films[index]}>
                                                    <Link
                                                        href={`/films/${fid}`}
                                                        className="text-primary hover:underline block truncate"
                                                    >
                                                        {film!.title}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Rocket className="h-4 w-4" /> Piloted Crafts
                                    </CardTitle>
                                    <CardDescription>{person.vehicles.length + person.starships.length} crafts recorded</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-4">
                                        {starshipList.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Starships</span>
                                                <ul className="text-sm space-y-1">
                                                    {starshipList.filter(Boolean).map((ship, i) => {
                                                        const sid = extractStarshipId(person.starships[i]);
                                                        return (
                                                            <li key={person.starships[i]}>
                                                                <Link href={`/starships/${sid}`} className="text-primary hover:underline block truncate">
                                                                    {ship!.name}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                        {vehicleList.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vehicles</span>
                                                <ul className="text-sm space-y-1">
                                                    {vehicleList.filter(Boolean).map((vehicle, i) => {
                                                        const vid = extractVehicleId(person.vehicles[i]);
                                                        return (
                                                            <li key={person.vehicles[i]}>
                                                                <Link href={`/vehicles/${vid}`} className="text-primary hover:underline block truncate">
                                                                    {vehicle!.name}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
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
