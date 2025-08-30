"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Checkbox
} from "@/components/ui/checkbox"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SideFilterBoxProps {
  onApply: (filters: any) => void
}

export function SideFilterBox({ onApply }: SideFilterBoxProps) {
  const [filters, setFilters] = useState<any>({
    city: "",
    isActive: "",
    amenities: [] as string[],
  })

  const toggleAmenity = (amenity: string) => {
    setFilters((prev: any) => {
      const hasAmenity = prev.amenities.includes(amenity)
      return {
        ...prev,
        amenities: hasAmenity
          ? prev.amenities.filter((a: string) => a !== amenity)
          : [...prev.amenities, amenity],
      }
    })
  }

  return (
    <Card className="w-64 h-full border-r rounded-none shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        
        {/* City Select */}
        <div className="flex flex-col gap-2">
          <Label>City</Label>
          <Select
            onValueChange={(val) => setFilters((f: any) => ({ ...f, city: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="noida">Noida</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="gurgaon">Gurgaon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Radio */}
        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <RadioGroup
            onValueChange={(val) => setFilters((f: any) => ({ ...f, isActive: val }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="active" />
              <Label htmlFor="active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inactive" id="inactive" />
              <Label htmlFor="inactive">Inactive</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Amenities Checkboxes */}
        <div className="flex flex-col gap-2">
          <Label>Amenities</Label>
          {["WiFi", "AC", "Laundry", "Food"].map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <Checkbox
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <span>{amenity}</span>
            </div>
          ))}
        </div>

        {/* Apply Button */}
        <Button
          className="w-full"
          onClick={() => onApply(filters)}
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
