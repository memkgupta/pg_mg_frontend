import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ComboBoxField } from "../types"
import BaseInputField from "./BaseInputField"

function ComboBoxFieldInput({ field }: { field: ComboBoxField }) {
  const [open, setOpen] = useState(false)

  return (
    <BaseInputField fieldId={field.fieldId} label={field.label}>
      {(value, setValue) => (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value
                ? field.options.find((opt) => opt.value === value)?.label
                : field.placeholder ?? "Select option"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          {/* ensure Popover matches trigger width */}
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandInput placeholder="Search..." />
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {field.options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => {
                      setValue(opt.value)
                      setOpen(false)
                      field.onChange?.(opt.value, [value, setValue])
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === opt.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </BaseInputField>
  )
}

export default ComboBoxFieldInput
