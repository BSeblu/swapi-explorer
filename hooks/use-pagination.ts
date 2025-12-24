"use client";

import { useTransition, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface UsePaginationOptions {
    count: number;
    itemsPerPage?: number;
}

export function usePagination({ count, itemsPerPage = 10 }: UsePaginationOptions) {
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

    const getUrl = useCallback((newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newPage === 1) {
            params.delete("page");
        } else {
            params.set("page", newPage.toString());
        }
        const queryString = params.toString();
        return queryString ? `${pathname}?${queryString}` : pathname;
    }, [searchParams, pathname]);

    const handlePageChange = useCallback((direction: "prev" | "next", newPage: number, e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isPending) {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        setLoadingDirection(direction);
        startTransition(() => {
            router.push(getUrl(newPage));
        });
    }, [isPending, getUrl, router]);

    return {
        currentPage,
        totalPages,
        isPending,
        loadingDirection,
        prevUrl: currentPage > 1 ? getUrl(currentPage - 1) : "#",
        nextUrl: currentPage < totalPages ? getUrl(currentPage + 1) : "#",
        handlePageChange,
    };
}
