import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSpecies, searchSpecies, Species, SpeciesResponse } from "./species";
import { ApiError } from "./errors";

global.fetch = vi.fn();

describe("species (SWAPI data access)", () => {
    const mockSpecies: Species = {
        name: "Wookie",
        classification: "mammal",
        designation: "sentient",
        average_height: "210",
        average_lifespan: "400",
        eye_colors: "blue, green, yellow, brown, golden, red",
        hair_colors: "black, brown",
        skin_colors: "gray",
        language: "Shyriiwook",
        homeworld: "https://swapi.py4e.com/api/planets/14/",
        people: ["https://swapi.py4e.com/api/people/13/"],
        films: ["https://swapi.py4e.com/api/films/1/"],
        created: "2014-12-10T16:44:22.286000Z",
        edited: "2014-12-20T21:36:42.151000Z",
        url: "https://swapi.py4e.com/api/species/3/"
    };

    const mockSearchResponse: SpeciesResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [mockSpecies]
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getSpecies", () => {
        it("should fetch a species by id", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSpecies,
            } as Response);

            const result = await getSpecies("3");
            expect(result.name).toBe("Wookie");
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/species/3/"));
        });

        it("should throw ApiError for 404", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: "Not Found",
            } as Response);

            await expect(getSpecies("999")).rejects.toThrow(ApiError);
        });
    });

    describe("searchSpecies", () => {
        it("should search species with query", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSearchResponse,
            } as Response);

            const result = await searchSpecies("wookie");
            expect(result.results[0].name).toBe("Wookie");
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining("search=wookie"));
        });

        it("should return all species if no query", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSearchResponse,
            } as Response);

            const result = await searchSpecies("");
            expect(result.results.length).toBe(1);
            expect(fetch).toHaveBeenCalledWith("https://swapi.py4e.com/api/species/");
        });
    });
});
