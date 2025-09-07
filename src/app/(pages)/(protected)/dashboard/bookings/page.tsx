"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

const bookings = [
  {
    id: 1,
    tenant: "Rahul Sharma",
    room: "101",
    moveIn: "2025-09-01",
    months: 6,
    deposit: 5000,
    status: "active",
  },
  {
    id: 2,
    tenant: "Priya Singh",
    room: "203",
    moveIn: "2025-09-05",
    months: 3,
    deposit: 4000,
    status: "upcoming",
  },
  {
    id: 3,
    tenant: "Amit Verma",
    room: "105",
    moveIn: "2025-06-01",
    months: 2,
    deposit: 3000,
    status: "completed",
  },
];

export default function AdminBookingsPage() {
  const [search, setSearch] = useState("");

  const filtered = bookings.filter(
    (b) =>
      b.tenant.toLowerCase().includes(search.toLowerCase()) ||
      b.room.includes(search)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📑 All Bookings</h1>

      {/* Search bar */}
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by tenant or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <Button variant="outline">Export CSV</Button>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Move-in Date</TableHead>
                <TableHead>Duration (months)</TableHead>
                <TableHead>Deposit (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.tenant}</TableCell>
                  <TableCell>{b.room}</TableCell>
                  <TableCell>{b.moveIn}</TableCell>
                  <TableCell>{b.months}</TableCell>
                  <TableCell>{b.deposit}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        b.status === "active"
                          ? "bg-green-100 text-green-700"
                          : b.status === "upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="destructive">
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
