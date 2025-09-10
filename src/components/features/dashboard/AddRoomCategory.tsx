"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePg } from "@/context/PgContext";
import api from "@/services/api";
import { toast } from "sonner";

const AddRoomCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    noOfBeds: "",
    baseRent: 0,
  });
const {currentPg} = usePg()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [isSubmitting,setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
try{
setIsSubmitting(true)

    const res = await api.post(`/pg/admin/room/room-categ/add`,formData,{params:{
        pg_id:currentPg?.id
    }})
    toast.success("Category added")
        setFormData({
      name: "",
      description: "",
      noOfBeds: "",
      baseRent: 0,
    });
}
catch(error)
{

}
finally{
setIsSubmitting(false)
}
    // reset form (optional)

  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Room Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Room Category</DialogTitle>
        </DialogHeader>

        {/* Wrap fields in a form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </div>

          <div className="space-y-2">
            <Label>No of noOfBeds</Label>
            <Input
              type="number"
              name="noOfBeds"
              value={formData.noOfBeds}
              onChange={handleChange}
              placeholder="Enter Number of noOfBeds"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Base Rent</Label>
            <Input
              type="number"
              name="baseRent"
              value={formData.baseRent}
              onChange={handleChange}
              placeholder="Rent"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomCategory;
