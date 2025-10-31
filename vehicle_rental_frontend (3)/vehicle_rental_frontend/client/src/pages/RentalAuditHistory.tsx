import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Match the field names exactly as returned by your view
interface RentalAuditView {
    id: number;
    rentalId: number;
    action: string;
    changedBy: string;
    changedAt: string;
}


export default function RentalAuditHistory() {
    const [audits, setAudits] = useState<RentalAuditView[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAuditData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/rentals/audit/view`
                );
                if (!response.ok) throw new Error("Failed to fetch rental audit data");
                const data = await response.json();
                setAudits(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAuditData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Rental Audit History</h1>
                <p className="text-muted-foreground mt-2">View all changes in rentals</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Audit Records</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Rental ID</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Changed By</TableHead>
                                    <TableHead>Changed At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {audits.length > 0 ? (
                                    audits.map((audit, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{audit.id}</TableCell>
                                            <TableCell>{audit.rentalId}</TableCell>
                                            <TableCell>{audit.action}</TableCell>
                                            <TableCell>{audit.changedBy}</TableCell>
                                            <TableCell>
                                                {new Date(audit.changedAt).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No audit records found.
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
