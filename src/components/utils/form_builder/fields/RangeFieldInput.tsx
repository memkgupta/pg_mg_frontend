import React from "react"
import { Slider } from "@/components/ui/slider"
import { useFormContext } from "../FormContext"
import { RangeField } from "../types"
import BaseInputField from "./BaseInputField"

const RangeFieldInput = ({ field }: { field: RangeField }) => {
  const { fields: states } = useFormContext()
  const state = states.find((s) => s.fieldId === field.fieldId)

  if (!state) return null

  const [value, setValue] = state.state as [
    number[],
    React.Dispatch<React.SetStateAction<number[]>>
  ]

  return (
    <BaseInputField fieldId={field.fieldId} label={field.label}>
      {() => (
        <Slider
          id={field.fieldId}
          value={value}
          onValueChange={(val) => {
            setValue(val)
            field.onChange?.(val, state.state as any)
          }}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          className="w-full"
        />
      )}
    </BaseInputField>
  )
}

export default RangeFieldInput
