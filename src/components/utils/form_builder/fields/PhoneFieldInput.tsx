import React from "react"
import { Input } from "@/components/ui/input"
import { PhoneField } from "../types"
import BaseInputField from "./BaseInputField"

function PhoneFieldInput({ field }: { field: PhoneField }) {
  return (
    <BaseInputField fieldId={field.fieldId} label={field.label}>
      {(value, setValue) => (
        <Input
          id={field.fieldId}
          type="tel"
          value={value as string}
          placeholder={field.placeholder ?? "Enter phone number"}
          onChange={(e) => {
            const val = e.target.value
            setValue(val)
            field.onChange?.(val, [value, setValue] as any)
          }}
        />
      )}
    </BaseInputField>
  )
}

export default PhoneFieldInput
