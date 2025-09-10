"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useApiGet } from "@/hooks/api_hooks";
import { APIResponse, IRoom, ITenant } from "@/types";
import { useCurrentPg } from "@/context/CurrentPgContext";
import { FormField as CustomFormField, FormFieldTypeEnum } from "@/components/utils/form_builder/types";
import CustomForm from "@/components/utils/form_builder/form";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ✅ Zod schema
const tenantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15),
  email: z.string().email("Invalid email"),
  roomId: z.string().min(1, "Room is required"),
});

type TenantForm = z.infer<typeof tenantSchema>;

// Mock room data
const rooms = [
  { id: "101", type: "Single", available: true },
  { id: "102", type: "Double", available: false },
  { id: "103", type: "Single", available: true },
  { id: "104", type: "Suite", available: true },
  { id: "105", type: "Double", available: false },
];
const categoryFilterSchema = z.object({
    category:z.string()
})

export default function CreateTenantModal() {
    const {details,categories} = useCurrentPg()
    const router = useRouter()
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const[selectedCategory,setSelectedCategory] = React.useState<string|undefined>(categories[0].id);
  const [selectedRoom, setSelectedRoom] = React.useState<string>("");
   const roomFilterFields:CustomFormField[] = [
    {
      fieldId: "city",
      fieldType: FormFieldTypeEnum.SELECT,
      label: "City",
      options: 
        categories.map(c=>({value:c.id!,label:c.name!,key:c.id!}))
      ,
      default: categories[0]?.id || "",
      onChange:(id)=>{
        setSelectedCategory(id)
      }
    },
]
const [isSubmitting,setIsSubmitting] = React.useState(false); 
const {data:rooms} = useApiGet<Record<number, IRoom[]>>(`/aggregate/pg/dashboard/room`, { params: { pg_id: details.id } },
    { queryKey: ["pg-dashboard-room", details.id] })
  
    const categorisedRooms = new Map<string,IRoom[]>();
    if(rooms)
    {
        Object.entries(rooms).forEach(floor=>{
            floor[1].forEach(room=>{
                const categ = room.category!.id
                if(categ)
                {
                   if(categorisedRooms.has(categ))
                   {
                    categorisedRooms.get(categ)?.push(room);
                   }
                   else{
                    categorisedRooms.set(categ,[room])
                   }
                }
            })
        })
    }
    const form = useForm<TenantForm>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      roomId: "",
    },
  });

  // Handle submit
  const onSubmit = async(data: TenantForm) => {
    
    try{
        setIsSubmitting(true);
        const res = await api.post<APIResponse<ITenant>>(`/pg/admin/tenant/create-new-tenant`,data,{
            params:{
                pg_id:details.id
            }
        });
        if(res.data.success)
        {
            toast.success("Tenant Added succesfully");
            if(res.data.data?.id)
            {
                form.reset()
                setOpen(false);
                router.push(`/dashboard/tenants/${res.data.data?.id}`)
            }
            
        }
    }
    catch(error)
    {
        
    }
    finally{
        setIsSubmitting(false)
    }
    form.reset();
    
  };

  // Filter rooms

  // Auto-update form when room selected
  React.useEffect(() => {
    if (selectedRoom) {
      form.setValue("roomId", selectedRoom);
    }
  }, [selectedRoom]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Tenant</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Tenant</DialogTitle>
        </DialogHeader>

        {/*  Category Filter */}
        <div className="mb-4">
            <CustomForm
                fields={roomFilterFields}
                schema={categoryFilterSchema}
                
            />
        </div>

        {/* 🔹 Bottom Section: 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Section: Room layout */}
          <div className="grid grid-cols-3 gap-2"> 
  {selectedCategory &&
    categorisedRooms.get(selectedCategory)?.map((room) => (
      <Card
        key={room.id}
        className={`cursor-pointer border transition text-center ${
          selectedRoom === room.id ? "border-blue-500" : "border-gray-200"
        } ${room.noOfFreeBeds === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() =>
          room.noOfFreeBeds > 0 && setSelectedRoom(room.id)
        }
      >
        <CardContent className="p-2 flex flex-col items-center">
          <span className="text-sm font-semibold">{room.roomNumber}</span>
          <span className="text-xs text-gray-500">
            {room.category?.name}
          </span>
          <span
            className={`text-[10px] mt-1 ${
              room.noOfFreeBeds > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {room.noOfFreeBeds > 0 ? "Available" : "Occupied"}
          </span>
        </CardContent>
      </Card>
    ))}
</div>


          {/* Right Section: Tenant Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Tenant name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Auto-filled from room selection */}
              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
