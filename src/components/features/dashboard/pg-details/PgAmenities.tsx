"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CustomForm from "@/components/utils/form_builder/form";
import {
  FormField,
  FormFieldTypeEnum,
} from "@/components/utils/form_builder/types";
import { usePgDetails } from "@/context/PgDetailsContext";

export default function PgAmenitiesForm() {
  const { details, setDetails } = usePgDetails();

  if (!details) return null;

  const amenitiesFields: FormField[] = [
    {
      fieldType: FormFieldTypeEnum.MULTI_TEXT, // <-- use your custom MultiTextFieldInput
      default: details.amenities ?? [],
      label: "Amenities (comma separated)",
      fieldId: "amenities",
      onChange(value) {
        setDetails("amenities", value,true);
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <CustomForm
          fields={amenitiesFields}
          styling={{
            cols: { md: 1, lg: 1, sm: 1 },
            gapBetweenFields: 4,
          }}
        />
      </CardContent>
    </Card>
  );
}
