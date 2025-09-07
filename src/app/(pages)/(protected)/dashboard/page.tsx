"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const summaryData = {
  totalRooms: 50,
  occupiedRooms: 42,
  pendingComplaints: 7,
  pendingRent: 120000,
  totalTenants: 45,
};

const revenueData = [
  { month: "Jun", collected: 200000, pending: 40000 },
  { month: "Jul", collected: 220000, pending: 30000 },
  { month: "Aug", collected: 180000, pending: 60000 },
  { month: "Sep", collected: 240000, pending: 20000 },
];

const occupancyTrend = [
  { month: "Apr", occupancy: 75 },
  { month: "May", occupancy: 80 },
  { month: "Jun", occupancy: 85 },
  { month: "Jul", occupancy: 82 },
  { month: "Aug", occupancy: 88 },
  { month: "Sep", occupancy: 84 },
];

const recentPayments = [
  { id: 1, tenant: "Rahul Sharma", amount: 8000, status: "paid" },
  { id: 2, tenant: "Priya Singh", amount: 12000, status: "pending" },
  { id: 3, tenant: "Aman Gupta", amount: 6000, status: "paid" },
];

const latestComplaints = [
  { id: 1, tenant: "Rahul Sharma", issue: "Plumbing", status: "pending" },
  { id: 2, tenant: "Priya Singh", issue: "Electricity", status: "in_progress" },
  { id: 3, tenant: "Aman Gupta", issue: "Cleanliness", status: "resolved" },
];

const upcomingDues = [
  { id: 1, tenant: "Vikas Mehta", room: "102", due: "2025-09-10", amount: 6000 },
  { id: 2, tenant: "Sneha Patel", room: "203", due: "2025-09-12", amount: 7000 },
];

export default function HomeOverview() {
  return (
    <div className="p-6 space-y-8">
      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Rooms</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{summaryData.totalRooms}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Occupied Rooms</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summaryData.occupiedRooms}</p>
            <p className="text-sm text-gray-500">
              {Math.round((summaryData.occupiedRooms / summaryData.totalRooms) * 100)}% Occupancy
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Tenants</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{summaryData.totalTenants}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending Complaints</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{summaryData.pendingComplaints}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending Rent</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">₹{summaryData.pendingRent.toLocaleString()}</p></CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button>Add Room</Button>
        <Button>Add Booking</Button>
        <Button>Add Payment</Button>
        <Button>Add Complaint</Button>
        <Button variant="outline">Download Report</Button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Revenue Overview</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="collected" fill="#4ade80" name="Collected" />
                <Bar dataKey="pending" fill="#facc15" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Occupancy Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={occupancyTrend}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Recent Payments</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {recentPayments.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span>{p.tenant}</span>
                  <span>₹{p.amount} — {p.status}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Latest Complaints</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {latestComplaints.map((c) => (
                <li key={c.id} className="flex justify-between">
                  <span>{c.tenant} ({c.issue})</span>
                  <span>{c.status}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Upcoming Dues</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {upcomingDues.map((d) => (
                <li key={d.id} className="flex justify-between">
                  <span>{d.tenant} (Room {d.room})</span>
                  <span>₹{d.amount} — {d.due}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
