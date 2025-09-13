"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CustomForm from "@/components/utils/form_builder/form";
import {
  FormField,
  FormFieldTypeEnum,
} from "@/components/utils/form_builder/types";
import { usePgDetails } from "@/context/PgDetailsContext";

export default function PgOwnerInfoForm() {
  const { details, setDetails } = usePgDetails();

  if (!details) return null;

  const ownerInfoFields: FormField[] = [
    {
      fieldType: FormFieldTypeEnum.TEXT,
      default: details?.owner?.ownerName ?? "",
      label: "Owner Name",
      fieldId: "ownerName",
      onChange(value) {
        setDetails("owner", value, false,"ownerName");
      },
    },
    {
      fieldType: FormFieldTypeEnum.TEXT,
      default: details?.owner?.contactNumber ?? "",
      label: "Contact Number",
      fieldId: "contactNumber",
      onChange(value) {
        setDetails("owner", value, false,"contactNumber");
      },
    },
    {
      fieldType: FormFieldTypeEnum.TEXT,
      default: details?.owner?.email ?? "",
      label: "Email",
      fieldId: "email",
      onChange(value) {
        setDetails("owner", value, false,"email");
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Owner Info</CardTitle>
      </CardHeader>
      <CardContent>
        <CustomForm
          fields={ownerInfoFields}
          styling={{
            cols: { md: 2, lg: 2, sm: 1 },
            gapBetweenFields: 4,
          }}
        />
      </CardContent>
    </Card>
  );
}
