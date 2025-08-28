import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // shadcn Input
import { PhoneField } from "../types";
import { useFormContext } from "../FormContext";

function PhoneFieldInput({ field }: { field: PhoneField }) {
  const { fields: states } = useFormContext();
  const state = states.find((s) => s.fieldId === field.fieldId);

  if (!state) {
    return null;
  }

  const [value, setValue] = state.state as [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ];

  return (
    <div className="space-y-3">
      <Label htmlFor={field.fieldId}>{field.label}</Label>
      <Input
        id={field.fieldId}
        type="tel" 
        value={value}
        placeholder={field.placeholder ?? "Enter phone number"}
        onChange={(e) => {
          const val = e.target.value;
          setValue(val);
          if (field.onChange) {
            field.onChange(val, state.state as any);
          }
        }}
      />
    </div>
  );
}

export default PhoneFieldInput;
