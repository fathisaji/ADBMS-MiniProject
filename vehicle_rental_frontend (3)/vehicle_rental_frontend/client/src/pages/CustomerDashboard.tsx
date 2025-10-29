import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/useApi";
import { vehicleAPI, rentalAPI, paymentAPI } from "@/lib/api";
import { AlertCircle, Loader2, LogOut } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CustomerDashboard() {
    const [, setLocation] = useLocation(); // navigation
    const [stats, setStats] = useState({
        totalVehicles: 0,
        activeRentals: 0,
        totalPayments: 0,
    });

    const vehiclesState = useApi(() => vehicleAPI.getAll());
    const rentalsState = useApi(() => rentalAPI.getAll());
    const paymentsState = useApi(() => paymentAPI.getAll());

    useEffect(() => {
        if (vehiclesState.data && rentalsState.data && paymentsState.data) {
            const totalPayments = paymentsState.data.reduce(
                (sum: number, p: any) => sum + (p.amount || 0),
                0
            );

            setStats({
                totalVehicles: vehiclesState.data.length,
                activeRentals: rentalsState.data.length,
                totalPayments: totalPayments,
            });
        }
    }, [vehiclesState.data, rentalsState.data, paymentsState.data]);

    const isLoading = vehiclesState.loading || rentalsState.loading || paymentsState.loading;
    const hasError = vehiclesState.error || rentalsState.error || paymentsState.error;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setLocation("/login");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load dashboard data. Please ensure the backend server is running at{" "}
                        {import.meta.env.VITE_API_URL || "http://localhost:8080"}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const StatCard = ({
                          title,
                          value,
                          description,
                      }: {
        title: string;
        value: string | number;
        description?: string;
    }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Customer Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome! Here’s an overview of your rentals and payments
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Vehicles" value={stats.totalVehicles} description="Available vehicles" />
                <StatCard title="Active Rentals" value={stats.activeRentals} description="Your current rentals" />
                <StatCard title="Total Payments" value={`LKR ${stats.totalPayments.toFixed(2)}`} description="Your payments" />
            </div>
        </div>
    );
}
