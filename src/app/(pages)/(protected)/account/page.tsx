"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, CalendarCheck, CreditCard, AlertTriangle, CalendarDays, User, Megaphone, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApiGet } from "@/hooks/api_hooks";
import { useAuth } from "@/context/AuthContext";
import { IDashboard } from "@/types";
import PageLoader from "@/components/common/Loader";
import { format } from "date-fns";

export default function AccountHomePage() {
  const auth = useAuth()
 
    const {data:dashboard,isFetching } = useApiGet<IDashboard>(`/aggregate/dashboard`,{},{
    queryKey:["account-home-page"]
  });
  
  // const {data} =
  return (
<>
{
  !dashboard || isFetching?(<PageLoader/>):(
         <div className=" bg-gray-50 p-6 space-y-6 md:mt-0 mt-16">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Current PG Details */}
        <Card className="md:col-span-2 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed size={20} /> Current PG
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <p><strong>PG Name:</strong> {dashboard.pg.name}</p>
            <p><strong>Room No:</strong> {dashboard.pg.room_no}</p>
            <p><strong>Rent:</strong> {dashboard.pg.rent}/ month</p>
            <p><strong>Address:</strong> {dashboard.pg.address}</p>
          </CardContent>
        </Card>

        {/* Notification */}
        <Card className="shadow-lg rounded-2xl border border-yellow-300 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <CalendarDays size={20} /> Upcoming Due
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p><strong>Rent Due:</strong> {dashboard.rent.dueMonths*(dashboard.pg.rent||0)}</p>
            <p><strong>Date:</strong> {format(dashboard.rent.date,"PPP")}</p>
            <p className="text-red-600 font-medium">Status: {dashboard.rent.status}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recent Activities */}
        <Card className="md:col-span-2 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✅ Rent payment of ₹8000 received on 01 Aug 2025</li>
              <li>📌 Complaint about WiFi marked as resolved</li>
              <li>📅 Upcoming rent of ₹8000 due on 01 Sep 2025</li>
            </ul>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 flex flex-col items-center gap-2 shadow hover:shadow-md transition">
            <CreditCard size={28} className="text-green-600" />
            <span className="font-medium">Payments</span>
          </Card>
          <Card className="p-4 flex flex-col items-center gap-2 shadow hover:shadow-md transition">
            <AlertTriangle size={28} className="text-red-500" />
            <span className="font-medium">Complaints</span>
          </Card>
          <Card className="p-4 flex flex-col items-center gap-2 shadow hover:shadow-md transition">
            <CalendarDays size={28} className="text-blue-600" />
            <span className="font-medium">Bookings</span>
          </Card>
          <Card className="p-4 flex flex-col items-center gap-2 shadow hover:shadow-md transition">
            <User size={28} className="text-gray-600" />
            <span className="font-medium">Profile</span>
          </Card>
        </div>
      </div>

      {/* Notice Section */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Megaphone size={20} /> Notices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>🔔 Maintenance scheduled on 05 Sep 2025 (10 AM - 1 PM)</li>
            <li>🍽️ Special dinner this Sunday at 8 PM</li>
            <li>⚡ Electricity outage tomorrow from 2 PM - 4 PM</li>
          </ul>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Phone size={20} /> Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-gray-700 text-sm">
          <p><strong>PG Manager:</strong> +91 98765 43210</p>
          <p><strong>Security Guard:</strong> +91 91234 56789</p>
          <p><strong>Ambulance:</strong> 102</p>
          <p><strong>Fire Brigade:</strong> 101</p>
        </CardContent>
      </Card>
    </div>
  )
}
</>
  );
}
