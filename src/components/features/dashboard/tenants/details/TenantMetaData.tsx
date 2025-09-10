import { Separator } from "@/components/ui/separator";

export default function TenantMetadata({ createdAt, updatedAt }: { createdAt: string; updatedAt: string }) {
  return (
    <>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Created At</p>
          <p className="font-medium">{createdAt}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Updated At</p>
          <p className="font-medium">{updatedAt}</p>
        </div>
      </div>
    </>
  );
}
