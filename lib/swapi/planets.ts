import { z } from "zod";
import { ApiError } from "./errors";

const BASE_URL = "https://swapi.py4e.com/api";

export const PlanetSchema = z.object({
    name: z.string().describe("The name of this planet."),
    diameter: z.string().describe("The diameter of this planet in kilometers."),
    rotation_period: z.string().describe("The number of standard hours it takes for this planet to complete a single rotation on its axis."),
    orbital_period: z.string().describe("The number of standard days it takes for this planet to complete a single orbit of its local star."),
    gravity: z.string().describe("A number denoting the gravity of this planet, where \"1\" is normal or 1 standard G. \"2\" is twice or 2 standard Gs. \"0.5\" is half or 0.5 standard Gs."),
    population: z.string().describe("The average population of intelligent beings inhabiting this planet."),
    climate: z.string().describe("The climate of this planet. Comma separated if diverse."),
    terrain: z.string().describe("The terrain of this planet. Comma separated if diverse."),
    surface_water: z.string().describe("The percentage of the planet surface that is naturally occurring water or bodies of water."),
    residents: z.array(z.string()).describe("An array of People URL Resources that live on this planet."),
    films: z.array(z.string()).describe("An array of Film URL Resources that this planet has appeared in."),
    created: z.string().describe("The ISO 8601 date format of the time that this resource was created."),
    edited: z.string().describe("The ISO 8601 date format of the time that this resource was edited."),
    url: z.string().describe("The hypermedia URL of this resource.")
});

export const PlanetResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(PlanetSchema)
});

export type Planet = z.infer<typeof PlanetSchema>;
export type PlanetResponse = z.infer<typeof PlanetResponseSchema>;

export async function getPlanet(id: string): Promise<Planet> {
    const res = await fetch(`${BASE_URL}/planets/${id}/`);

    if (!res.ok) {
        throw new ApiError(res.status, res.statusText);
    }

    const data = await res.json();
    return PlanetSchema.parse(data);
}

export async function searchPlanets(query: string, page: number = 1): Promise<PlanetResponse> {
    const url = new URL(`${BASE_URL}/planets/`);
    if (query) url.searchParams.set("search", query);
    if (page > 1) url.searchParams.set("page", page.toString());

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new ApiError(res.status, res.statusText);
    }

    const data = await res.json();
    return PlanetResponseSchema.parse(data);
}


export function extractIdFromUrl(url: string | null): string | undefined {
    return url?.split("/").filter(Boolean).at(-1);
}
