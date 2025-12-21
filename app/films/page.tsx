import { searchFilms, extractIdFromUrl } from "@/lib/swapi/films";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Film, User, Calendar } from "lucide-react";

export default async function FilmsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) {
    const { search } = await searchParams;
    const response = await searchFilms(search || "");

    if (response.results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground text-lg">No films found matching "{search}"</p>
                <p className="text-sm text-muted-foreground">Try a different search term.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {response.results.map((film) => {
                const id = extractIdFromUrl(film.url);
                return (
                    <Link key={film.url} href={`/films/${id}`} className="group">
                        <Card className="h-full transition-colors hover:border-primary/50">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Film className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                        {film.title}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>Director: {film.director}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Released: {new Date(film.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="mt-2">
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                        Episode {film.episode_id}
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
