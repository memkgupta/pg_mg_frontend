import React from "react"
import { RadioField } from "../types"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useFormContext } from "../FormContext"
import BaseInputField from "./BaseInputField"

function RadioFieldInput<T extends string>({ field }: { field: RadioField<T> }) {
  const { fields: states } = useFormContext()
  const state = states.find((s) => s.fieldId === field.fieldId)

  if (!state) return null

  const [value, setValue] = state.state as [
    T,
    React.Dispatch<React.SetStateAction<T>>
  ]

  return (
    <BaseInputField fieldId={field.fieldId} label={field.label}>
      {() => (
        <RadioGroup
          value={value}
          onValueChange={(val) => {
            setValue(val as T)
            field.onChange?.(val as T, state.state as any)
          }}
          className="space-y-2"
        >
          {field.options.map((opt) => {
            const id = `${field.fieldId}-${opt.value}`
            return (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={id} />
                <Label htmlFor={id}>{opt.label}</Label>
              </div>
            )
          })}
        </RadioGroup>
      )}
    </BaseInputField>
  )
}

export default RadioFieldInput
