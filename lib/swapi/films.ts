import { z } from "zod";
import { ApiError } from "./errors";

const BASE_URL = "https://swapi.py4e.com/api";

export const FilmSchema = z.object({
    title: z.string().describe("The title of this film"),
    episode_id: z.number().describe("The episode number of this film."),
    opening_crawl: z.string().describe("The opening paragraphs at the beginning of this film."),
    director: z.string().describe("The name of the director of this film."),
    producer: z.string().describe("The name(s) of the producer(s) of this film. Comma separated."),
    release_date: z.string().describe("The ISO 8601 date format of film release at original creator country."),
    characters: z.array(z.string()).describe("An array of people resource URLs that are in this film."),
    planets: z.array(z.string()).describe("An array of planet resource URLs that are in this film."),
    starships: z.array(z.string()).describe("An array of starship resource URLs that are in this film."),
    vehicles: z.array(z.string()).describe("An array of vehicle resource URLs that are in this film."),
    species: z.array(z.string()).describe("An array of species resource URLs that are in this film."),
    created: z.string().describe("The ISO 8601 date format of the time that this resource was created."),
    edited: z.string().describe("The ISO 8601 date format of the time that this resource was edited."),
    url: z.string().describe("The hypermedia URL of this resource.")
});

export const FilmResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(FilmSchema)
});

export type Film = z.infer<typeof FilmSchema>;
export type FilmResponse = z.infer<typeof FilmResponseSchema>;

export async function getFilm(id: string): Promise<Film> {
    const res = await fetch(`${BASE_URL}/films/${id}/`);

    if (!res.ok) {
        throw new ApiError(res.status, res.statusText);
    }

    const data = await res.json();
    return FilmSchema.parse(data);
}

export async function searchFilms(query: string): Promise<FilmResponse> {
    const url = query
        ? `${BASE_URL}/films/?search=${encodeURIComponent(query)}`
        : `${BASE_URL}/films/`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new ApiError(res.status, res.statusText);
    }

    const data = await res.json();
    return FilmResponseSchema.parse(data);
}

export function extractIdFromUrl(url: string): string {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
}
