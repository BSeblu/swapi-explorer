"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTransition, useRef, useState, useEffect } from "react";

export function PeopleSearchField() {
    const searchParams = useSearchParams();
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();

    // Use controlled state to avoid "changing default value" warnings
    const urlQuery = searchParams.get("search") || "";
    const [value, setValue] = useState(urlQuery);

    // Sync with URL changes (e.g. back/forward navigation)
    useEffect(() => {
        setValue(urlQuery);
    }, [urlQuery]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleBlur = () => {
        // Only submit if the value has changed since the last load to avoid redundant hits
        if (value !== urlQuery) {
            startTransition(() => {
                formRef.current?.requestSubmit();
            });
        }
    };

    return (
        <Form
            ref={formRef}
            action="/people"
            className="relative w-full max-w-sm"
        >
            <div className="absolute left-2.5 top-2.5 flex items-center justify-center">
                {isPending ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                    <Search className="h-4 w-4 text-muted-foreground" />
                )}
            </div>
            <Input
                name="search"
                type="search"
                placeholder="Search characters..."
                className="pl-8"
                value={value}
                onChange={handleInputChange}
                onBlur={handleBlur}
                autoComplete="off"
            />
        </Form>
    );
}
