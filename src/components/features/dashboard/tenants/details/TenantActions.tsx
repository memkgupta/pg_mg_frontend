"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TenantActions() {
  const router = useRouter();

  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button variant="outline" onClick={() => router.back()}>
        Back
      </Button>
      <Button>Edit Tenant</Button>
    </div>
  );
}
