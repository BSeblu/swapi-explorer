import { describe, it, expect, vi, beforeEach } from "vitest";
import { getStarship, searchStarships, Starship, StarshipResponse } from "./starships";
import { ApiError } from "./errors";

global.fetch = vi.fn();

describe("starships (SWAPI data access)", () => {
    const mockStarship: Starship = {
        name: "X-wing",
        model: "T-65 X-wing starfighter",
        manufacturer: "Incom Corporation",
        cost_in_credits: "149999",
        length: "12.5",
        max_atmosphering_speed: "1050",
        crew: "1",
        passengers: "0",
        cargo_capacity: "110",
        consumables: "1 week",
        hyperdrive_rating: "1.0",
        MGLT: "100",
        starship_class: "Starfighter",
        pilots: ["https://swapi.py4e.com/api/people/1/"],
        films: ["https://swapi.py4e.com/api/films/1/"],
        created: "2014-12-12T11:19:05.340000Z",
        edited: "2014-12-20T21:23:49.886000Z",
        url: "https://swapi.py4e.com/api/starships/12/"
    };

    const mockSearchResponse: StarshipResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [mockStarship]
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getStarship", () => {
        it("should fetch a starship by id", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockStarship,
            } as Response);

            const result = await getStarship("12");
            expect(result.name).toBe("X-wing");
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/starships/12/"));
        });

        it("should throw ApiError for 404", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: "Not Found",
            } as Response);

            await expect(getStarship("999")).rejects.toThrow(ApiError);
        });
    });

    describe("searchStarships", () => {
        it("should search starships with query", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSearchResponse,
            } as Response);

            const result = await searchStarships("x-wing");
            expect(result.results[0].name).toBe("X-wing");
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining("search=x-wing"));
        });

        it("should return all starships if no query", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSearchResponse,
            } as Response);

            const result = await searchStarships("");
            expect(result.results.length).toBe(1);
            expect(fetch).toHaveBeenCalledWith("https://swapi.py4e.com/api/starships/");
        });
    });
});
