import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/useApi";
import { vehicleAPI, customerAPI, rentalAPI, paymentAPI, branchAPI } from "@/lib/api";
import { AlertCircle, Loader2, LogOut } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
  const [, setLocation] = useLocation(); // For navigation
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    totalCustomers: 0,
    totalRentals: 0,
    totalBranches: 0,
    totalRevenue: 0,
  });

  const vehiclesState = useApi(() => vehicleAPI.getAll());
  const customersState = useApi(() => customerAPI.getAll());
  const rentalsState = useApi(() => rentalAPI.getAll());
  const paymentsState = useApi(() => paymentAPI.getAll());
  const branchesState = useApi(() => branchAPI.getAll());

  useEffect(() => {
    if (
        vehiclesState.data &&
        customersState.data &&
        rentalsState.data &&
        paymentsState.data &&
        branchesState.data
    ) {
      const availableCount = vehiclesState.data.filter(
          (v: any) => v.availabilityStatus === "Available"
      ).length;

      const totalRevenue = paymentsState.data.reduce(
          (sum: number, p: any) => sum + (p.amount || 0),
          0
      );

      setStats({
        totalVehicles: vehiclesState.data.length,
        availableVehicles: availableCount,
        totalCustomers: customersState.data.length,
        totalRentals: rentalsState.data.length,
        totalBranches: branchesState.data.length,
        totalRevenue: totalRevenue,
      });
    }
  }, [
    vehiclesState.data,
    customersState.data,
    rentalsState.data,
    paymentsState.data,
    branchesState.data,
  ]);

  const isLoading =
      vehiclesState.loading ||
      customersState.loading ||
      rentalsState.loading ||
      paymentsState.loading ||
      branchesState.loading;

  const hasError =
      vehiclesState.error ||
      customersState.error ||
      rentalsState.error ||
      paymentsState.error ||
      branchesState.error;

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT token
    setLocation("/login"); // redirect to login
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
              Failed to load dashboard data. Please ensure the backend server is
              running at {import.meta.env.VITE_API_URL || "http://localhost:8080"}
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
          {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
  );

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome to the Vehicle Rental Management System
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
          <StatCard
              title="Total Vehicles"
              value={stats.totalVehicles}
              description={`${stats.availableVehicles} available for rent`}
          />
          <StatCard
              title="Available Vehicles"
              value={stats.availableVehicles}
              description="Ready to rent"
          />
          <StatCard
              title="Total Customers"
              value={stats.totalCustomers}
              description="Registered customers"
          />
          <StatCard
              title="Active Rentals"
              value={stats.totalRentals}
              description="Current rental bookings"
          />
          <StatCard
              title="Branches"
              value={stats.totalBranches}
              description="Operating locations"
          />
          <StatCard
              title="Total Revenue"
              value={`LKR ${stats.totalRevenue.toFixed(2)}`}
              description="From all payments"
          />
        </div>
      </div>
  );
}
