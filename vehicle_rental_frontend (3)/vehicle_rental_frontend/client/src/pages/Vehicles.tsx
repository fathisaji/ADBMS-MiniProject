import { useState, useEffect } from "react";
import { useApi, useMutation } from "@/hooks/useApi";
import { vehicleAPI } from "@/lib/api";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Vehicle {
  vehicleId: number;
  vehicleType: string;
  brand: string;
  model: string;
  registrationNo: string;
  dailyRate: number;
  availabilityStatus: string;
  branch?: any;
}

export default function Vehicles() {
  // --- State for toggle ---
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    vehicleType: "",
    brand: "",
    model: "",
    registrationNo: "",
    dailyRate: 0,
    availabilityStatus: "Available",
  });

  const createMutation = useMutation((data: Partial<Vehicle>) =>
    vehicleAPI.create(data)
  );
  const updateMutation = useMutation((data: Partial<Vehicle>) =>
    vehicleAPI.update(editingId!, data)
  );
  const deleteMutation = useMutation((id: number) => vehicleAPI.delete(id));

  // --- Fetch vehicles depending on toggle ---
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = showAvailableOnly
        ? await vehicleAPI.getAvailableFromView()
        : await vehicleAPI.getAll();
      setVehicles(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch vehicles");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, [showAvailableOnly]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.execute(formData);
      } else {
        await createMutation.execute(formData);
      }
      setIsDialogOpen(false);
      setEditingId(null);
      setFormData({
        vehicleType: "",
        brand: "",
        model: "",
        registrationNo: "",
        dailyRate: 0,
        availabilityStatus: "Available",
      });
      fetchVehicles();
    } catch (err) {
      console.error("Failed to save vehicle:", err);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.vehicleId);
    setFormData(vehicle);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteMutation.execute(id);
        fetchVehicles();
      } catch (err) {
        console.error("Failed to delete vehicle:", err);
      }
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground mt-2">
            Manage your vehicle inventory
          </p>
        </div>

        {/* --- Add Vehicle Button --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  vehicleType: "",
                  brand: "",
                  model: "",
                  registrationNo: "",
                  dailyRate: 0,
                  availabilityStatus: "Available",
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Vehicle" : "Add New Vehicle"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* --- Form Fields --- */}
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Input
                  id="vehicleType"
                  placeholder="e.g., Car, SUV, Truck"
                  value={formData.vehicleType || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleType: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  placeholder="e.g., Toyota"
                  value={formData.brand || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g., Camry"
                  value={formData.model || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNo">Registration Number</Label>
                <Input
                  id="registrationNo"
                  placeholder="e.g., ABC123"
                  value={formData.registrationNo || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationNo: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyRate">Daily Rate (LKR)</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  step="0.01"
                  value={formData.dailyRate || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dailyRate: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Availability Status</Label>
                <Select
                  value={formData.availabilityStatus || "Available"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, availabilityStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Rented">Rented</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={createMutation.loading || updateMutation.loading}
              >
                {createMutation.loading || updateMutation.loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Vehicle"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- Toggle Buttons --- */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={!showAvailableOnly ? "default" : "outline"}
          onClick={() => setShowAvailableOnly(false)}
        >
          Show All
        </Button>
        <Button
          variant={showAvailableOnly ? "default" : "outline"}
          onClick={() => setShowAvailableOnly(true)}
        >
          Show Available Only
        </Button>
      </div>

      {/* --- Vehicle Table --- */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Inventory</CardTitle>
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles && vehicles.length > 0 ? (
                  vehicles.map((vehicle: any) => (
                    <TableRow key={vehicle.vehicleId || vehicle.Vehicle_ID}>
                      <TableCell>
                        {vehicle.vehicleType || vehicle.Vehicle_Type}
                      </TableCell>
                      <TableCell>{vehicle.brand || vehicle.Brand}</TableCell>
                      <TableCell>{vehicle.model || vehicle.Model}</TableCell>
                      <TableCell>
                        {vehicle.registrationNo || "-"}
                      </TableCell>
                      <TableCell>
                        {(vehicle.dailyRate || vehicle.Daily_Rate)?.toLocaleString(
                          "en-LK",
                          { style: "currency", currency: "LKR" }
                        ) || "LKR 0.00"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (vehicle.availabilityStatus ||
                              vehicle.Availability_Status) === "Available"
                              ? "bg-green-100 text-green-800"
                              : (vehicle.availabilityStatus ||
                                  vehicle.Availability_Status) === "Rented"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {vehicle.availabilityStatus ||
                            vehicle.Availability_Status}
                        </span>
                      </TableCell>
                      <TableCell className="space-x-2">
                        {!showAvailableOnly && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(vehicle)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDelete(vehicle.vehicleId)
                              }
                              disabled={deleteMutation.loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No vehicles found
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