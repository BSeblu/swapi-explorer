import { getSpecies, extractIdFromUrl as extractSpeciesId } from "@/lib/swapi/species";
import { getPlanet, extractIdFromUrl as extractPlanetId } from "@/lib/swapi/planets";
import { getPerson, extractIdFromUrl as extractPersonId } from "@/lib/swapi/people";
import { getFilm, extractIdFromUrl as extractFilmId } from "@/lib/swapi/films";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, Dna, Globe, Languages, Users, Film, Ruler, Hourglass, Palette } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    try {
        const species = await getSpecies(id);
        return {
            title: `${species.name} - SWAPI Explorer`,
            description: `Details for Star Wars species ${species.name}`,
        };
    } catch {
        return {
            title: "Species Not Found - SWAPI Explorer",
        };
    }
}

export default async function SpeciesDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    try {
        const species = await getSpecies(id);
        const homeworldId = extractPlanetId(species.homeworld);

        // Fetch related data in parallel
        const [homeworld, residents, films] = await Promise.all([
            homeworldId ? getPlanet(homeworldId).catch(() => null) : Promise.resolve(null),
            Promise.all(
                species.people.slice(0, 5).map(url => {
                    const pid = extractPersonId(url);
                    return pid ? getPerson(pid).catch(() => null) : Promise.resolve(null);
                })
            ),
            Promise.all(
                species.films.map(url => {
                    const fid = extractFilmId(url);
                    return fid ? getFilm(fid).catch(() => null) : Promise.resolve(null);
                })
            )
        ]);

        return (
            <div className="flex flex-col gap-6">
                <Link
                    href="/species"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to list
                </Link>

                <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                    <Card className="h-fit">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Dna className="h-10 w-10" />
                            </div>
                            <CardTitle className="text-2xl">{species.name}</CardTitle>
                            <CardDescription>Species Profile</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <Languages className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Language: {species.language}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm border-b border-transparent">
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
                                <Badge variant="secondary" className="capitalize">{species.classification}</Badge>
                                <Badge variant="outline" className="capitalize">{species.designation}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Biological Characteristics</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3">
                                    <Ruler className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Average Height</span>
                                        <span className="font-medium">{species.average_height} cm</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Hourglass className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Average Lifespan</span>
                                        <span className="font-medium">{species.average_lifespan} years</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Palette className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Skin Colors</span>
                                        <span className="font-medium capitalize">{species.skin_colors}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Palette className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Hair Colors</span>
                                        <span className="font-medium capitalize">{species.hair_colors}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Palette className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Eye Colors</span>
                                        <span className="font-medium capitalize">{species.eye_colors}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Users className="h-4 w-4" /> Notable Members
                                    </CardTitle>
                                    <CardDescription>{species.people.length} recorded members</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm space-y-2">
                                        {residents.filter(Boolean).map((person, index) => {
                                            const pid = extractPersonId(species.people[index]);
                                            return (
                                                <li key={species.people[index]}>
                                                    <Link href={`/people/${pid}`} className="text-primary hover:underline block truncate">
                                                        {person!.name}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                        {species.people.length > 5 && (
                                            <li className="text-xs text-muted-foreground pt-1">
                                                ...and {species.people.length - 5} more
                                            </li>
                                        )}
                                        {species.people.length === 0 && (
                                            <li className="text-muted-foreground italic text-xs">No records found.</li>
                                        )}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Film className="h-4 w-4" /> Films
                                    </CardTitle>
                                    <CardDescription>Appeared in {species.films.length} films</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm space-y-2">
                                        {films.filter(Boolean).map((film, index) => {
                                            const fid = extractFilmId(species.films[index]);
                                            return (
                                                <li key={species.films[index]}>
                                                    <Link href={`/films/${fid}`} className="text-primary hover:underline block truncate">
                                                        {film!.title}
                                                    </Link>
                                                </li>
                                            );
                                        })}
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
                <h2 className="text-2xl font-bold">Species not found</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    We couldn't find the species with ID "{id}". It might not exist in the database or there was an error fetching the data.
                </p>
                <Link href="/species" className="text-primary hover:underline">
                    Return to list
                </Link>
            </div>
        );
    }
}
