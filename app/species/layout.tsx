export default function SpeciesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Species</h1>
                    <p className="text-muted-foreground">
                        Discover the diverse inhabitants of the galaxy.
                    </p>
                </div>

                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}
