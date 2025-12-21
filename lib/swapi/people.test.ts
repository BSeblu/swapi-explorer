import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPerson, searchPeople, PersonSchema, PeopleResponseSchema, type Person, type PeopleResponse } from './people';
import { ApiError } from './errors';

// Mock fetch
global.fetch = vi.fn();

const mockPerson: Person = {
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    hair_color: "blond",
    skin_color: "fair",
    eye_color: "blue",
    birth_year: "19BBY",
    gender: "male",
    homeworld: "https://swapi.py4e.com/api/planets/1/",
    films: ["https://swapi.py4e.com/api/films/1/"],
    species: [],
    vehicles: ["https://swapi.py4e.com/api/vehicles/14/"],
    starships: ["https://swapi.py4e.com/api/starships/12/"],
    created: "2014-12-09T13:50:51.644000Z",
    edited: "2014-12-20T21:17:56.891000Z",
    url: "https://swapi.py4e.com/api/people/1/"
};

const mockSearchResponse: PeopleResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [mockPerson]
};

describe('people data access', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe('getPerson', () => {
        it('returns a valid person document', async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockPerson,
            } as Response);

            const person = await getPerson('1');
            expect(person.name).toBe('Luke Skywalker');
            expect(PersonSchema.safeParse(person).success).toBe(true);
            expect(fetch).toHaveBeenCalledWith('https://swapi.py4e.com/api/people/1/');
        });

        it('throws ApiError on 404', async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            } as Response);

            await expect(getPerson('999')).rejects.toThrow(ApiError);
        });
    });

    describe('searchPeople', () => {
        it('returns valid search results', async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSearchResponse,
            } as Response);

            const response = await searchPeople('luke');
            expect(response.count).toBe(1);
            expect(response.results[0].name).toBe('Luke Skywalker');
            expect(PeopleResponseSchema.safeParse(response).success).toBe(true);
            expect(fetch).toHaveBeenCalledWith('https://swapi.py4e.com/api/people/?search=luke');
        });

        it('throws ApiError on 500', async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            } as Response);

            await expect(searchPeople('luke')).rejects.toThrow(ApiError);
        });
    });
});
