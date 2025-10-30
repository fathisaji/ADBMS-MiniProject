import { useState } from "react";
import { useApi, useMutation } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { vehicleAPI, rentalAPI } from "@/lib/api";

// ---------------------- INTERFACES ----------------------
interface Vehicle {
  vehicleId: number;
  brand: string;
  model: string;
  registrationNo: string;
  availabilityStatus: string;
}

interface Rental {
  rentalId: number;
  vehicle?: Vehicle;
  rentalDate: string;
  returnDate: string;
  rentalStatus: string;
  customer?: any;
}

// ---------------------- COMPONENT ----------------------
export default function Rentals() {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<Partial<Rental>>({
    rentalDate: "",
    returnDate: "",
    rentalStatus: "Pending",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 🔹 Fetch vehicles
  const { data: vehicles, loading: loadingVehicles } = useApi<Vehicle[]>(() =>
    vehicleAPI.getAll()
  );

  // 🔹 Fetch rentals depending on user role
  const { data: rentals, loading, refetch } = useApi<Rental[]>(() =>
    user?.role === "CUSTOMER" ? rentalAPI.getByUser(user.userId) : rentalAPI.getAll()
  );

  // 🔹 Create rental mutation
  const createMutation = useMutation((data: any) => rentalAPI.create(data));

  // 🔹 Delete rental mutation
  const deleteMutation = useMutation((id: number) => rentalAPI.delete(id));

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-2">Loading user data...</p>
      </div>
    );
  }

  // ---------------------- FORM SUBMIT ----------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { vehicle, rentalDate, returnDate } = formData;

    if (!vehicle?.vehicleId || !rentalDate || !returnDate) {
      alert("Please fill all required fields.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset time to midnight
    const rentalStart = new Date(rentalDate);
    const rentalEnd = new Date(returnDate);

    // Validation: Rental date cannot be in the past
    if (rentalStart < today) {
      alert("Rental date cannot be in the past.");
      return;
    }

    // Validation: Return date cannot be before rental date
    if (rentalEnd < rentalStart) {
      alert("Return date cannot be before the rental date.");
      return;
    }

    const rentalData = {
      ...formData,
      customer: { customerId: user.userId },
      staff: { staffId: 1 }, // Temporary staff for demo
      rentalStatus: "Pending",
    };

    try {
      await createMutation.execute(rentalData);
      setIsDialogOpen(false);
      setFormData({ rentalDate: "", returnDate: "", rentalStatus: "Pending" });
      refetch();
    } catch (err) {
      console.error("Failed to create rental:", err);
      alert("Vehicle is not available or rental could not be created.");
    }
  };

  // ---------------------- DELETE HANDLER ----------------------
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this rental?")) {
      await deleteMutation.execute(id);
      refetch();
    }
  };

  // ---------------------- RENDER ----------------------
  return (
    <div className="space-y-6">
      {/* Header + New Rental Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Rentals</h1>
          <p className="text-muted-foreground mt-2">
            Request and track your vehicle rentals
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() =>
                setFormData({
                  rentalDate: "",
                  returnDate: "",
                  rentalStatus: "Pending",
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> New Rental
            </Button>
          </DialogTrigger>

          {/* Rental Form */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request New Rental</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Vehicle Select */}
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <Select
                  onValueChange={(value) => {
                    const selectedVehicle = vehicles?.find(
                      (v) => v.vehicleId === parseInt(value)
                    );
                    if (selectedVehicle) {
                      setFormData({
                        ...formData,
                        vehicle: selectedVehicle,
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingVehicles ? (
                      <p className="text-center text-gray-400 py-2">
                        Loading vehicles...
                      </p>
                    ) : (
                      vehicles
                        ?.filter((v) => v.availabilityStatus === "Available")
                        .map((v) => (
                          <SelectItem key={v.vehicleId} value={String(v.vehicleId)}>
                            {v.brand} {v.model} ({v.registrationNo})
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Rental Dates */}
              <div className="space-y-2">
                <Label htmlFor="rentalDate">Rental Date</Label>
                <Input
                  type="date"
                  id="rentalDate"
                  value={formData.rentalDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, rentalDate: e.target.value })
                  }
                  required
                  min={new Date().toISOString().split("T")[0]} // disable past dates
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="returnDate">Return Date</Label>
                <Input
                  type="date"
                  id="returnDate"
                  value={formData.returnDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, returnDate: e.target.value })
                  }
                  required
                  min={formData.rentalDate || new Date().toISOString().split("T")[0]} // return >= rental
                />
              </div>

              <Button type="submit" disabled={createMutation.loading}>
                {createMutation.loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Requesting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rental List */}
      <Card>
        <CardHeader>
          <CardTitle>Rental Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500 py-4">Loading rentals...</p>
          ) : rentals && rentals.length > 0 ? (
            rentals.map((r) => (
              <div
                key={r.rentalId}
                className="border p-3 rounded-lg mb-3 shadow-sm"
              >
                <p>
                  <strong>Vehicle:</strong> {r.vehicle?.brand} {r.vehicle?.model}
                </p>
                <p>
                  <strong>Rental Period:</strong> {r.rentalDate} → {r.returnDate}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      r.rentalStatus === "Pending"
                        ? "text-yellow-600"
                        : r.rentalStatus === "Approved"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {r.rentalStatus}
                  </span>
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(r.rentalId)}
                  disabled={deleteMutation.loading}
                  className="mt-2"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No rental requests yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
