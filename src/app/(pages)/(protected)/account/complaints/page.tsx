"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";

const complaints = [
  {
    id: 1,
    title: "WiFi not working",
    desc: "Internet is down since last night in Room 203.",
    date: "20 Aug 2025",
    status: "Resolved",
  },
  {
    id: 2,
    title: "Water Supply Issue",
    desc: "No water in bathroom from morning.",
    date: "28 Aug 2025",
    status: "Pending",
  },
];

export default function ComplaintPage() {
  const [newComplaint, setNewComplaint] = useState({ title: "", desc: "" });

  const handleSubmit = () => {
    console.log("New Complaint Submitted:", newComplaint);
    // Here you’d normally send it to backend
    setNewComplaint({ title: "", desc: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="text-red-600" size={24} /> Complaints
        </h1>
        {/* Raise Complaint Button + Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">Raise Complaint</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Raise a Complaint</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Complaint Title"
                value={newComplaint.title}
                onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
              />
              <Textarea
                placeholder="Describe your issue..."
                value={newComplaint.desc}
                onChange={(e) => setNewComplaint({ ...newComplaint, desc: e.target.value })}
              />
              <Button className="w-full" onClick={handleSubmit}>
                Submit Complaint
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {complaints.map((c) => (
          <Card key={c.id} className="shadow rounded-2xl">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg">
                {c.status === "Resolved" ? (
                  <CheckCircle size={18} className="text-green-600" />
                ) : (
                  <AlertTriangle size={18} className="text-red-600" />
                )}
                {c.title}
              </CardTitle>
              <Badge
                variant={c.status === "Resolved" ? "secondary" : "destructive"}
                className="text-xs"
              >
                {c.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">{c.desc}</p>
              <p className="text-xs text-gray-500 mt-2">Raised on {c.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
