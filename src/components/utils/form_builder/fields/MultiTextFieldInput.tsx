import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useFormContext } from "../FormContext";
import { BaseField } from "../types";
import { Badge } from "@/components/ui/badge";
function MultiTextFieldInput({ field }: { field: BaseField<string[]> }) {
  const { fields: states } = useFormContext();
  const state = states.find((s) => s.fieldId === field.fieldId);

  if (!state) return null;

  const [values, setValues] = state.state as [
    string[],
    React.Dispatch<React.SetStateAction<string[]>>
  ];

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const splitValues = val
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setValues(splitValues);

    if (field.onChange) {
      field.onChange(splitValues, state.state as any);
    }
  };


  return (
    <div className="space-y-3">
      <Label htmlFor={field.fieldId}>{field.label}</Label>
      <Input
        id={field.fieldId}
        type="text"
        placeholder={field.placeholder ?? "Enter values, separated by commas"}
        value={values.join(", ")}
        onChange={handleChange}
      />
       {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {values.map((val, idx) => (
            <Badge key={idx} variant="secondary" className="px-2 py-1">
              {val}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiTextFieldInput;