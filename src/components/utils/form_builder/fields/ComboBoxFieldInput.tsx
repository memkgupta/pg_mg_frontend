import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn util
import { ComboBoxField } from "../types";
import { useFormContext } from "../FormContext";

function ComboBoxFieldInput({ field }: { field: ComboBoxField }) {
  const { fields: states } = useFormContext();
  const state = states.find((s) => s.fieldId === field.fieldId);

  if (!state) return null;

  const [value, setValue] = state.state as [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <Label>{field.label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? field.options.find((opt) => opt.value === value)?.label
              : field.placeholder ?? "Select option"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {field.options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  onSelect={() => {
                    setValue(opt.value);
                    setOpen(false);
                    if (field.onChange) {
                      field.onChange(opt.value, state.state as any);
                    }
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
    </div>
  );
}

export default ComboBoxFieldInput;
