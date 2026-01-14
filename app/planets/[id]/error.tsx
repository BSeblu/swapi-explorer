"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <h2 className="text-2xl font-bold">Planet not found</h2>
            <p className="text-muted-foreground text-center max-w-md">
                We couldn&apos;t find the requested planet. It might not exist in the database or there was an error fetching the data.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="text-primary hover:underline"
                >
                    Try again
                </button>
                <Link href="/planets" className="text-primary hover:underline">
                    Return to list
                </Link>
            </div>
        </div>
    );
}
