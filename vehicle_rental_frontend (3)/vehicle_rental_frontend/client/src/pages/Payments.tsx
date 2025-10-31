"use client";

import { useState, useEffect } from "react";
import { useApi, useMutation } from "@/hooks/useApi";
import { paymentAPI, rentalAPI, bankAccountAPI, customerAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

/* ---------- UI COMPONENTS ---------- */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Download,
  Eye,
  FileText,
  Calendar,
  CreditCard,
  User,
  Building,
  Landmark,
  CheckCircle,
  XCircle,
  Save,
  X,
} from "lucide-react";

/* ---------- TYPES ---------- */
interface Customer {
  customerId: number;
  fullName: string;
  nicPassportNo: string;
  phoneNo: string;
  email: string;
  address: string;
  licenseNo: string;
  username: string;
}

interface Rental {
  rentalId: number;
  customerId: number;
  customer?: Customer;
  rentalDate: string;
  rentalStatus: string;
  returnDate: string;
  totalAmount: number;
  staffId: number;
  vehicleId: number;
}

interface Payment {
  paymentId: number;
  rentalId: number;
  rental?: Rental;
  paymentDate: string;
  paymentMethod: string;
  amount: number | null;
  paymentStatus: string;
  slipFileName?: string;
  transactionId?: string;
  paymentDetails?: string;
  adminNotes?: string;
  customer?: Customer;
}

interface BankAccount {
  accountId: number;
  bankName: string;
  branch: string;
  accountNumber: string;
  accountHolderName: string;
  accountType: string;
  isActive: boolean;
}

/* ---------- BANK ACCOUNT MANAGEMENT COMPONENT ---------- */
function BankAccountManager({ bankAccounts, onUpdate }: { bankAccounts: BankAccount[]; onUpdate: () => void }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [newAccount, setNewAccount] = useState<Omit<BankAccount, 'accountId'>>({
    bankName: "",
    branch: "",
    accountNumber: "",
    accountHolderName: "",
    accountType: "Current",
    isActive: true,
  });

  const createMutation = useMutation((data: any) => bankAccountAPI.create(data));
  const updateMutation = useMutation((data: any) => bankAccountAPI.update(editingAccount!.accountId, data));
  const deleteMutation = useMutation((id: number) => bankAccountAPI.delete(id));

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.execute(newAccount);
      setIsAddDialogOpen(false);
      setNewAccount({
        bankName: "",
        branch: "",
        accountNumber: "",
        accountHolderName: "",
        accountType: "Current",
        isActive: true,
      });
      onUpdate();
      alert("Bank account added successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to add bank account");
    }
  };

  const handleEditAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    
    try {
      await updateMutation.execute(editingAccount);
      setIsEditDialogOpen(false);
      setEditingAccount(null);
      onUpdate();
      alert("Bank account updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update bank account");
    }
  };

  const handleDeleteAccount = async (accountId: number) => {
    if (!confirm("Are you sure you want to delete this bank account?")) return;
    
    try {
      await deleteMutation.execute(accountId);
      onUpdate();
      alert("Bank account deleted successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to delete bank account");
    }
  };

  const openEditDialog = (account: BankAccount) => {
    setEditingAccount({ ...account });
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Landmark className="h-5 w-5" />
          Bank Account Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bankAccounts.map((account) => (
            <div key={account.accountId} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{account.bankName}</h3>
                    <Badge variant={account.isActive ? "default" : "secondary"}>
                      {account.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Branch:</span>
                      <p className="font-medium">{account.branch}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Account Number:</span>
                      <p className="font-mono font-medium">{account.accountNumber}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Account Holder:</span>
                      <p className="font-medium">{account.accountHolderName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Account Type:</span>
                      <p className="font-medium">{account.accountType}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(account)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteAccount(account.accountId)}
                    disabled={deleteMutation.loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Bank Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Bank Account</DialogTitle>
                <DialogDescription>
                  Enter the details of the new bank account for receiving payments.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    value={newAccount.bankName}
                    onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                    placeholder="Enter bank name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch *</Label>
                  <Input
                    id="branch"
                    value={newAccount.branch}
                    onChange={(e) => setNewAccount({ ...newAccount, branch: e.target.value })}
                    placeholder="Enter branch name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={newAccount.accountNumber}
                    onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                    placeholder="Enter account number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                  <Input
                    id="accountHolderName"
                    value={newAccount.accountHolderName}
                    onChange={(e) => setNewAccount({ ...newAccount, accountHolderName: e.target.value })}
                    placeholder="Enter account holder name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type *</Label>
                  <Select
                    value={newAccount.accountType}
                    onValueChange={(value: "Current" | "Savings") => setNewAccount({ ...newAccount, accountType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Current">Current Account</SelectItem>
                      <SelectItem value="Savings">Savings Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newAccount.isActive}
                    onChange={(e) => setNewAccount({ ...newAccount, isActive: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isActive">Active Account</Label>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.loading}>
                    {createMutation.loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Add Account
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Bank Account</DialogTitle>
                <DialogDescription>
                  Update the bank account details.
                </DialogDescription>
              </DialogHeader>
              {editingAccount && (
                <form onSubmit={handleEditAccount} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-bankName">Bank Name *</Label>
                    <Input
                      id="edit-bankName"
                      value={editingAccount.bankName}
                      onChange={(e) => setEditingAccount({ ...editingAccount, bankName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-branch">Branch *</Label>
                    <Input
                      id="edit-branch"
                      value={editingAccount.branch}
                      onChange={(e) => setEditingAccount({ ...editingAccount, branch: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-accountNumber">Account Number *</Label>
                    <Input
                      id="edit-accountNumber"
                      value={editingAccount.accountNumber}
                      onChange={(e) => setEditingAccount({ ...editingAccount, accountNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-accountHolderName">Account Holder Name *</Label>
                    <Input
                      id="edit-accountHolderName"
                      value={editingAccount.accountHolderName}
                      onChange={(e) => setEditingAccount({ ...editingAccount, accountHolderName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-accountType">Account Type *</Label>
                    <Select
                      value={editingAccount.accountType}
                      onValueChange={(value: "Current" | "Savings") => setEditingAccount({ ...editingAccount, accountType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Current">Current Account</SelectItem>
                        <SelectItem value="Savings">Savings Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-isActive"
                      checked={editingAccount.isActive}
                      onChange={(e) => setEditingAccount({ ...editingAccount, isActive: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="edit-isActive">Active Account</Label>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={updateMutation.loading}>
                      {updateMutation.loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Account
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------- PAYMENT DETAILS VIEW ---------- */
function PaymentDetailsView({ payment, bankAccounts, isAdmin = false }: { payment: Payment; bankAccounts: BankAccount[]; isAdmin?: boolean }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payment ID:</span>
              <span className="text-sm font-medium">#{payment.paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Rental ID:</span>
              <span className="text-sm font-medium">#{payment.rentalId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="text-sm font-semibold">
                LKR {payment.amount ? payment.amount.toFixed(2) : "0.00"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Date:</span>
              <span className="text-sm">{payment.paymentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Method:</span>
              <Badge variant="outline">{payment.paymentMethod}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge
                className={
                  payment.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-800"
                    : payment.paymentStatus === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }
              >
                {payment.paymentStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name:</span>
              <span className="text-sm font-medium">
                {payment.customer?.fullName || payment.rental?.customer?.fullName || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Email:</span>
              <span className="text-sm">
                {payment.customer?.email || payment.rental?.customer?.email || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Phone:</span>
              <span className="text-sm">
                {payment.customer?.phoneNo || payment.rental?.customer?.phoneNo || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">License No:</span>
              <span className="text-sm">
                {payment.customer?.licenseNo || payment.rental?.customer?.licenseNo || "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {payment.transactionId && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Transaction ID</Label>
                <p className="text-sm font-mono">{payment.transactionId}</p>
              </div>
            </div>
            {payment.paymentDetails && (
              <div className="mt-3 space-y-1">
                <Label className="text-xs text-muted-foreground">Payment Notes</Label>
                <p className="text-sm bg-muted p-3 rounded-md">{payment.paymentDetails}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {payment.paymentMethod === "Online" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Bank Account Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bankAccounts
                .filter((acc) => acc.isActive)
                .map((account) => (
                  <div key={account.accountId} className="p-4 border rounded-lg bg-muted/50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Bank:</span>
                        <p className="font-medium">{account.bankName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Branch:</span>
                        <p className="font-medium">{account.branch}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Account Number:</span>
                        <p className="font-mono font-medium">{account.accountNumber}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Account Holder:</span>
                        <p className="font-medium">{account.accountHolderName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Account Type:</span>
                        <p className="font-medium">{account.accountType}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Payment Slip
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payment.slipFileName ? (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{payment.slipFileName}</p>
                  <p className="text-xs text-muted-foreground">Uploaded payment slip</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  paymentAPI
                    .downloadSlip(payment.paymentId)
                    .then(async (res) => {
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = payment.slipFileName!;
                      a.click();
                    })
                    .catch((err) => console.error("Download failed:", err));
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          ) : (
            <div className="text-center py-6 border-2 border-dashed rounded-lg">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No payment slip uploaded</p>
            </div>
          )}
        </CardContent>
      </Card>

      {isAdmin && payment.adminNotes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Admin Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200">{payment.adminNotes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ---------- CUSTOMER PAGE ---------- */
function CustomerPage({ bankAccounts }: { bankAccounts: BankAccount[] }) {
  const { data: payments, loading, error, refetch } = useApi(() => paymentAPI.getAll());
  const { data: rentals } = useApi(() => rentalAPI.getAll());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedRental, setSelectedRental] = useState<any>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [details, setDetails] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const createMutation = useMutation((data: any) => paymentAPI.create(data));

const handleSubmitPayment = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedRental || !slipFile) return alert("Select rental & upload slip");
  
  try {
    // Create FormData instead of JSON
    const formData = new FormData();
    
    // Add payment data as JSON string
    const paymentData = {
      rentalId: selectedRental.rentalId,
      amount: selectedRental.totalAmount || 0,
      paymentMethod: "Online",
      paymentStatus: "Pending",
      paymentDate: new Date().toISOString().split("T")[0],
      transactionId: transactionId || undefined,
      paymentDetails: details || undefined,
    };
    
    formData.append("payment", new Blob([JSON.stringify(paymentData)], {
      type: "application/json"
    }));
    
    // Add the file
    formData.append("slipFile", slipFile);

    await createMutation.execute(formData);
    setDialogOpen(false);
    setSelectedRental(null);
    setSlipFile(null);
    setDetails("");
    setTransactionId("");
    refetch();
    alert("Payment submitted! Admin will verify the slip and update the status soon.");
  } catch (err: any) {
    alert(err.message || "Submit failed");
  }
};

  const viewPayment = (p: Payment) => {
    setSelectedPayment(p);
    setViewOpen(true);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground ml-2">Loading payments...</p>
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Payments</h1>
          <p className="text-muted-foreground mt-2">View and manage your rental payments</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Make Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Make Payment</DialogTitle>
              <DialogDescription>Select a rental and provide payment details</DialogDescription>
            </DialogHeader>

            {selectedRental ? (
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Rental Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rental ID:</span>
                      <span className="text-sm font-medium">#{selectedRental.rentalId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Amount Due:</span>
                      <span className="text-sm font-semibold">
                        LKR {(selectedRental.totalAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Bank Account Details for Transfer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {bankAccounts
                      .filter((acc) => acc.isActive)
                      .map((acc) => (
                        <div key={acc.accountId} className="p-3 border rounded-lg bg-muted/50">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Bank:</span>
                              <p className="font-medium">{acc.bankName}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Branch:</span>
                              <p className="font-medium">{acc.branch}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Account No:</span>
                              <p className="font-mono font-medium">{acc.accountNumber}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Account Holder:</span>
                              <p className="font-medium">{acc.accountHolderName}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                    <Input
                      id="transactionId"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter bank transaction reference"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentDetails">Payment Notes (Optional)</Label>
                    <Textarea
                      id="paymentDetails"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Any additional payment information..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slipFile">Upload Payment Slip *</Label>
                    <Input
                      id="slipFile"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setSlipFile(e.target.files?.[0] || null)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Upload a clear image or PDF of your payment slip</p>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Please transfer the exact amount to one of the bank accounts above and upload the payment slip. 
                    Your payment status will be "Pending" until admin verifies your slip and updates the status to "Paid" or "Failed".
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" disabled={createMutation.loading}>
                  {createMutation.loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting Payment...
                    </>
                  ) : (
                    "Submit Payment"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <Label htmlFor="rentalSelect">Select Rental to Pay</Label>
                <Select
                  onValueChange={(value) => {
                    const rental = rentals?.find((r: any) => r.rentalId === parseInt(value));
                    if (rental) setSelectedRental(rental);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a rental to pay" />
                  </SelectTrigger>
                  <SelectContent>
                    {rentals &&
                      rentals.map((r: any) => (
                        <SelectItem key={r.rentalId} value={r.rentalId.toString()}>
                          Rental #{r.rentalId} - LKR {(r.totalAmount || 0).toFixed(2)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Rental ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Slip</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments && payments.length > 0 ? (
                  payments.map((p: Payment) => (
                    <TableRow key={p.paymentId}>
                      <TableCell className="font-medium">#{p.paymentId}</TableCell>
                      <TableCell>#{p.rental?.rentalId ? `${p.rental.rentalId}` : "N/A"}</TableCell>
                      <TableCell>LKR {(p.amount || 0).toFixed(2)}</TableCell>
                      <TableCell>{p.paymentDate}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            p.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : p.paymentStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {p.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {p.slipFileName ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              paymentAPI
                                .downloadSlip(p.paymentId)
                                .then(async (res) => {
                                  const blob = await res.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement("a");
                                  a.href = url;
                                  a.download = p.slipFileName!;
                                  a.click();
                                })
                                .catch((err) => console.error("Download failed:", err));
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">No slip</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => viewPayment(p)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedPayment && (
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Payment Details - #{selectedPayment.paymentId}
              </DialogTitle>
              <DialogDescription>Complete payment information for Rental #{selectedPayment.rentalId}</DialogDescription>
            </DialogHeader>
            <PaymentDetailsView payment={selectedPayment} bankAccounts={bankAccounts} isAdmin={false} />
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setViewOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

/* ---------- ADMIN PAGE ---------- */
function AdminPage({ bankAccounts: initialBankAccounts }: { bankAccounts: BankAccount[] }) {
  const { data: payments, loading: paymentsLoading, error: paymentsError, refetch: refetchPayments } = useApi(() => paymentAPI.getAll());
  const { data: bankAccounts, refetch: refetchBankAccounts } = useApi(() => bankAccountAPI.getAll());
  const { data: customers, loading: customersLoading } = useApi(() => customerAPI.getAll());
  const { data: rentals, loading: rentalsLoading } = useApi(() => rentalAPI.getAll());


  // Enhanced payment data - SIMPLIFIED since payments already have rental data
  const enhancedPayments = payments?.map((payment: Payment) => {
    // If payment already has rental with customer data, use it directly
    if (payment.rental?.customer) {
      return {
        ...payment,
        customer: payment.rental.customer
      };
    }

    // Fallback: Try to find rental and customer if not included in payment
    const rental = rentals?.find((r: Rental) => r.rentalId === payment.rentalId);
    let customer = null;
    
    if (rental?.customer) {
      customer = rental.customer;
    } else if (rental?.customerId) {
      customer = customers?.find((c: Customer) => c.customerId === rental.customerId);
    }

    return {
      ...payment,
      rental: rental || payment.rental,
      customer
    };
  });

  const [statusOpen, setStatusOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Payment>>({
    paymentStatus: "Pending",
    adminNotes: "",
  });

  const updateMutation = useMutation((data: any) => paymentAPI.update(editingId!, data));
  const deleteMutation = useMutation((id: number) => paymentAPI.delete(id));

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.execute(formData);
      setStatusOpen(false);
      setEditingId(null);
      setFormData({ paymentStatus: "Pending", adminNotes: "" });
      refetchPayments();
    } catch (err) {
      console.error("Failed to update payment:", err);
    }
  };

  const editPayment = (p: Payment) => {
    setEditingId(p.paymentId);
    setFormData({ 
      paymentStatus: p.paymentStatus, 
      adminNotes: p.adminNotes || "" 
    });
    setStatusOpen(true);
  };

  const viewPayment = (p: Payment) => {
    setSelectedPayment(p);
    setViewOpen(true);
  };

  const deletePayment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;
    try {
      await deleteMutation.execute(id);
      refetchPayments();
    } catch (err) {
      console.error("Failed to delete payment:", err);
    }
  };

  const downloadSlip = (p: Payment) => {
    if (!p.slipFileName) return alert("No slip uploaded yet!");
    paymentAPI
      .downloadSlip(p.paymentId)
      .then(async (res) => {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = p.slipFileName!;
        a.click();
      })
      .catch((err) => console.error("Download failed:", err));
  };

  const handleBankUpdate = () => {
    refetchBankAccounts();
  };

  const loading = paymentsLoading || customersLoading || rentalsLoading;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground ml-2">Loading payments...</p>
      </div>
    );

  if (paymentsError)
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{paymentsError}</AlertDescription>
      </Alert>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments Management</h1>
          <p className="text-muted-foreground mt-2">Manage rental payments and view payment details</p>
        </div>

        <Button variant="outline" onClick={() => setShowBank(!showBank)}>
          <Landmark className="h-4 w-4 mr-2" />
          {showBank ? "Hide Bank Accounts" : "Manage Bank Accounts"}
        </Button>
      </div>

      {showBank ? (
        <BankAccountManager 
          bankAccounts={bankAccounts || initialBankAccounts} 
          onUpdate={handleBankUpdate} 
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Payment Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Rental ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Slip</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enhancedPayments && enhancedPayments.length > 0 ? (
                    enhancedPayments.map((p: Payment) => {
                      
                      return (
                        <TableRow key={p.paymentId}>
                          <TableCell className="font-medium">#{p.paymentId}</TableCell>
                          <TableCell>
                            {p.rental?.rentalId ? `#${p.rental.rentalId}` : "N/A"}
                          </TableCell>
                          <TableCell>
                            {p.customer?.fullName || p.rental?.customer?.fullName || "Unknown Customer"}
                          </TableCell>
                          <TableCell>LKR {(p.amount || 0).toFixed(2)}</TableCell>
                          <TableCell>{p.paymentDate}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{p.paymentMethod}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                p.paymentStatus === "Paid"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : p.paymentStatus === "Pending"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                              }
                            >
                              {p.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {p.slipFileName ? (
                              <Button size="sm" variant="outline" onClick={() => downloadSlip(p)}>
                                <Download className="h-4 w-4" />
                              </Button>
                            ) : (
                              <span className="text-sm text-muted-foreground">No slip</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => viewPayment(p)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => editPayment(p)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deletePayment(p.paymentId)}
                                disabled={deleteMutation.loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        No payments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Payment Status</DialogTitle>
                <DialogDescription>
                  Verify the payment slip and update payment status for Payment #{editingId}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleStatusUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status *</Label>
                  <Select
                    value={formData.paymentStatus}
                    onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending - Waiting for verification</SelectItem>
                      <SelectItem value="Paid">Paid - Payment verified and accepted</SelectItem>
                      <SelectItem value="Failed">Failed - Payment rejected or invalid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminNotes">Admin Notes</Label>
                  <Textarea
                    id="adminNotes"
                    value={formData.adminNotes || ""}
                    onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                    placeholder="Add verification notes, reasons for rejection, or any comments..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    These notes will be visible to admins only. Use this to document verification details.
                  </p>
                </div>
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Customer payments are submitted as "Pending". Verify the payment slip against bank records 
                    before updating the status to "Paid" or "Failed".
                  </AlertDescription>
                </Alert>
                <Button type="submit" className="w-full" disabled={updateMutation.loading}>
                  {updateMutation.loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Payment Status"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {selectedPayment && (
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Payment Details - #{selectedPayment.paymentId}
                  </DialogTitle>
                  <DialogDescription>Complete payment information for Rental #{selectedPayment.rentalId}</DialogDescription>
                </DialogHeader>
                <PaymentDetailsView 
                  payment={selectedPayment} 
                  bankAccounts={bankAccounts || initialBankAccounts} 
                  isAdmin={true} 
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setViewOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => editPayment(selectedPayment)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Update Status
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
}

/* ---------- MAIN COMPONENT ---------- */
export default function Payments() {
  const { user } = useAuthStore();
  const { data: bankAccountsData } = useApi(() => bankAccountAPI.getAll());
  
  // Use fetched bank accounts
  const bankAccounts = bankAccountsData || [];

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground ml-2">Loading user data...</p>
      </div>
    );

  return user.role === "ADMIN" ? (
    <AdminPage bankAccounts={bankAccounts} />
  ) : (
    <CustomerPage bankAccounts={bankAccounts} />
  );
}