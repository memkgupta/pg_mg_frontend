import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api";
import { usePg } from "@/context/PgContext";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const AddRoom = () => {
  const [formData, setFormData] = useState({
    categoryId: "",
    noOfFreeBeds: "",
    totalRooms: "",
    floor_no: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const {currentPg} = usePg()
  const categories = currentPg?.roomCategories
  const [isSubmitting,setIsSubmitting] = useState(false);
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    // Convert numeric values before sending
    const payload = {
      categoryId: formData.categoryId,
      noOfFreeBeds: Number(formData.noOfFreeBeds),
      totalRooms: Number(formData.totalRooms),
      floor_no: formData.floor_no ? Number(formData.floor_no) : undefined,
    };

    console.log("Submitting:", payload);

  try{
setIsSubmitting(true)
const res = await api.post(`/pg/admin/room`,payload,{params:{
    pg_id:currentPg?.id
}})
toast.success("Room added")
  }
  catch(error)
  {

  }
  finally{
    setIsSubmitting(false)
  }

    // Reset form
    setFormData({
      categoryId: "",
      noOfFreeBeds: "",
      totalRooms: "",
      floor_no: "",
    });
  };
const [open,setOpen]=useState(false)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
     <div className="grid gap-2">
            <Label>Category</Label>
           {categories && <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {formData.categoryId
                    ? categories.find((c) => c.id === formData.categoryId)?.name
                    : "Select category"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput className="w-full" placeholder="Search category..." />
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name}
                        onSelect={() => {
                          setFormData((prev) => ({
                            ...prev,
                            categoryId: category.id,
                          }));
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.categoryId === category.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {category.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>}
          </div>


          <div className="grid gap-2">
            <Label>No of Free Beds</Label>
            <Input
              type="number"
              name="noOfFreeBeds"
              value={formData.noOfFreeBeds}
              onChange={handleChange}
              placeholder="Enter number of free beds"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Total Rooms</Label>
            <Input
              type="number"
              name="totalRooms"
              value={formData.totalRooms}
              onChange={handleChange}
              placeholder="Enter total rooms"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Floor No (optional)</Label>
            <Input
              type="number"
              name="floor_no"
              value={formData.floor_no}
              onChange={handleChange}
              placeholder="Enter floor number"
            />
          </div>

          <Button disabled={isSubmitting} type="submit" className="w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoom;
