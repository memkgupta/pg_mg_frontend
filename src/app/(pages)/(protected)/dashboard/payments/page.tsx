"use client"
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const initialPayments = [
  {
    id: 1,
    tenant: "Rahul Sharma",
    room: "101",
    amount: 8000,
    months: 1,
    status: "paid",
    method: "UPI",
    date: "2025-09-01",
  },
  {
    id: 2,
    tenant: "Priya Singh",
    room: "202",
    amount: 12000,
    months: 2,
    status: "pending",
    method: "Cash",
    date: "2025-09-05",
  },
  {
    id: 3,
    tenant: "Aman Gupta",
    room: "301",
    amount: 6000,
    months: 1,
    status: "overdue",
    method: "Bank Transfer",
    date: "2025-08-28",
  },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const filteredPayments = payments.filter(
    (p) =>
      p.tenant.toLowerCase().includes(search.toLowerCase()) ||
      p.room.includes(search) ||
      p.method.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: number, newStatus: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    setSelectedPayment((prev: any) => ({ ...prev, status: newStatus }));
  };

  return (
    <div className="p-6">
      {/* Header + Search */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">💳 Payments</h1>
        <Input
          placeholder="Search payments..."
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Payments Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Months</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPayments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.tenant}</TableCell>
              <TableCell>{p.room}</TableCell>
              <TableCell>₹{p.amount}</TableCell>
              <TableCell>{p.months}</TableCell>
              <TableCell>
                <Badge
                  className={
                    p.status === "paid"
                      ? "bg-green-200 text-green-800"
                      : p.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }
                >
                  {p.status}
                </Badge>
              </TableCell>
              <TableCell>{p.method}</TableCell>
              <TableCell>{p.date}</TableCell>
              <TableCell>
                <Dialog onOpenChange={(open) => !open && setSelectedPayment(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPayment(p)}
                    >
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {selectedPayment && (
                      <>
                        <DialogHeader>
                          <DialogTitle>Payment #{selectedPayment.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                          <p><strong>Tenant:</strong> {selectedPayment.tenant} (Room {selectedPayment.room})</p>
                          <p><strong>Amount:</strong> ₹{selectedPayment.amount}</p>
                          <p><strong>Months:</strong> {selectedPayment.months}</p>
                          <p><strong>Method:</strong> {selectedPayment.method}</p>
                          <p><strong>Status:</strong> {selectedPayment.status}</p>
                          <p><strong>Date:</strong> {selectedPayment.date}</p>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="secondary"
                            onClick={() => updateStatus(selectedPayment.id, "pending")}
                          >
                            Mark Pending
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => updateStatus(selectedPayment.id, "paid")}
                          >
                            Mark Paid
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => updateStatus(selectedPayment.id, "overdue")}
                          >
                            Mark Overdue
                          </Button>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
