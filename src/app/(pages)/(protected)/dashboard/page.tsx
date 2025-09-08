"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { usePg } from "@/context/PgContext";
import PageLoader from "@/components/common/Loader";
import { useApiGet } from "@/hooks/api_hooks";
import { PgDashboardResponse } from "@/types";

export default function HomeOverview() {
  const { currentPg, isLoading } = usePg();

  const { data, isLoading: dashboardLoading } = useApiGet<PgDashboardResponse>(
    `/aggregate/pg/dashboard`,
    { params: { pg_id: currentPg?.id } },
    { queryKey: ["pg-dashboard", currentPg?.id], enabled: !!currentPg?.id }
  );

  if (isLoading || dashboardLoading) return <PageLoader />;

  const rooms:any = data?.rooms ?? {};
  const tenants = data?.tenants ?? 0;
  const collection = data?.collection ?? 0;
  const pendingBookings = data?.pending_bookings ?? 0;
  const occupancyTrend = data?.occupancy_trend ?? [];

  return (
    <div className="p-6 space-y-8">
      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{rooms.total_rooms}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupied Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{rooms.occupied_beds}</p>
            <p className="text-sm text-gray-500">
              {Number(rooms.occupancy_percent).toFixed(1)}% Occupancy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{tenants}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingBookings}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₹{Number(collection).toLocaleString()}
            </p>
          </CardContent>
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
        {/* You didn’t share revenue trend API structure, keeping placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[]}>
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
          <CardHeader>
            <CardTitle>Occupancy Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={occupancyTrend.map((d: any) => ({
                  month: new Date(d.month).toLocaleDateString("en-US", {
                    month: "short",
                    year: "2-digit",
                  }),
                  occupancy: Number(d.occupancy_rate),
                }))}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="occupancy"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
