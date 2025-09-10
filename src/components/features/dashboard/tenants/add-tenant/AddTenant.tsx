

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useApiGet } from "@/hooks/api_hooks";
import { APIResponse, IRoom, ITenant } from "@/types";
import { useCurrentPg } from "@/context/CurrentPgContext";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CategoryFilter from "./CategoryFilter";
import RoomLayout from "./RoomLayout";
import TenantForm from "./TenantForm";

// ✅ Zod schema
const tenantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(10).max(15),
  email: z.string().email("Invalid email"),
  roomId: z.string().min(1, "Room is required"),
});

export type TenantFormType = z.infer<typeof tenantSchema>;

export default function AddTenant() {
  const { details, categories } = useCurrentPg();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(
    categories[0]?.id
  );
  const [selectedRoom, setSelectedRoom] = React.useState<string>("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch rooms
  const { data: rooms } = useApiGet<Record<number, IRoom[]>>(
    `/aggregate/pg/dashboard/room`,
    { params: { pg_id: details.id } },
    { queryKey: ["pg-dashboard-room", details.id] }
  );

  // Categorise rooms
  const categorisedRooms = React.useMemo(() => {
    const map = new Map<string, IRoom[]>();
    if (rooms) {
      Object.values(rooms).flat().forEach((room) => {
        const categ = room.category?.id;
        if (!categ) return;
        if (!map.has(categ)) map.set(categ, []);
        map.get(categ)!.push(room);
      });
    }
    return map;
  }, [rooms]);

  // React Hook Form
  const form = useForm<TenantFormType>({
    resolver: zodResolver(tenantSchema),
    defaultValues: { name: "", phoneNumber: "", email: "", roomId: "" },
  });

  React.useEffect(() => {
    if (selectedRoom) {
      form.setValue("roomId", selectedRoom);
    }
  }, [selectedRoom]);

  const onSubmit = async (data: TenantFormType) => {
    try {
      setIsSubmitting(true);
      const res = await api.post<APIResponse<ITenant>>(
        `/pg/admin/tenant/create-new-tenant`,
        data,
        { params: { pg_id: details.id } }
      );

      if (res.data.success) {
        toast.success("Tenant Added successfully");
        if (res.data.data?.id) {
          form.reset();
          setOpen(false);
          router.push(`/dashboard/tenants/${res.data.data.id}`);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Tenant</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Tenant</DialogTitle>
        </DialogHeader>

        {/* Top Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Bottom split layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RoomLayout
            rooms={categorisedRooms.get(selectedCategory!)}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
          />

          <Form {...form}>
            <TenantForm
              form={form}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              onCancel={() => setOpen(false)}
            />
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
