"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { usePg } from "@/context/PgContext"



export function PgSelector() {
  const [open, setOpen] = React.useState(false)
  
    const {pgs,isLoading,selectPg,currentPg} = usePg()
  return (
  <>
  {isLoading?<Loader2 className="animate-spin"/>:(  <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentPg
            ? pgs.find((pg) => pg.id === currentPg.id)?.name
            : "Select Pg..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Pg..." />
          <CommandList>
            <CommandEmpty>No Pg found.</CommandEmpty>
            <CommandGroup>
              {pgs.map((pg) => (
                <CommandItem
                  key={pg.id}
                  value={pg.id}
                  onSelect={(currentValue) => {
                   
                    selectPg(pg.id!)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentPg?.id === pg.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {pg.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>)}
  </>
  )
}