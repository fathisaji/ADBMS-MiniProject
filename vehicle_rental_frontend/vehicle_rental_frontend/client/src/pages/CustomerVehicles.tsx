import { useApi } from "@/hooks/useApi";
import { vehicleAPI } from "@/lib/api";
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

interface Vehicle {
    vehicleId: number;
    vehicleType: string;
    brand: string;
    model: string;
    registrationNo: string;
    dailyRate: number;
    availabilityStatus: string;
}

export default function CustomerVehicles() {
    const { data: vehicles, loading, error } = useApi(() => vehicleAPI.getAll());

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
        <div className="space-y-6">
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
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicles && vehicles.length > 0 ? (
                                    vehicles.map((vehicle: Vehicle) => (
                                        <TableRow key={vehicle.vehicleId}>
                                            <TableCell>{vehicle.vehicleType}</TableCell>
                                            <TableCell>{vehicle.brand}</TableCell>
                                            <TableCell>{vehicle.model}</TableCell>
                                            <TableCell>{vehicle.registrationNo}</TableCell>
                                            <TableCell>
                                                {vehicle.dailyRate
                                                    ? vehicle.dailyRate.toLocaleString("en-LK", {
                                                        style: "currency",
                                                        currency: "LKR",
                                                    })
                                                    : "LKR 0.00"}
                                            </TableCell>
                                            <TableCell>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                vehicle.availabilityStatus === "Available"
                                    ? "bg-green-100 text-green-800"
                                    : vehicle.availabilityStatus === "Rented"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {vehicle.availabilityStatus}
                        </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            No vehicles available at the moment
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
