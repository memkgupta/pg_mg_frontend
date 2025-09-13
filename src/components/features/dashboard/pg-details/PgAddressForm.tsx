"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CustomForm from "@/components/utils/form_builder/form";
import {
  FormField,
  FormFieldTypeEnum,
} from "@/components/utils/form_builder/types";
import { usePgDetails } from "@/context/PgDetailsContext";

export default function PgAddressForm() {
  const { details, setDetails } = usePgDetails();

  if (!details) return null; // guard against undefined context

  const addressDetailsFields: FormField[] = [
  
    {
      fieldType: FormFieldTypeEnum.TEXT,
      default: details?.address?.city ?? "",
      label: "City",
      fieldId: "city",
      onChange(value) {
        setDetails("address", value, false,"city");
      },
    },
    {
      fieldType: FormFieldTypeEnum.TEXT,
      default: details?.address?.state ?? "",
      label: "State",
      fieldId: "state",
      onChange(value) {
        setDetails("address", value, false,"state");
      },
    },
    {
      fieldType: FormFieldTypeEnum.TEXT,
      default: details?.address?.pincode ?? "",
      label: "Pincode",
      fieldId: "pincode",
      onChange(value) {
        setDetails("address", value, false,"pincode");
      },
    },
      {
      fieldType: FormFieldTypeEnum.TEXT_AREA,
      default: details?.address?.address ?? "",
      label: "Address",
      fieldId: "address",
      onChange(value) {
        setDetails("address", value, false,"address");
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Info</CardTitle>
      </CardHeader>
      <CardContent>
        <CustomForm
          fields={addressDetailsFields}
          styling={{
            cols: { md: 3, lg: 3, sm: 1 },
            gapBetweenFields: 4,
          }}
        />
      </CardContent>
    </Card>
  );
}
