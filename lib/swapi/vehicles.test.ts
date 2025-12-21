import { describe, it, expect, vi, beforeEach } from "vitest";
import { getVehicle, searchVehicles, Vehicle, VehicleResponse } from "./vehicles";
import { ApiError } from "./errors";

global.fetch = vi.fn();

describe("vehicles (SWAPI data access)", () => {
    const mockVehicle: Vehicle = {
        name: "Sand Crawler",
        model: "Digger Crawler",
        manufacturer: "Corellia Mining Corporation",
        cost_in_credits: "150000",
        length: "36.8 ",
        max_atmosphering_speed: "30",
        crew: "46",
        passengers: "30",
        cargo_capacity: "50000",
        consumables: "2 months",
        vehicle_class: "wheeled",
        pilots: [],
        films: ["https://swapi.py4e.com/api/films/1/"],
        created: "2014-12-10T15:36:25.724000Z",
        edited: "2014-12-20T21:30:21.661000Z",
        url: "https://swapi.py4e.com/api/vehicles/4/"
    };

    const mockSearchResponse: VehicleResponse = {
        count: 1,
        next: null,
        previous: null,
        results: [mockVehicle]
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getVehicle", () => {
        it("should fetch a vehicle by id", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockVehicle,
            } as Response);

            const result = await getVehicle("4");
            expect(result.name).toBe("Sand Crawler");
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/vehicles/4/"));
        });

        it("should throw ApiError for 404", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: "Not Found",
            } as Response);

            await expect(getVehicle("999")).rejects.toThrow(ApiError);
        });
    });

    describe("searchVehicles", () => {
        it("should search vehicles with query", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSearchResponse,
            } as Response);

            const result = await searchVehicles("sand");
            expect(result.results[0].name).toBe("Sand Crawler");
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining("search=sand"));
        });

        it("should return all vehicles if no query", async () => {
            vi.mocked(fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSearchResponse,
            } as Response);

            const result = await searchVehicles("");
            expect(result.results.length).toBe(1);
            expect(fetch).toHaveBeenCalledWith("https://swapi.py4e.com/api/vehicles/");
        });
    });
});
