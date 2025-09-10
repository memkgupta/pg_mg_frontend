"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useApiGet, useApiPost } from "@/hooks/api_hooks";
import { APIResponse, ComplaintStatus, IComplaint } from "@/types";
import PageLoader from "@/components/common/Loader";
import { format } from "date-fns";
import api from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CustomForm from "@/components/utils/form_builder/form";
import { FormField, FormFieldTypeEnum } from "@/components/utils/form_builder/types";
import { z } from "zod";
import {useDebounce} from "@uidotdev/usehooks"
// const complaints = [
//   {
//     id: 1,
//     title: "WiFi not working",
//     desc: "Internet is down since last night in Room 203.",
//     date: "20 Aug 2025",
//     status: "Resolved",
//   },
//   {
//     id: 2,
//     title: "Water Supply Issue",
//     desc: "No water in bathroom from morning.",
//     date: "28 Aug 2025",
//     status: "Pending",
//   },
// ];

export default function ComplaintPage() {
  const [newComplaint, setNewComplaint] = useState({ title: "", desc: "" });
  const [open,setIsOpen] = useState(false);
  const mutation = useApiPost<IComplaint,{title:string,description:string}>(`/tenant/complaint`,{},{queryKey:["dashboard-complaints"],onSuccess:(data)=>{
      
      toast.success(`Your complaint has been registered`);
        setNewComplaint({ title: "", desc: "" });
        setIsOpen(false)
    }})
    const getParams = (filters:{title:string,status?:ComplaintStatus})=>{
      const params:any = {}
      if(filters.title!="")
      {
        params["title~"] = filters.title
      }
      if(filters.status)
      {
        params["status"] = filters.status
      }
      return params
    }
  const handleSubmit = async() => {
    console.log("New Complaint Submitted:", newComplaint);

   try{

    await mutation.mutateAsync({title:newComplaint.title,description:newComplaint.desc})
    
    
  
   }
   catch(error)
   {
    
   }
  };
  const [filters,setFilters] = useState<{title:string,status:ComplaintStatus|undefined}>({title:"",status:undefined})

  const debounced = useDebounce(filters,500)
  const filterFormFields:FormField[] = [
    {
      fieldId:"title",
      fieldType:FormFieldTypeEnum.TEXT,
      label:"Title",
      onChange(value, state) {
        setFilters({...filters,title:value})
      },
      default:""
    },
    {
      fieldId:"status",
      fieldType:FormFieldTypeEnum.SELECT,
       options:[
        {key:ComplaintStatus.ACTIVE.toString(),label:ComplaintStatus.ACTIVE,value:ComplaintStatus.ACTIVE.toString()},
         {key:ComplaintStatus.PENDING.toString(),label:ComplaintStatus.PENDING,value:ComplaintStatus.PENDING.toString()},
          {key:ComplaintStatus.RESOLVED.toString(),label:ComplaintStatus.RESOLVED,value:ComplaintStatus.RESOLVED.toString()}
       ],
       default:ComplaintStatus.PENDING,
       label:"Status",
       onChange(value,state) {
        if(value)
        {
          setFilters({...filters,status:value as ComplaintStatus})
        }
        
       }
       
    }
  ]
  
const {data:complaints , isFetching} = useApiGet<IComplaint[]>(`/aggregate/dashboard/complaints`,{params:getParams({...debounced})},{
  queryKey:["dashboard-complaints",debounced]
})
  return (
   <>
  
  {!complaints || isFetching? <PageLoader/> :  (
    <>
 <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="text-red-600" size={24} /> Complaints
        </h1>
        {/* Raise Complaint Button + Modal */}
        <Dialog open={open} onOpenChange={setIsOpen}>
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
        <div>
          {/* Filter Box */}
          <CustomForm fields={filterFormFields} onSubmit={(data)=>{console.log(data)}}  schema={z.object({
            title:z.string(),
            status:z.enum([ComplaintStatus.ACTIVE,ComplaintStatus.PENDING,ComplaintStatus.RESOLVED]).optional()
          })}/>
        </div>
       <>
       {
        <>
        {!complaints || isFetching ? <PageLoader/> :  <>
        {complaints.map((c) => (
          <Card key={c.id} className="shadow rounded-2xl">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg">
                {c.status === ComplaintStatus.RESOLVED ? (
                  <CheckCircle size={18} className="text-green-600" />
                ) : (
                  <AlertTriangle size={18} className="text-red-600" />
                )}
                {c.title}
              </CardTitle>
              <Badge
                variant={c.status === ComplaintStatus.RESOLVED ? "secondary" : "destructive"}
                className="text-xs"
              >
                {c.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">{c.description}</p>
              <p className="text-xs text-gray-500 mt-2">Raised on {format(c.createdAt,"PPP")}</p>
            </CardContent>
          </Card>
        ))}
        </>}
        </>
       }
       </>
      </div>
    </div>
    </>
  )}
 
   </>
  );
}
