import { useState } from "react";
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
  const { data: vehicles, loading, error, refetch } = useApi(() =>
    vehicleAPI.getAll()
  );
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
      refetch();
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
        refetch();
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
                      value={formData.dailyRate ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dailyRate: Number(e.target.value) || 0,
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
                      <TableCell className="space-x-2">
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
                          onClick={() => handleDelete(vehicle.vehicleId)}
                          disabled={deleteMutation.loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

