import React, { useMemo } from "react"
import { BaseField } from "../types"
import { useFormContext } from "../FormContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const TextField = ({ field }: { field: BaseField<string> }) => {
  const { fields: states, errors } = useFormContext()

  // find field state once, memoized
  const state = 
    states.find((s) => s.fieldId === field.fieldId)
  

  if (!state) return null

  const [value, setValue] = state.state


 const error = errors.find(e => e.fieldId === field.fieldId)

  return (
    <div className="grid gap-1 w-full">
      <Label htmlFor={field.fieldId}>{field.label}</Label>
      <Input
        id={field.fieldId}
        value={value as string}
        onChange={(e) => {
          setValue(e.target.value)
          field.onChange?.(e.target.value, state.state)
        }}
      />
      {error && <span className="text-red-600 text-xs">{error.message}</span>}
    </div>
  )
}

export default TextField
