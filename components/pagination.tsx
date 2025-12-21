"use client";

import { useTransition, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
    count: number;
    itemsPerPage?: number;
}

export function Pagination({ count, itemsPerPage = 10 }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [loadingDirection, setLoadingDirection] = useState<"prev" | "next" | null>(null);

    const currentPage = Number(searchParams.get("page")) || 1;
    const totalPages = Math.ceil(count / itemsPerPage);

    useEffect(() => {
        if (!isPending) {
            setLoadingDirection(null);
        }
    }, [isPending]);

    if (totalPages <= 1) return null;

    const handlePageChange = (direction: "prev" | "next", newPage: number) => {
        const params = new URLSearchParams(searchParams);
        if (newPage === 1) {
            params.delete("page");
        } else {
            params.set("page", newPage.toString());
        }

        setLoadingDirection(direction);
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-8 pb-10">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange("prev", currentPage - 1)}
                disabled={currentPage <= 1 || isPending}
                className="relative cursor-pointer min-w-[100px]"
            >
                <div className={cn("flex items-center transition-opacity", loadingDirection === "prev" ? "opacity-0" : "opacity-100")}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </div>
                {loadingDirection === "prev" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                )}
            </Button>

            <div className="text-sm font-medium tabular-nums px-2">
                Page {currentPage} of {totalPages}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange("next", currentPage + 1)}
                disabled={currentPage >= totalPages || isPending}
                className="relative cursor-pointer min-w-[100px]"
            >
                <div className={cn("flex items-center transition-opacity", loadingDirection === "next" ? "opacity-0" : "opacity-100")}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </div>
                {loadingDirection === "next" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                )}
            </Button>
        </div>
    );
}
