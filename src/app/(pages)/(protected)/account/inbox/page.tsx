"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Mail, CheckCircle, AlertTriangle, CalendarDays } from "lucide-react";

const messages = [
  {
    id: 1,
    title: "Rent Payment Successful",
    preview: "Your rent of ₹8000 has been received for Aug 2025.",
    time: "01 Aug 2025, 10:30 AM",
    type: "payment",
    read: true,
  },
  {
    id: 2,
    title: "Upcoming Rent Due",
    preview: "Your rent of ₹8000 is due on 01 Sep 2025. Please pay on time.",
    time: "28 Aug 2025, 5:00 PM",
    type: "reminder",
    read: false,
  },
  {
    id: 3,
    title: "Complaint Resolved",
    preview: "Your complaint about WiFi has been marked as resolved.",
    time: "20 Aug 2025, 6:15 PM",
    type: "complaint",
    read: true,
  },
  {
    id: 4,
    title: "Notice: Maintenance",
    preview: "Maintenance scheduled on 05 Sep 2025 (10 AM - 1 PM).",
    time: "18 Aug 2025, 3:45 PM",
    type: "notice",
    read: false,
  },
];

export default function InboxPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Mail size={24} className="text-blue-600" /> Inbox
      </h1>
      <p className="text-gray-500 text-sm">All your messages & notifications</p>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={`shadow rounded-2xl transition ${
              msg.read ? "bg-white" : "bg-blue-50 border border-blue-200"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                {msg.type === "payment" && (
                  <CheckCircle size={20} className="text-green-600" />
                )}
                {msg.type === "reminder" && (
                  <CalendarDays size={20} className="text-blue-600" />
                )}
                {msg.type === "complaint" && (
                  <AlertTriangle size={20} className="text-orange-500" />
                )}
                {msg.type === "notice" && (
                  <Bell size={20} className="text-red-600" />
                )}
                {msg.title}
              </CardTitle>
              <span className="text-xs text-gray-500">{msg.time}</span>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">{msg.preview}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
