import React from "react"
import { useFormContext } from "../FormContext"
import { Label } from "@/components/ui/label"

interface BaseInputFieldProps {
  fieldId: string
  label: string
  children: (value: any, setValue: React.Dispatch<React.SetStateAction<any>>) => React.ReactNode
}

const BaseInputField: React.FC<BaseInputFieldProps> = ({ fieldId, label, children }) => {
  const { fields: states, errors } = useFormContext()
  const state = states.find((s) => s.fieldId === fieldId)

  if (!state) return null

  const [value, setValue] = state.state
  const error = errors.find((e) => e.fieldId === fieldId)

  return (
    <div className="grid gap-1 w-full">
      <Label htmlFor={fieldId}>{label}</Label>
      {children(value, setValue)}
      {error && <span className="text-red-600 text-xs">{error.message}</span>}
    </div>
  )
}

export default BaseInputField
