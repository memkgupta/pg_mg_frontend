"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, CalendarDays } from "lucide-react";
import { useApiGet } from "@/hooks/api_hooks";
import { IBooking, Page } from "@/types";
import { PaginatedView } from "@/components/common/PaginatedView";
import PageLoader from "@/components/common/Loader";
import { useState } from "react";
import { format } from "date-fns";



export default function BookingPage() {
const [page,setPage] = useState(0);
  const {data:bookingPage,isFetching} = useApiGet<Page<IBooking>>(`/aggregate/dashboard/bookings`,{},{
    queryKey:["account-bookings"]
  })
  return (
<>
{!bookingPage || isFetching ? (<PageLoader/>):(  <PaginatedView onPageChange={(p)=>{setPage(p)}} page={bookingPage} >
      <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarDays size={24} className="text-blue-600" /> My Bookings
      </h1>
      <p className="text-gray-500 text-sm">View your active and past bookings</p>

      {/* Booking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookingPage.data.map((b) => (
          <Card
            key={b.id}
            className={`rounded-2xl shadow-lg transition ${
              b.bookingStatus === "Active"
                ? "bg-white hover:shadow-xl"
                : "bg-gray-100 grayscale opacity-80"
            }`}
          >
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Bed size={20} className="text-blue-600" />
                {b.pg?.name}
              </CardTitle>
              <Badge
                variant={
                  b.bookingStatus === "Active"
                    ? "secondary"
                    : b.bookingStatus === "Expired"
                    ? "outline"
                    : "destructive"
                }
              >
                {b.bookingStatus}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700 text-sm">
             <p>{format(b.createdAt,"PPP")}</p>
              
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </PaginatedView>)}
</>
  );
}
