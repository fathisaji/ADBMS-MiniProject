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
  type: string;
  brand: string;
  model: string;
  registration: string;
  daily_rate: number;
  branch_name: string;
  status: string;
}



export default function CustomerVehicles() {
    const [vehicles, setVehicles] = useState<VehicleView[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Fetch data from backend
    useEffect(() => {
        const fetchAuditData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/rentals/audit`
                );
                if (!response.ok) throw new Error("Failed to fetch rental audit data");
                const data = await response.json();
                setAudits(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAuditData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                <h1 className="text-3xl font-bold tracking-tight">Rental Audit History</h1>
                <p className="text-muted-foreground mt-2">View all changes in rentals</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Audit Records</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Rental ID</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Changed By</TableHead>
                                    <TableHead>Changed At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {audits.length > 0 ? (
                                    audits.map((audit, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{vehicle.type}</TableCell>
<TableCell>{vehicle.brand}</TableCell>
<TableCell>{vehicle.model}</TableCell>
<TableCell>{vehicle.registration}</TableCell>
<TableCell>
  {vehicle.daily_rate.toLocaleString("en-LK", { style: "currency", currency: "LKR" })}
</TableCell>
<TableCell>{vehicle.branch_name}</TableCell>
<TableCell>
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
    vehicle.status === "Available"
      ? "bg-green-100 text-green-800"
      : vehicle.status === "Rented"
        ? "bg-blue-100 text-blue-800"
        : "bg-yellow-100 text-yellow-800"
  }`}>
    {vehicle.status}
  </span>
</TableCell>

                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No audit records found.
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
