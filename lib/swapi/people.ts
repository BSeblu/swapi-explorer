import { z } from 'zod';
import { ApiError } from './errors';

export const PersonSchema = z.object({
    name: z.string().describe("The name of this person."),
    height: z.string().describe("The height of the person in centimeters."),
    mass: z.string().describe("The mass of the person in kilograms."),
    hair_color: z.string().describe("The hair color of this person. Will be \"unknown\" if not known or \"n/a\" if the person does not have hair."),
    skin_color: z.string().describe("The skin color of this person."),
    eye_color: z.string().describe("The eye color of this person. Will be \"unknown\" if not known or \"n/a\" if the person does not have eyes."),
    birth_year: z.string().describe("The birth year of the person, using the in-universe standard of BBY or ABY."),
    gender: z.string().describe("The gender of this person. Either \"Male\", \"Female\" or \"unknown\", \"n/a\" if the person does not have a gender."),
    homeworld: z.string().describe("The URL of a planet resource, a planet that this person was born on or inhabits."),
    films: z.array(z.string()).describe("An array of film resource URLs that this person has been in."),
    species: z.array(z.string()).describe("An array of species resource URLs that this person belongs to."),
    vehicles: z.array(z.string()).describe("An array of vehicle resource URLs that this person has piloted."),
    starships: z.array(z.string()).describe("An array of starship resource URLs that this person has piloted."),
    created: z.string().describe("The ISO 8601 date format of the time that this resource was created."),
    edited: z.string().describe("The ISO 8601 date format of the time that this resource was last edited."),
    url: z.string().describe("The hypermedia URL of this resource."),
});

export type Person = z.infer<typeof PersonSchema>;

export const PeopleResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(PersonSchema),
});

export type PeopleResponse = z.infer<typeof PeopleResponseSchema>;

// Note: switched to py4e mirror as swapi.dev often has certificate issues
const BASE_URL = 'https://swapi.py4e.com/api';

export async function getPerson(id: string): Promise<Person> {
    const response = await fetch(`${BASE_URL}/people/${id}/`);

    if (!response.ok) {
        throw new ApiError(
            `Failed to fetch person: ${response.status} ${response.statusText}`,
            response.status,
            response.statusText
        );
    }
    const data = await response.json();
    return PersonSchema.parse(data);
}

export async function searchPeople(query: string): Promise<PeopleResponse> {
    const response = await fetch(`${BASE_URL}/people/?search=${encodeURIComponent(query)}`);

    if (!response.ok) {
        throw new ApiError(
            `Failed to search people: ${response.status} ${response.statusText}`,
            response.status,
            response.statusText
        );
    }
    const data = await response.json();
    return PeopleResponseSchema.parse(data);
}

/**
 * Extracts the ID from a SWAPI URL (e.g., https://swapi.dev/api/people/1/ -> 1)
 */
export function extractIdFromUrl(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1];
}

