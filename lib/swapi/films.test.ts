import { describe, it, expect, vi, beforeEach } from "vitest";
import { getFilm, searchFilms, Film, FilmResponse } from "./films";
import { ApiError } from "./errors";

global.fetch = vi.fn();

describe("films (SWAPI data access)", () => {
    const mockFilm: Film = {
        title: "A New Hope",
        episode_id: 4,
        opening_crawl: "It is a period of civil war...",
        director: "George Lucas",
        producer: "Gary Kurtz, Rick McCallum",
        release_date: "1977-05-25",
        characters: ["https://swapi.py4e.com/api/people/1/"],
        planets: ["https://swapi.py4e.com/api/planets/1/"],
        starships: ["https://swapi.py4e.com/api/starships/2/"],
        vehicles: ["https://swapi.py4e.com/api/vehicles/4/"],
        species: ["https://swapi.py4e.com/api/species/1/"],
        created: "2014-12-10T14:23:31.880000Z",
        edited: "2014-12-20T19:49:45.256000Z",
        url: "https://swapi.py4e.com/api/films/1/"
    };

    const mockSearchResponse: FilmResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [mockFilm]
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getFilm", () => {
        it("should fetch a film by id", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockFilm,
            } as Response);

            const result = await getFilm("1");
            expect(result.title).toBe("A New Hope");
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/films/1/"));
        });

        it("should throw ApiError for 500", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: "Server Error",
            } as Response);

            await expect(getFilm("1")).rejects.toThrow(ApiError);
        });
    });

    describe("searchFilms", () => {
        it("should search films with query", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSearchResponse,
            } as Response);

            const result = await searchFilms("hope");
            expect(result.results[0].title).toBe("A New Hope");
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining("search=hope"));
        });

        it("should return all films if no query", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSearchResponse,
            } as Response);

            const result = await searchFilms("");
            expect(result.results.length).toBe(1);
            expect(fetch).toHaveBeenCalledWith("https://swapi.py4e.com/api/films/");
        });

        it("should throw ApiError if search fails", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: "Not Found",
            } as Response);

            await expect(searchFilms("invalid")).rejects.toThrow(ApiError);
        });
    });
});
