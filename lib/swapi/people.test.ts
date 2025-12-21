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
    homeworld: "https://swapi.dev/api/planets/1/",
    films: ["https://swapi.dev/api/films/1/"],
    species: [],
    vehicles: ["https://swapi.dev/api/vehicles/14/"],
    starships: ["https://swapi.dev/api/starships/12/"],
    created: "2014-12-09T13:50:51.644000Z",
    edited: "2014-12-20T21:17:56.891000Z",
    url: "https://swapi.dev/api/people/1/"
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
            (fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockPerson,
            });

            const person = await getPerson('1');
            expect(person.name).toBe('Luke Skywalker');
            expect(PersonSchema.safeParse(person).success).toBe(true);
            expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/1/');
        });

        it('throws ApiError on 404', async () => {
            (fetch as any).mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            });

            try {
                await getPerson('999');
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toContain('404 Not Found');
            }
        });

        it('throws ApiError on 500', async () => {
            (fetch as any).mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            });

            try {
                await getPerson('1');
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(500);
            }
        });
    });

    describe('searchPeople', () => {
        it('returns valid search results', async () => {
            (fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockSearchResponse,
            });

            const response = await searchPeople('luke');
            expect(response.count).toBe(1);
            expect(response.results[0].name).toBe('Luke Skywalker');
            expect(PeopleResponseSchema.safeParse(response).success).toBe(true);
            expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/?search=luke');
        });

        it('throws ApiError on 404', async () => {
            (fetch as any).mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            });

            try {
                await searchPeople('invalid');
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
            }
        });

        it('throws ApiError on 500', async () => {
            (fetch as any).mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            });

            try {
                await searchPeople('luke');
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(500);
            }
        });
    });
});
