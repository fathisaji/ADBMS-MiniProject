import { useState } from "react";
import { useApi, useMutation } from "@/hooks/useApi";
import { rentalAPI, customerAPI, vehicleAPI, staffAPI } from "@/lib/api";
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
import { AlertCircle, Loader2, Plus, Trash2, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Rental {
  rentalId: number;
  customer?: any;
  vehicle?: any;
  staff?: any;
  rentalDate: string;
  returnDate: string;
  totalAmount: number;
  rentalStatus: string;
}

export default function Rentals() {
  const { data: rentals, loading, error, refetch } = useApi(() =>
    rentalAPI.getAll()
  );
  const { data: customers } = useApi(() => customerAPI.getAll());
  const { data: vehicles } = useApi(() => vehicleAPI.getAll());
  const { data: staff } = useApi(() => staffAPI.getAll());

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Rental>>({
    rentalDate: "",
    returnDate: "",
    totalAmount: 0,
    rentalStatus: "Ongoing",
  });

  const createMutation = useMutation((data: any) => rentalAPI.create(data));
  const deleteMutation = useMutation((id: number) => rentalAPI.delete(id));
  const completeMutation = useMutation((id: number) => rentalAPI.complete(id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.execute(formData);
      setIsDialogOpen(false);
      setFormData({
        rentalDate: "",
        returnDate: "",
        totalAmount: 0,
        rentalStatus: "Ongoing",
      });
      refetch();
    } catch (err) {
      console.error("Failed to save rental:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this rental?")) {
      try {
        await deleteMutation.execute(id);
        refetch();
      } catch (err) {
        console.error("Failed to delete rental:", err);
      }
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await completeMutation.execute(id);
      refetch();
    } catch (err) {
      console.error("Failed to complete rental:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading rentals...</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Rentals</h1>
          <p className="text-muted-foreground mt-2">
            Manage vehicle rental bookings
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  rentalDate: "",
                  returnDate: "",
                  totalAmount: 0,
                  rentalStatus: "Ongoing",
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Rental
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Rental</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      customer: { customerId: parseInt(value) },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers &&
                      customers.map((c: any) => (
                        <SelectItem key={c.customerId} value={c.customerId}>
                          {c.fullName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      vehicle: { vehicleId: parseInt(value) },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles &&
                      vehicles
                        .filter((v: any) => v.availabilityStatus === "Available")
                        .map((v: any) => (
                          <SelectItem key={v.vehicleId} value={v.vehicleId}>
                            {v.brand} {v.model} ({v.registrationNo})
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff">Staff</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      staff: { staffId: parseInt(value) },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff &&
                      staff.map((s: any) => (
                        <SelectItem key={s.staffId} value={s.staffId}>
                          {s.fullName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentalDate">Rental Date</Label>
                <Input
                  id="rentalDate"
                  type="date"
                  value={formData.rentalDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, rentalDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="returnDate">Return Date</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={formData.returnDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, returnDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount ($)</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  value={formData.totalAmount || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalAmount: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <Button type="submit" disabled={createMutation.loading}>
                {createMutation.loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Rental"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rental Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Rental Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals && rentals.length > 0 ? (
                  rentals.map((rental: Rental) => (
                    <TableRow key={rental.rentalId}>
                      <TableCell>
                        {rental.customer?.fullName || "N/A"}
                      </TableCell>
                      <TableCell>
                        {rental.vehicle?.brand} {rental.vehicle?.model}
                      </TableCell>
                      <TableCell>{rental.rentalDate}</TableCell>
                      <TableCell>{rental.returnDate}</TableCell>
                      <TableCell>${rental.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rental.rentalStatus === "Ongoing"
                              ? "bg-blue-100 text-blue-800"
                              : rental.rentalStatus === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {rental.rentalStatus}
                        </span>
                      </TableCell>
                      <TableCell className="space-x-2">
                        {rental.rentalStatus === "Ongoing" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleComplete(rental.rentalId)}
                            disabled={completeMutation.loading}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(rental.rentalId)}
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
                      No rentals found
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

