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

export class CollectRentDTO {
  amount?: number;
  discount: number = 0;
  notes?: string;
  noOfMonths?: number = 1;
}

export default function CollectRentModal() {
  const [formData, setFormData] = useState<CollectRentDTO>(new CollectRentDTO());

  const handleChange = (field: keyof CollectRentDTO, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Collect Rent Payload:", formData);
    // 🔥 here you can call your API
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Collect Rent</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Collect Rent</DialogTitle>
        </DialogHeader>

     
          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              value={formData.amount ?? ""}
              onChange={(e) => handleChange("amount", Number(e.target.value))}
              placeholder="Enter rent amount"
            />
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Discount</label>
            <Input
              type="number"
              value={formData.discount}
              onChange={(e) => handleChange("discount", Number(e.target.value))}
              placeholder="Enter discount"
            />
          </div>

          {/* No of Months */}
          <div className="space-y-2">
            <label className="text-sm font-medium">No of Months</label>
            <Input
              type="number"
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
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Collect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
