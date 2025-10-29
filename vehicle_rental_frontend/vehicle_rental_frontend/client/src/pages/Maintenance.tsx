import { useState } from "react";
import { useApi, useMutation } from "@/hooks/useApi";
import { maintenanceAPI, vehicleAPI } from "@/lib/api";
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
import { Textarea } from "@/components/ui/textarea";

interface MaintenanceRecord {
  maintenanceId: number;
  vehicle?: any;
  maintenanceDate: string;
  description: string;
  cost: number;
  nextServiceDate: string;
}

export default function Maintenance() {
  const { data: maintenance, loading, error, refetch } = useApi(() =>
    maintenanceAPI.getAll()
  );
  const { data: vehicles } = useApi(() => vehicleAPI.getAll());

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<MaintenanceRecord>>({
    maintenanceDate: "",
    description: "",
    cost: 0,
    nextServiceDate: "",
  });

  const createMutation = useMutation((data: any) =>
    maintenanceAPI.create(data)
  );
  const updateMutation = useMutation((data: any) =>
    maintenanceAPI.update(editingId!, data)
  );
  const deleteMutation = useMutation((id: number) =>
    maintenanceAPI.delete(id)
  );

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
        maintenanceDate: "",
        description: "",
        cost: 0,
        nextServiceDate: "",
      });
      refetch();
    } catch (err) {
      console.error("Failed to save maintenance record:", err);
    }
  };

  const handleEdit = (record: MaintenanceRecord) => {
    setEditingId(record.maintenanceId);
    setFormData(record);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this maintenance record?")) {
      try {
        await deleteMutation.execute(id);
        refetch();
      } catch (err) {
        console.error("Failed to delete maintenance record:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading maintenance records...
          </p>
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
          <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground mt-2">
            Track vehicle maintenance and service records
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  maintenanceDate: "",
                  description: "",
                  cost: 0,
                  nextServiceDate: "",
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId
                  ? "Edit Maintenance Record"
                  : "Add New Maintenance Record"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                      vehicles.map((v: any) => (
                        <SelectItem key={v.vehicleId} value={v.vehicleId}>
                          {v.brand} {v.model} ({v.registrationNo})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenanceDate">Maintenance Date</Label>
                <Input
                      id="maintenanceDate"
                      type="date"
                      value={formData.maintenanceDate || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maintenanceDate: e.target.value,
                        })
                      }
                      max={new Date().toISOString().split("T")[0]} // prevents future dates if you want
                      required
                    />

              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the maintenance work performed..."
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                        <Label htmlFor="cost">Cost (LKR)</Label>
                        <Input
                          id="cost"
                          type="number"
                          step="0.01"
                          value={formData.cost !== undefined ? formData.cost : ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cost: e.target.value === '' ? undefined : parseFloat(e.target.value),
                            })
                          }
                          required
                        />
                      </div>

              <div className="space-y-2">
                <Label htmlFor="nextServiceDate">Next Service Date</Label>
                <Input
                    id="nextServiceDate"
                    type="date"
                    value={formData.nextServiceDate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nextServiceDate: e.target.value,
                      })
                    }
                    min={formData.maintenanceDate} // ensures next service is after maintenance
                  />
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
                  "Save Maintenance"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Maintenance Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Next Service</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenance && maintenance.length > 0 ? (
                  maintenance.map((record: MaintenanceRecord) => (
                    <TableRow key={record.maintenanceId}>
                      <TableCell>
                        {record.vehicle?.brand} {record.vehicle?.model}
                      </TableCell>
                      <TableCell>{record.maintenanceDate}</TableCell>
                      <TableCell>{`LKR ${record.cost.toFixed(2)}`}</TableCell>
                      <TableCell>{record.nextServiceDate}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {record.description}
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(record)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(record.maintenanceId)}
                          disabled={deleteMutation.loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No maintenance records found
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

