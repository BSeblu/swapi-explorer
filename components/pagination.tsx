"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";

interface PaginationProps {
    count: number;
    itemsPerPage?: number;
}

export function Pagination({ count, itemsPerPage = 10 }: PaginationProps) {
    const {
        currentPage,
        totalPages,
        isPending,
        loadingDirection,
        prevUrl,
        nextUrl,
        handlePageChange,
    } = usePagination({ count, itemsPerPage });

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-4 mt-8 pb-10">
            <Button
                variant="outline"
                size="sm"
                asChild
                disabled={currentPage <= 1 || isPending}
                className="relative min-w-[100px]"
            >
                <Link
                    href={prevUrl}
                    onClick={(e) => handlePageChange("prev", currentPage - 1, e)}
                    aria-disabled={currentPage <= 1 || isPending}
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
                </Link>
            </Button>

            <div className="text-sm font-medium tabular-nums px-2">
                Page {currentPage} of {totalPages}
            </div>

            <Button
                variant="outline"
                size="sm"
                asChild
                disabled={currentPage >= totalPages || isPending}
                className="relative min-w-[100px]"
            >
                <Link
                    href={nextUrl}
                    onClick={(e) => handlePageChange("next", currentPage + 1, e)}
                    aria-disabled={currentPage >= totalPages || isPending}
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
                </Link>
            </Button>
        </div>
    );
}
