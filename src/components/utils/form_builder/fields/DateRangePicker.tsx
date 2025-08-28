"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { DateRangeField, BaseField } from "../types";
import { useFormContext } from "../FormContext";

export function DateRangePicker({field}:{field:DateRangeField}) {

    const { fields: states } = useFormContext();
     const state = states.find((s) => s.fieldId === field.fieldId);
   
     if (!state) {
       return null;
     }
   
     const [value, setValue] = state.state as [
       {from:Date,to?:Date},
       React.Dispatch<React.SetStateAction<{from:Date,to?:Date}>>
     ];
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>{field.label}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={(selected)=>{
                const from = selected?.from
                const to = selected?.to;
               if(from)
               {
                 setValue({
                    from,to
                })
                 if(field.onChange)
               {
                field.onChange({from,to},state.state)
               }
               }
              
            }}
            numberOfMonths={field.numberOfMonths??2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
