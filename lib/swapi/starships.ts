import { z } from "zod";
import { ApiError } from "./errors";

const BASE_URL = "https://swapi.py4e.com/api";

export const StarshipSchema = z.object({
    name: z.string().describe("The name of this starship. The common name, such as \"Death Star\"."),
    model: z.string().describe("The model or official name of this starship. Such as \"DS-1 Orbital Battle Station\"."),
    starship_class: z.string().describe("The class of this starship, such as \"Starfighter\" or \"Deep Space Mobile Battlestation\"."),
    manufacturer: z.string().describe("The manufacturer of this starship. Comma separated if more than one."),
    cost_in_credits: z.string().describe("The cost of this starship new, in galactic credits."),
    length: z.string().describe("The length of this starship in meters."),
    crew: z.string().describe("The number of personnel needed to run or pilot this starship."),
    passengers: z.string().describe("The number of non-essential people this starship can transport."),
    max_atmosphering_speed: z.string().describe("The maximum speed of this starship in the atmosphere. \"n/a\" if this starship is incapable of atmospheric flight."),
    hyperdrive_rating: z.string().describe("The class of this starships hyperdrive."),
    MGLT: z.string().describe("The Maximum number of Megalights this starship can travel in a standard hour. A \"Megalight\" is a standard unit of distance and has never been priority defined within the Star Wars universe, its purpose is to allow the comparison of ship speeds."),
    cargo_capacity: z.string().describe("The maximum number of kilograms that this starship can transport."),
    consumables: z.string().describe("The maximum length of time that this starship can provide consumables for its entire crew without having to resupply."),
    films: z.array(z.string()).describe("An array of Film URL Resources that this starship has appeared in."),
    pilots: z.array(z.string()).describe("An array of People URL Resources that this starship has been piloted by."),
    created: z.string().describe("The ISO 8601 date format of the time that this resource was created."),
    edited: z.string().describe("The ISO 8601 date format of the time that this resource was edited."),
    url: z.string().describe("The hypermedia URL of this resource.")
});

export const StarshipResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(StarshipSchema)
});

export type Starship = z.infer<typeof StarshipSchema>;
export type StarshipResponse = z.infer<typeof StarshipResponseSchema>;

export async function getStarship(id: string): Promise<Starship> {
    const res = await fetch(`${BASE_URL}/starships/${id}/`);

    if (!res.ok) {
        throw new ApiError(res.status, res.statusText);
    }

    const data = await res.json();
    return StarshipSchema.parse(data);
}

export async function searchStarships(query: string): Promise<StarshipResponse> {
    const url = query
        ? `${BASE_URL}/starships/?search=${encodeURIComponent(query)}`
        : `${BASE_URL}/starships/`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new ApiError(res.status, res.statusText);
    }

    const data = await res.json();
    return StarshipResponseSchema.parse(data);
}

export function extractIdFromUrl(url: string | null): string | null {
    if (!url) return null;
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
}
