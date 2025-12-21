export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string
    ) {
        super(`API Error: ${status} ${statusText}`);
        this.name = 'ApiError';
    }
}
