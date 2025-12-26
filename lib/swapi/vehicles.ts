import { z } from "zod";
import { ApiError } from "./errors";

const BASE_URL = "https://swapi.py4e.com/api";

export const VehicleSchema = z.object({
    name: z.string().describe("The name of this vehicle. The common name, such as \"Sand Crawler\"."),
    model: z.string().describe("The model or official name of this vehicle. Such as \"All Terrain Attack Transport\"."),
    vehicle_class: z.string().describe("The class of this vehicle, such as \"Wheeled\" or \"Repulsorcraft\"."),
    manufacturer: z.string().describe("The manufacturer of this vehicle. Comma separated if more than one."),
    cost_in_credits: z.string().describe("The cost of this vehicle new, in galactic credits."),
    length: z.string().describe("The length of this vehicle in meters."),
    crew: z.string().describe("The number of personnel needed to run or pilot this vehicle."),
    passengers: z.string().describe("The number of non-essential people this vehicle can transport."),
    max_atmosphering_speed: z.string().describe("The maximum speed of this vehicle in the atmosphere."),
    cargo_capacity: z.string().describe("The maximum number of kilograms that this vehicle can transport."),
    consumables: z.string().describe("The maximum length of time that this vehicle can provide consumables for its entire crew without having to resupply."),
    films: z.array(z.string()).describe("An array of Film URL Resources that this vehicle has appeared in."),
    pilots: z.array(z.string()).describe("An array of People URL Resources that this vehicle has been piloted by."),
    created: z.string().describe("The ISO 8601 date format of the time that this resource was created."),
    edited: z.string().describe("The ISO 8601 date format of the time that this resource was edited."),
    url: z.string().describe("The hypermedia URL of this resource.")
});

export const VehicleResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(VehicleSchema)
});

export type Vehicle = z.infer<typeof VehicleSchema>;
export type VehicleResponse = z.infer<typeof VehicleResponseSchema>;

export async function getVehicle(id: string): Promise<Vehicle> {
    const res = await fetch(`${BASE_URL}/vehicles/${id}/`);

    if (!res.ok) {
        throw new ApiError(res.status, res.statusText);
    }

    const data = await res.json();
    return VehicleSchema.parse(data);
}

export async function searchVehicles(query: string, page: number = 1): Promise<VehicleResponse> {
    const url = new URL(`${BASE_URL}/vehicles/`);
    if (query) url.searchParams.set("search", query);
    if (page > 1) url.searchParams.set("page", page.toString());

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new ApiError(res.status, res.statusText);
    }

    const data = await res.json();
    return VehicleResponseSchema.parse(data);
}

export function extractIdFromUrl(url: string | null): string | undefined {
    return url?.split("/").filter(Boolean).at(-1);
}
