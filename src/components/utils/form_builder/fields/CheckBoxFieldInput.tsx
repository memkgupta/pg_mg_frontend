import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // shadcn/ui checkbox
import { CheckBoxField } from "../types";
import { useFormContext } from "../FormContext";

function CheckboxFieldInput({ field }: { field: CheckBoxField }) {
  const { fields: states } = useFormContext();
  const state = states.find((s) => s.fieldId === field.fieldId);

  if (!state) return null;

  const [value, setValue] = state.state as [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ];

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={field.fieldId}
        checked={value}
        onCheckedChange={(checked) => {
          const boolVal = checked === true;
          setValue(boolVal);
          if (field.onChange) {
            field.onChange(boolVal, state.state as any);
          }
        }}
      />
      <Label htmlFor={field.fieldId}>{field.label}</Label>
    </div>
  );
}

export default CheckboxFieldInput;
