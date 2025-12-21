import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPlanet, searchPlanets, Planet, PlanetResponse } from "./planets";
import { ApiError } from "./errors";

global.fetch = vi.fn();

describe("planets (SWAPI data access)", () => {
    const mockPlanet: Planet = {
        name: "Tatooine",
        diameter: "10465",
        rotation_period: "23",
        orbital_period: "304",
        gravity: "1 standard",
        population: "200000",
        climate: "arid",
        terrain: "desert",
        surface_water: "1",
        residents: ["https://swapi.py4e.com/api/people/1/"],
        films: ["https://swapi.py4e.com/api/films/1/"],
        created: "2014-12-09T13:50:49.641000Z",
        edited: "2014-12-20T20:58:18.411000Z",
        url: "https://swapi.py4e.com/api/planets/1/"
    };

    const mockSearchResponse: PlanetResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [mockPlanet]
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getPlanet", () => {
        it("should fetch a planet by id", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockPlanet,
            } as Response);

            const result = await getPlanet("1");
            expect(result.name).toBe("Tatooine");
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/planets/1/"));
        });

        it("should throw ApiError for 404", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: "Not Found",
            } as Response);

            await expect(getPlanet("999")).rejects.toThrow(ApiError);
        });
    });

    describe("searchPlanets", () => {
        it("should search planets with query", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSearchResponse,
            } as Response);

            const result = await searchPlanets("tatooine");
            expect(result.results[0].name).toBe("Tatooine");
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining("search=tatooine"));
        });

        it("should return all planets if no query", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSearchResponse,
            } as Response);

            const result = await searchPlanets("");
            expect(result.results.length).toBe(1);
            expect(fetch).toHaveBeenCalledWith("https://swapi.py4e.com/api/planets/");
        });
    });
});
