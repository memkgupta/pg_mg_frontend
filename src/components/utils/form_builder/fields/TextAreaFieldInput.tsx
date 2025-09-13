import React from "react"
import { Textarea } from "@/components/ui/textarea"
import { BaseField } from "../types"
import BaseInputField from "./BaseInputField"

function TextAreaFieldInput({ field }: { field: BaseField<string> }) {
  return (
    <BaseInputField fieldId={field.fieldId} label={field.label}>
      {(value, setValue) => {
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const val = e.target.value
          setValue(val)
          field.onChange?.(val, [value, setValue] as any)
        }

        return (
          <Textarea
            id={field.fieldId}
            placeholder={field.placeholder ?? "Enter text here"}
            value={value as string}
            onChange={handleChange}
            className="resize-y min-h-[100px]"
          />
        )
      }}
    </BaseInputField>
  )
}

export default TextAreaFieldInput
