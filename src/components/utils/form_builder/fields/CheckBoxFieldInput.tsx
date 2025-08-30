import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckBoxField } from "../types"
import BaseInputField from "./BaseInputField"

function CheckboxFieldInput({ field }: { field: CheckBoxField }) {
  return (
    <BaseInputField fieldId={field.fieldId} label={field.label}>
      {(value, setValue) => (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={field.fieldId}
            checked={value as boolean}
            onCheckedChange={(checked) => {
              const boolVal = checked === true
              setValue(boolVal)
              field.onChange?.(boolVal, [value, setValue])
            }}
          />
        </div>
      )}
    </BaseInputField>
  )
}

export default CheckboxFieldInput
