"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import { useApiGet } from "@/hooks/api_hooks";
import { IRent } from "@/types";

const paymentHistory = [
  {
    id: 1,
    amount: "₹8000",
    date: "01 Aug 2025",
    status: "Paid",
  },
  {
    id: 2,
    amount: "₹8000",
    date: "01 Jul 2025",
    status: "Paid",
  },
  {
    id: 3,
    amount: "₹8000",
    date: "01 Jun 2025",
    status: "Paid",
  },
];

export default function PaymentsPage() {
  const upcomingPayment = {
    amount: "₹8000",
    dueDate: "01 Sep 2025",
    status: "Pending",
  };
  const {data} = useApiGet<{payments:any[],dueRents:IRent[]}>(`/aggregate/dashboard/payments`,{},{
    queryKey:["account-payment"]
  })
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CreditCard size={24} className="text-green-600" /> Payments
      </h1>
      <p className="text-gray-500 text-sm">Manage your rent payments</p>

      {/* Upcoming Payment */}
      <Card className="shadow-lg rounded-2xl border border-yellow-300 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            Upcoming Rent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Amount:</strong> {upcomingPayment.amount}</p>
          <p><strong>Due Date:</strong> {upcomingPayment.dueDate}</p>
          <p className="flex items-center gap-2">
            <Clock size={16} className="text-red-500" />
            <span className="text-red-600 font-medium">{upcomingPayment.status}</span>
          </p>
          <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">
            Pay Now
          </Button>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentHistory.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center border-b pb-2 last:border-none"
            >
              <div>
                <p className="font-medium">{p.amount}</p>
                <p className="text-xs text-gray-500">{p.date}</p>
              </div>
              <Badge
                variant={
                  p.status === "Paid"
                    ? "secondary"
                    : p.status === "Pending"
                    ? "outline"
                    : "destructive"
                }
                className="flex items-center gap-1"
              >
                {p.status === "Paid" && (
                  <CheckCircle size={14} className="text-green-600" />
                )}
                {p.status === "Pending" && (
                  <Clock size={14} className="text-yellow-600" />
                )}
                {p.status === "Failed" && (
                  <XCircle size={14} className="text-red-600" />
                )}
                {p.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
