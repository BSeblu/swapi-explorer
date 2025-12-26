import { z } from "zod";
import { ApiError } from "./errors";

const BASE_URL = "https://swapi.py4e.com/api";

export const SpeciesSchema = z.object({
    name: z.string().describe("The name of this species."),
    classification: z.string().describe("The classification of this species, such as \"mammal\" or \"reptile\"."),
    designation: z.string().describe("The designation of this species, such as \"sentient\"."),
    average_height: z.string().describe("The average height of this species in centimeters."),
    average_lifespan: z.string().describe("The average lifespan of this species in years."),
    eye_colors: z.string().describe("A comma-separated string of common eye colors for this species, \"none\" if this species does not typically have eyes."),
    hair_colors: z.string().describe("A comma-separated string of common hair colors for this species, \"none\" if this species does not typically have hair."),
    skin_colors: z.string().describe("A comma-separated string of common skin colors for this species, \"none\" if this species does not typically have skin."),
    language: z.string().describe("The language commonly spoken by this species."),
    homeworld: z.string().nullable().describe("The URL of a planet resource, a planet that this species originates from."),
    people: z.array(z.string()).describe("An array of People URL Resources that are a part of this species."),
    films: z.array(z.string()).describe("An array of Film URL Resources that this species has appeared in."),
    created: z.string().describe("The ISO 8601 date format of the time that this resource was created."),
    edited: z.string().describe("The ISO 8601 date format of the time that this resource was edited."),
    url: z.string().describe("The hypermedia URL of this resource.")
});

export const SpeciesResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(SpeciesSchema)
});

export type Species = z.infer<typeof SpeciesSchema>;
export type SpeciesResponse = z.infer<typeof SpeciesResponseSchema>;

export async function getSpecies(id: string): Promise<Species> {
    const res = await fetch(`${BASE_URL}/species/${id}/`);

    if (!res.ok) {
        throw new ApiError(res.status, res.statusText);
    }

    const data = await res.json();
    return SpeciesSchema.parse(data);
}

export async function searchSpecies(query: string, page: number = 1): Promise<SpeciesResponse> {
    const url = new URL(`${BASE_URL}/species/`);
    if (query) url.searchParams.set("search", query);
    if (page > 1) url.searchParams.set("page", page.toString());

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new ApiError(res.status, res.statusText);
    }

    const data = await res.json();
    return SpeciesResponseSchema.parse(data);
}

export function extractIdFromUrl(url: string | null): string | undefined {
    return url?.split("/").filter(Boolean).at(-1);
}
