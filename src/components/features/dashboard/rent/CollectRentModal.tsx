"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"; // your custom form
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IRent } from "@/types";
import api from "@/services/api";
import { useCurrentPg } from "@/context/CurrentPgContext";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export class CollectRentDTO {
  amount?: number;
  discount: number = 0;
  notes?: string;
  noOfMonths?: number = 1;
}

export default function CollectRentModal({rent}:{rent:Partial<IRent>}) {
  const [formData, setFormData] = useState<CollectRentDTO>({
    discount:0,
    noOfMonths:rent.monthsDue||0
  });
  const {details:currentPg} = useCurrentPg()
  const queryClient = useQueryClient()
  const[isSubmitting,setIsSubmitting] = useState(false)
  const [open,setIsOpen] = useState(false);
  const handleChange = (field: keyof CollectRentDTO, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async() => {
    
    try{
      setIsSubmitting(true);
      const res = await api.put(`/pg/admin/rent/${rent.id}`,formData,{
        params:{
          pg_id:currentPg.id
        }
      });
      if(res.data.success)
      {
        toast.success("Rent Collected Successfully");
        await queryClient.invalidateQueries({
          queryKey:["pg-dashboard-rents"]
        })
        setIsOpen(false);
      }
    }
    catch(error)
    {

    }
    finally{
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Collect Rent</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Collect Rent</DialogTitle>
        </DialogHeader>

     
          

          {/* No of Months */}
          <div className="space-y-2">
            <label className="text-sm font-medium">No of Months</label>
            <Input
              type="number"
              min={1}
              max={rent.monthsDue}
              value={formData.noOfMonths ?? ""}
              onChange={(e) => handleChange("noOfMonths", Number(e.target.value))}
              placeholder="Number of months"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={formData.notes ?? ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Enter notes (optional)"
            />
          </div>
    

        <DialogFooter>
         
          <Button disabled={isSubmitting} type="button" onClick={()=>{!isSubmitting && handleSubmit()}}>
            Collect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
