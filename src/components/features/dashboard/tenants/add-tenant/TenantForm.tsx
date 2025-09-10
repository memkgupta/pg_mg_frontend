"use client";
import { UseFormReturn } from "react-hook-form";
import { TenantFormType } from "./AddTenant";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TenantForm({
  form,
  onSubmit,
  isSubmitting,
  onCancel,
}: {
  form: UseFormReturn<TenantFormType>;
  onSubmit: (data: TenantFormType) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
