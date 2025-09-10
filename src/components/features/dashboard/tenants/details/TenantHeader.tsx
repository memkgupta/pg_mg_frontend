import { CardTitle } from "@/components/ui/card";

export default function TenantHeader({ name, email }: { name: string; email: string }) {
  return (
    <>
      <CardTitle className="text-2xl font-bold">{name}</CardTitle>
      <p className="text-sm text-gray-500">{email}</p>
    </>
  );
}
