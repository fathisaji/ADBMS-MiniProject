import { useState } from "react";
import { useApi, useMutation } from "@/hooks/useApi";
import { branchAPI, staffAPI } from "@/lib/api";
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

interface Branch {
  branchId: number;
  branchName: string;
  location: string;
  contactNo: string;
  manager?: any;
}

export default function Branches() {
  const { data: branches, loading, error, refetch } = useApi(() =>
    branchAPI.getAll()
  );
  const { data: staff } = useApi(() => staffAPI.getAll());

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Branch>>({
    branchName: "",
    location: "",
    contactNo: "",
  });

  const createMutation = useMutation((data: any) => branchAPI.create(data));
  const updateMutation = useMutation((data: any) =>
    branchAPI.update(editingId!, data)
  );
  const deleteMutation = useMutation((id: number) => branchAPI.delete(id));

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
        branchName: "",
        location: "",
        contactNo: "",
      });
      refetch();
    } catch (err) {
      console.error("Failed to save branch:", err);
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingId(branch.branchId);
    setFormData(branch);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this branch?")) {
      try {
        await deleteMutation.execute(id);
        refetch();
      } catch (err) {
        console.error("Failed to delete branch:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading branches...</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground mt-2">
            Manage rental branch locations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  branchName: "",
                  location: "",
                  contactNo: "",
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Branch" : "Add New Branch"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branchName">Branch Name</Label>
                <Input
                  id="branchName"
                  placeholder="Downtown Branch"
                  value={formData.branchName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, branchName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="123 Main Street, City"
                  value={formData.location || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNo">Contact Number</Label>
                <Input
                  id="contactNo"
                  placeholder="555-1234"
                  value={formData.contactNo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNo: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      manager: { staffId: parseInt(value) },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
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
                  "Save Branch"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Branch Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches && branches.length > 0 ? (
                  branches.map((branch: Branch) => (
                    <TableRow key={branch.branchId}>
                      <TableCell className="font-medium">
                        {branch.branchName}
                      </TableCell>
                      <TableCell>{branch.location}</TableCell>
                      <TableCell>{branch.contactNo}</TableCell>
                      <TableCell>{branch.manager?.fullName || "N/A"}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(branch)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(branch.branchId)}
                          disabled={deleteMutation.loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No branches found
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

