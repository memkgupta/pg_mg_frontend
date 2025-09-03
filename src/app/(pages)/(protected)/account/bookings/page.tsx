"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, CalendarDays } from "lucide-react";

const bookings = [
  {
    id: 1,
    pgName: "Sunrise PG",
    room: "203",
    type: "Double Sharing",
    startDate: "01 Aug 2025",
    endDate: "31 Dec 2025",
    status: "Active",
  },
  {
    id: 2,
    pgName: "Green Villa PG",
    room: "105",
    type: "Single Room",
    startDate: "01 Jan 2025",
    endDate: "31 Jul 2025",
    status: "Expired",
  },
  {
    id: 3,
    pgName: "Skyline PG",
    room: "502",
    type: "Triple Sharing",
    startDate: "01 Feb 2024",
    endDate: "30 Apr 2024",
    status: "Cancelled",
  },
];

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarDays size={24} className="text-blue-600" /> My Bookings
      </h1>
      <p className="text-gray-500 text-sm">View your active and past bookings</p>

      {/* Booking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((b) => (
          <Card
            key={b.id}
            className={`rounded-2xl shadow-lg transition ${
              b.status === "Active"
                ? "bg-white hover:shadow-xl"
                : "bg-gray-100 grayscale opacity-80"
            }`}
          >
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Bed size={20} className="text-blue-600" />
                {b.pgName}
              </CardTitle>
              <Badge
                variant={
                  b.status === "Active"
                    ? "secondary"
                    : b.status === "Expired"
                    ? "outline"
                    : "destructive"
                }
              >
                {b.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700 text-sm">
              <p><strong>Room No:</strong> {b.room}</p>
              <p><strong>Type:</strong> {b.type}</p>
              <p>
                <strong>Duration:</strong> {b.startDate} → {b.endDate}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
