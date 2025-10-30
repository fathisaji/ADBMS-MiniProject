import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ✅ Define vehicle type based on what your VIEW returns
interface VehicleView {
    Type: string;
    Brand: string;
    Model: string;
    Registration: string;
    "Daily Rate": number;
    "Branch Name": string;
    Status: string;
}

export default function CustomerVehicles() {
    const [vehicles, setVehicles] = useState<VehicleView[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Fetch data directly from backend view endpoint
    useEffect(() => {
        const fetchVehicleView = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/vehicles/view`
                );
                if (!response.ok) throw new Error("Failed to fetch vehicle data from view");

                const data = await response.json();
                setVehicles(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleView();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading vehicles...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Available Vehicles</h1>
                <p className="text-muted-foreground mt-2">
                    View all vehicles available for rent
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vehicle List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Brand</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead>Registration</TableHead>
                                    <TableHead>Daily Rate</TableHead>
                                    <TableHead>Branch</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicles.length > 0 ? (
                                    vehicles.map((vehicle, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{vehicle.Type}</TableCell>
                                            <TableCell>{vehicle.Brand}</TableCell>
                                            <TableCell>{vehicle.Model}</TableCell>
                                            <TableCell>{vehicle.Registration}</TableCell>
                                            <TableCell>
                                                {vehicle["Daily Rate"]
                                                    ? vehicle["Daily Rate"].toLocaleString("en-LK", {
                                                        style: "currency",
                                                        currency: "LKR",
                                                    })
                                                    : "LKR 0.00"}
                                            </TableCell>
                                            <TableCell>{vehicle["Branch Name"]}</TableCell>
                                            <TableCell>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                vehicle.Status === "Available"
                                    ? "bg-green-100 text-green-800"
                                    : vehicle.Status === "Rented"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {vehicle.Status}
                        </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                                            No vehicles found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
