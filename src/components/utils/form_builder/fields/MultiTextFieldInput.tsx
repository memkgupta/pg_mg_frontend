import React from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BaseField } from "../types"
import BaseInputField from "./BaseInputField"

function MultiTextFieldInput({ field }: { field: BaseField<string[]> }) {
  return (
    <BaseInputField fieldId={field.fieldId} label={field.label}>
      {(values, setValues) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value
          const splitValues = val
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)

          setValues(splitValues)
          field.onChange?.(splitValues, [values, setValues] as any)
        }

        return (
          <div className="w-full">
            <Input
              id={field.fieldId}
              type="text"
              placeholder={field.placeholder ?? "Enter values, separated by commas"}
              value={(values as string[]).join(", ")}
              onChange={handleChange}
            />
            {(values as string[]).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {(values as string[]).map((val, idx) => (
                  <Badge key={idx} variant="secondary" className="px-2 py-1">
                    {val}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )
      }}
    </BaseInputField>
  )
}

export default MultiTextFieldInput
