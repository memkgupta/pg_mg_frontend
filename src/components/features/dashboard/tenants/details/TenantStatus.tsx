import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function TenantStatus({ isActive }: { isActive: boolean }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="font-medium">Status:</span>
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </div>
      <Separator />
    </>
  );
}
