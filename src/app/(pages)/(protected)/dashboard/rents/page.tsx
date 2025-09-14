"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { PaginatedView } from "@/components/common/PaginatedView";
import { useCurrentPg } from "@/context/CurrentPgContext";
import { useApiGet } from "@/hooks/api_hooks";
import { IRent, Page } from "@/types";
import PageLoader from "@/components/common/Loader";
import { format } from "date-fns";
import CollectRentModal from "@/components/features/dashboard/rent/CollectRentModal";

// Dummy Data for demo
const rentData = [
  { id: "r1", tenant: "Rahul Sharma", room: "101", amount: 8000, monthsDue: 1, dueDate: "2025-09-10", status: "pending" },
  { id: "r2", tenant: "Priya Singh", room: "102", amount: 12000, monthsDue: 2, dueDate: "2025-09-12", status: "paid" },
  { id: "r3", tenant: "Aman Gupta", room: "103", amount: 6000, monthsDue: 1, dueDate: "2025-09-15", status: "pending" },
];

// Example revenue trend
const revenueTrend = [
  { month: "Jun", collected: 200000, pending: 40000 },
  { month: "Jul", collected: 220000, pending: 30000 },
  { month: "Aug", collected: 180000, pending: 60000 },
];

export default function PgRentPage() {
    const {details:currentPg} = useCurrentPg()
const [filters,setFilters] = useState({
    "rent_status":"pending",
    "tenant.name~":""
})
const [page,setPage] = useState(1);
    const {data:rentPage,isFetching} = useApiGet<Page<IRent>>(`/pg/admin/rent`,{params:{
        pg_id:currentPg.id,...filters,page
    }},{queryKey:["pg-dashboard-rents",{...filters}]})
 
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
     

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Search tenant"
          
          onChange={(e) => setFilters(prev=>({...prev,"tenant.name~":e.target.value}))}
          className="max-w-sm"
        />
        <Select value={filters.rent_status} onValueChange={(v)=>setFilters(prev=>({...prev,rent_status:v}))}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Button>Add Rent</Button>
      </div>

      {/* Rent Table */}
       {
         isFetching?<PageLoader/>:(rentPage &&  <PaginatedView page={rentPage} onPageChange={setPage}>
              <Card>
        <CardHeader><CardTitle>Rent Records</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
               
                <TableHead>Amount</TableHead>
                <TableHead>Months Due</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentPage.data.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.tenant?.name}</TableCell>
                  
                  <TableCell>₹{r.amount}</TableCell>
                  <TableCell>{r.monthsDue}</TableCell>
                  <TableCell>{format(r.dueDate,"PPP")}</TableCell>
                  <TableCell>{r.rentStatus}</TableCell>
                  <TableCell>
                    {r.rentStatus === "pending" && <CollectRentModal/>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
        </PaginatedView>)
       }

     
   
    </div>
  );
}
