import { getVehicle, extractIdFromUrl as extractVehicleId } from "@/lib/swapi/vehicles";
import { getPerson, extractIdFromUrl as extractPersonId } from "@/lib/swapi/people";
import { getFilm, extractIdFromUrl as extractFilmId } from "@/lib/swapi/films";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, Truck, Users, Film, Ruler, Settings, DollarSign, Zap, Gauge } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    try {
        const vehicle = await getVehicle(id);
        return {
            title: `${vehicle.name} - SWAPI Explorer`,
            description: `Details for Star Wars vehicle ${vehicle.name}`,
        };
    } catch {
        return {
            title: "Vehicle Not Found - SWAPI Explorer",
        };
    }
}

export default async function VehicleDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    try {
        const vehicle = await getVehicle(id);

        // Fetch related data in parallel
        const [pilots, films] = await Promise.all([
            Promise.all(
                vehicle.pilots.map(url => {
                    const pid = extractPersonId(url);
                    return pid ? getPerson(pid).catch(() => null) : Promise.resolve(null);
                })
            ),
            Promise.all(
                vehicle.films.map(url => {
                    const fid = extractFilmId(url);
                    return fid ? getFilm(fid).catch(() => null) : Promise.resolve(null);
                })
            )
        ]);

        return (
            <div className="flex flex-col gap-6">
                <Link
                    href="/vehicles"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to list
                </Link>

                <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                    <Card className="h-fit">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Truck className="h-10 w-10" />
                            </div>
                            <CardTitle className="text-2xl">{vehicle.name}</CardTitle>
                            <CardDescription>{vehicle.model}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <Settings className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Class: {vehicle.vehicle_class}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Cost: {vehicle.cost_in_credits === "unknown" ? "Unknown" : `${Number(vehicle.cost_in_credits).toLocaleString()} credits`}</span>
                            </div>
                            <Separator />
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Badge variant="secondary">{vehicle.manufacturer.split(",")[0]}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Technical Specifications</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="flex items-center gap-3">
                                    <Ruler className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Length</span>
                                        <span className="font-medium">{vehicle.length} m</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Crew</span>
                                        <span className="font-medium">{vehicle.crew}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Passengers</span>
                                        <span className="font-medium">{vehicle.passengers}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Gauge className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Max Atmospheric Speed</span>
                                        <span className="font-medium">{vehicle.max_atmosphering_speed}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Zap className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Cargo Capacity</span>
                                        <span className="font-medium">{vehicle.cargo_capacity} kg</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Zap className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">Consumables</span>
                                        <span className="font-medium">{vehicle.consumables}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Users className="h-4 w-4" /> Notable Pilots
                                    </CardTitle>
                                    <CardDescription>{vehicle.pilots.length} recorded pilots</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm space-y-2">
                                        {pilots.filter(Boolean).map((person, index) => {
                                            const pid = extractPersonId(vehicle.pilots[index]);
                                            return (
                                                <li key={vehicle.pilots[index]}>
                                                    <Link href={`/people/${pid}`} className="text-primary hover:underline block truncate">
                                                        {person!.name}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                        {vehicle.pilots.length === 0 && (
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
                                    <CardDescription>Featured in {vehicle.films.length} films</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm space-y-2">
                                        {films.filter(Boolean).map((film, index) => {
                                            const fid = extractFilmId(vehicle.films[index]);
                                            return (
                                                <li key={vehicle.films[index]}>
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
                <h2 className="text-2xl font-bold">Vehicle not found</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    We couldn't find the vehicle with ID "{id}". It might not exist in the database or there was an error fetching the data.
                </p>
                <Link href="/vehicles" className="text-primary hover:underline">
                    Return to list
                </Link>
            </div>
        );
    }
}
