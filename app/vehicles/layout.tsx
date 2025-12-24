export default function VehiclesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
                    <p className="text-muted-foreground">
                        Discover the various transports used across the galaxy.
                    </p>
                </div>

                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}
