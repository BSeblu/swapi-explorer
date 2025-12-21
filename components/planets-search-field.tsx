"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTransition, useRef, useState, useEffect } from "react";

export function PlanetsSearchField() {
    const searchParams = useSearchParams();
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();

    const urlQuery = searchParams.get("search") || "";
    const [value, setValue] = useState(urlQuery);

    useEffect(() => {
        setValue(urlQuery);
    }, [urlQuery]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleBlur = () => {
        if (value !== urlQuery) {
            startTransition(() => {
                formRef.current?.requestSubmit();
            });
        }
    };

    return (
        <Form
            ref={formRef}
            action="/planets"
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
                placeholder="Search planets..."
                className="pl-8"
                value={value}
                onChange={handleInputChange}
                onBlur={handleBlur}
                autoComplete="off"
            />
        </Form>
    );
}
