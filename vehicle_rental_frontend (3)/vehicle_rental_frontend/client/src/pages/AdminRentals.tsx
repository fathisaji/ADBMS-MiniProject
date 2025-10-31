import { useApi, useMutation } from "@/hooks/useApi";
import { rentalAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, History } from "lucide-react";
import { useLocation } from "wouter";

interface Vehicle {
    vehicleId: number;
    brand: string;
    model: string;
    registrationNo: string;
}

interface Rental {
    rentalId: number;
    vehicle: Vehicle;
    customer: { name: string };
    rentalDate: string;
    returnDate: string;
    rentalStatus: string;
    totalAmount?: number;
}

export default function AdminRentals() {
    const { data: rentals, loading, refetch } = useApi<Rental[]>(() => rentalAPI.getAll());

    const approveMutation = useMutation((id: number) => rentalAPI.approve(id));
    const rejectMutation = useMutation((id: number) => rentalAPI.reject(id));

    const handleApprove = async (id: number) => {
        await approveMutation.execute(id);
        refetch();
    };

    const handleReject = async (id: number) => {
        await rejectMutation.execute(id);
        refetch();
    };

    const [, setLocation] = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-40">
                <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Manage Rentals</h1>
                <Button onClick={() => setLocation("/rental-audit")} variant="outline">
                    <History className="mr-2 h-4 w-4" /> Rental History
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rental Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {rentals && rentals.length > 0 ? (
                        rentals.map((r) => (
                            <div
                                key={r.rentalId}
                                className="border p-3 rounded-lg mb-3 shadow-sm bg-card"
                            >
                                <p><strong>Customer:</strong> {r.customer?.name}</p>
                                <p>
                                    <strong>Vehicle:</strong> {r.vehicle?.brand} {r.vehicle?.model} ({r.vehicle?.registrationNo})
                                </p>
                                <p>
                                    <strong>Period:</strong> {r.rentalDate} → {r.returnDate}
                                </p>
                                <p>
                                    <strong>Status:</strong> {r.rentalStatus}
                                </p>

                                <div className="mt-3 flex gap-2">
                                    <Button
                                        size="sm"
                                        disabled={approveMutation.loading}
                                        onClick={() => handleApprove(r.rentalId)}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        disabled={rejectMutation.loading}
                                        onClick={() => handleReject(r.rentalId)}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No rentals found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
