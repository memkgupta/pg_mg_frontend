import React from "react"
import { Input } from "@/components/ui/input"
import { BaseField } from "../types"
import BaseInputField from "./BaseInputField"

export const EmailInputField = ({ field }: { field: BaseField<string> }) => {
  return (
    <BaseInputField fieldId={field.fieldId} label={field.label}>
      {(value, setValue) => (
        <Input
          id={field.fieldId}
          type="email"
          value={value as string}
          placeholder={field.placeholder ?? "Enter your email"}
          onChange={(e) => {
            setValue(e.target.value)
            field.onChange?.(e.target.value, [value, setValue])
          }}
        />
      )}
    </BaseInputField>
  )
}

export default EmailInputField
