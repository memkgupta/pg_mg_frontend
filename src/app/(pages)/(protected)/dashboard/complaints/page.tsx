"use client"
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePg } from "@/context/PgContext";
import { useApiGet } from "@/hooks/api_hooks";
import { ComplaintStatus, IComplaint, Page } from "@/types";
import { PaginatedView } from "@/components/common/PaginatedView";
import PageLoader from "@/components/common/Loader";
import { format } from "date-fns";



export default function ComplaintPage() {

  const [search, setSearch] = useState("");


 

  const updateStatus = (id: number, newStatus: string) => {
  
  };
const {currentPg} = usePg()
const[page,setPage] = useState(1);
const {data:complaintsPage,isFetching} = useApiGet<Page<IComplaint>>(`/aggregate/pg/dashboard/complaints`,{
  params:{
    pg_id:currentPg?.id
  }
},{
  queryKey:["pg-dashboard-complaints",currentPg?.id]
})
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
   {
   !complaintsPage|| isFetching ?<PageLoader/>:( <PaginatedView page={complaintsPage} onPageChange={setPage} >
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
          {complaintsPage.data.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.tenant?.name}</TableCell>
              {/* <TableCell>{c.room}</TableCell> */}
              <TableCell>{c.title}</TableCell>
              <TableCell>
                <Badge
                  className={
                    c.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : c.status === ComplaintStatus.ACTIVE
                      ? "bg-blue-200 text-blue-800"
                      : "bg-green-200 text-green-800"
                  }
                >
                  {c.status}
                </Badge>
              </TableCell>
              <TableCell>{format(c.createdAt,"PPP")}</TableCell>
              <TableCell>
                {/* <Dialog onOpenChange={(open) => !open && setSelectedComplaint(null)}>
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
                </Dialog> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PaginatedView>)
   }
      
    </div>
  );
}
