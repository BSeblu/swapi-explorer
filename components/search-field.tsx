import Form from "next/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
    action: string;
    placeholder: string;
    defaultValue?: string;
    className?: string;
}

export function SearchField({ action, placeholder, defaultValue, className }: SearchFieldProps) {
    return (
        <Form
            action={action}
            className={cn("relative w-full max-w-sm", className)}
        >
            <div className="absolute left-2.5 top-2.5 flex items-center justify-center">
                <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
                key={defaultValue}
                name="search"
                type="search"
                placeholder={placeholder}
                className="pl-8"
                defaultValue={defaultValue}
                autoComplete="off"
            />
        </Form>
    );
}
