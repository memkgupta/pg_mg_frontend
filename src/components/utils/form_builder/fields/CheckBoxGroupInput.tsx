import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckboxGroupField } from "../types"
import BaseInputField from "./BaseInputField"

function CheckboxGroupFieldInput({ field }: { field: CheckboxGroupField }) {
  return (
    <BaseInputField fieldId={field.fieldId} label={field.label}>
      {(values, setValues) => {
        const toggleValue = (val: string) => {
          let updated: string[]
          if ((values as string[]).includes(val)) {
            updated = (values as string[]).filter((v) => v !== val)
          } else {
            updated = [...(values as string[]), val]
          }
          setValues(updated)
          field.onChange?.(updated, [values, setValues])
        }

        return (
          <div className="flex flex-col gap-2">
            {field.options.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.fieldId}-${opt.value}`}
                  checked={(values as string[]).includes(opt.value)}
                  onCheckedChange={() => toggleValue(opt.value)}
                />
                <label htmlFor={`${field.fieldId}-${opt.value}`} className="text-sm">
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        )
      }}
    </BaseInputField>
  )
}

export default CheckboxGroupFieldInput
