"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/services/api";
import { ITenant } from "@/types";
import { usePg } from "@/context/PgContext";
import { useCurrentPg } from "@/context/CurrentPgContext";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiPost } from "@/hooks/api_hooks";

// ✅ Zod Schema (validation)
const tenantVerificationSchema = z.object({
  adhaar: z.string(),
  photo: z.string().min(1, "Photo is required"),
  verification: z.string(),
});

type TenantVerificationForm = z.infer<typeof tenantVerificationSchema>;

export default function TenantVerificationModal({tenant}:{tenant:ITenant}) {
  const [open, setOpen] = React.useState(false);
 const[isSubmitting,setIsSubmitting] = React.useState(false);
 const queryClient= useQueryClient()
 const {details} = useCurrentPg()
  const form = useForm<TenantVerificationForm>({
    resolver: zodResolver(tenantVerificationSchema),
    defaultValues: {
      adhaar: "",
      photo: "",
      verification: "",
    },
  });
  const verificationMutation =  useApiPost<ITenant,TenantVerificationForm>(`/pg/admin/tenant/verification/${tenant.id}`,{
    params:{
        pg_id:details.id
    }
  },{
   
    onSuccess:(data)=>{
       queryClient.invalidateQueries({queryKey:["tenant-details",tenant.id]});
        form.reset()
       setOpen(false);
        setIsSubmitting(false);
    },
    onError:()=>{
        setIsSubmitting(false);
    }
  })
  
  const onSubmit = async (data: TenantVerificationForm) => {
    
    verificationMutation.mutate(data)
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Verify Tenant</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tenant Verification</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Aadhaar */}
            <FormField
              control={form.control}
              name="adhaar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhaar</FormLabel>
                  <FormControl>
                    <Input placeholder="Aadhaar Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Photo */}
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="Photo URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Verification */}
            <FormField
              control={form.control}
              name="verification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Doc</FormLabel>
                  <FormControl>
                    <Input placeholder="Verification Document URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
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
      </DialogContent>
    </Dialog>
  );
}
