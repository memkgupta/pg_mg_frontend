import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxGroupField } from "../types";
import { useFormContext } from "../FormContext";

function CheckboxGroupFieldInput({ field }: { field: CheckboxGroupField }) {
  const { fields: states } = useFormContext();
  const state = states.find((s) => s.fieldId === field.fieldId);

  if (!state) return null;

  const [values, setValues] = state.state as [
    string[],
    React.Dispatch<React.SetStateAction<string[]>>
  ];

  const toggleValue = (val: string) => {
    let updated: string[];
    if (values.includes(val)) {
      updated = values.filter((v) => v !== val);
    } else {
      updated = [...values, val];
    }
    setValues(updated);

    if (field.onChange) {
      field.onChange(updated, state.state as any);
    }
  };

  return (
    <div className="space-y-3">
      <Label>{field.label}</Label>
      <div className="flex flex-col gap-2">
        {field.options.map((opt) => (
          <div key={opt.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${field.fieldId}-${opt.value}`}
              checked={values.includes(opt.value)}
              onCheckedChange={() => toggleValue(opt.value)}
            />
            <Label htmlFor={`${field.fieldId}-${opt.value}`}>
              {opt.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CheckboxGroupFieldInput;
