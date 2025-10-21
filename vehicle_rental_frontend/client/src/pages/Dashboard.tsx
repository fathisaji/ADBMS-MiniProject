import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/useApi";
import {
  vehicleAPI,
  customerAPI,
  rentalAPI,
  paymentAPI,
  branchAPI,
} from "@/lib/api";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the Vehicle Rental Management System
        </p>
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
          value={`$${stats.totalRevenue.toFixed(2)}`}
          description="From all payments"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Backend API:</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database:</span>
              <span className="font-medium text-green-600">Operational</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">API Base URL:</span>
              <span className="font-mono text-xs">
                {import.meta.env.VITE_API_URL || "http://localhost:8080/api"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

