export default function TenantInfoGrid({ phone, discount }: { phone: string; discount: number }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Phone</p>
        <p className="font-medium">{phone}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Discount</p>
        <p className="font-medium">{discount}%</p>
      </div>
    </div>
  );
}
