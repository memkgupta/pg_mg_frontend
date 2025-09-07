"use client"
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const initialComplaints = [
  {
    id: 1,
    tenant: "Rahul Sharma",
    room: "101",
    issue: "Plumbing",
    description: "Water leakage in bathroom.",
    status: "pending",
    date: "2025-09-01",
  },
  {
    id: 2,
    tenant: "Priya Singh",
    room: "202",
    issue: "Electricity",
    description: "Fan not working.",
    status: "in_progress",
    date: "2025-09-03",
  },
  {
    id: 3,
    tenant: "Aman Gupta",
    room: "301",
    issue: "Cleanliness",
    description: "Room cleaning not done for 3 days.",
    status: "resolved",
    date: "2025-09-05",
  },
];

export default function ComplaintPage() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [search, setSearch] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  const filteredComplaints = complaints.filter(
    (c) =>
      c.tenant.toLowerCase().includes(search.toLowerCase()) ||
      c.room.includes(search) ||
      c.issue.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: number, newStatus: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    setSelectedComplaint((prev: any) => ({ ...prev, status: newStatus }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📢 Complaints</h1>
        <Input
          placeholder="Search complaints..."
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredComplaints.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.tenant}</TableCell>
              <TableCell>{c.room}</TableCell>
              <TableCell>{c.issue}</TableCell>
              <TableCell>
                <Badge
                  className={
                    c.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : c.status === "in_progress"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-green-200 text-green-800"
                  }
                >
                  {c.status}
                </Badge>
              </TableCell>
              <TableCell>{c.date}</TableCell>
              <TableCell>
                <Dialog onOpenChange={(open) => !open && setSelectedComplaint(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedComplaint(c)}
                    >
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {selectedComplaint && (
                      <>
                        <DialogHeader>
                          <DialogTitle>Complaint #{selectedComplaint.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                          <p><strong>Tenant:</strong> {selectedComplaint.tenant} (Room {selectedComplaint.room})</p>
                          <p><strong>Issue:</strong> {selectedComplaint.issue}</p>
                          <p><strong>Description:</strong> {selectedComplaint.description}</p>
                          <p><strong>Status:</strong> {selectedComplaint.status}</p>
                          <p><strong>Date:</strong> {selectedComplaint.date}</p>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            onClick={() => updateStatus(selectedComplaint.id, "pending")}
                          >
                            Mark Pending
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => updateStatus(selectedComplaint.id, "in_progress")}
                          >
                            Mark In Progress
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => updateStatus(selectedComplaint.id, "resolved")}
                          >
                            Mark Resolved
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
