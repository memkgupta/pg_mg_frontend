"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"
import { DateRangeField } from "../types"
import BaseInputField from "./BaseInputField"

export function DateRangePicker({ field }: { field: DateRangeField }) {
  return (
    <BaseInputField fieldId={field.fieldId} label={field.label}>
      {(value, setValue) => {
        // enforce safe typing for date range
        const range = value as { from: Date; to?: Date }

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={field.fieldId}
                variant="outline"
                className={cn(
                  "w-[260px] justify-start text-left font-normal",
                  !range?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {range?.from ? (
                  range.to ? (
                    <>
                      {format(range.from, "LLL dd, y")} -{" "}
                      {format(range.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(range.from, "LLL dd, y")
                  )
                ) : (
                  <span>{field.placeholder ?? "Pick a date range"}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Calendar
                mode="range"
                defaultMonth={range?.from}
                selected={range}
                onSelect={(selected) => {
                 
                  if(selected?.from)
                  { const newRange = {
                    from: selected.from,
                    to: selected?.to,
                  }
                      setValue(newRange)
                  field.onChange?.(newRange, [value, setValue])
                  }
                
                }}
                numberOfMonths={field.numberOfMonths ?? 2}
              />
            </PopoverContent>
          </Popover>
        )
      }}
    </BaseInputField>
  )
}
