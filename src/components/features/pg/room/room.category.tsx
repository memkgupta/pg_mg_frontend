import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IRoomCategory } from '@/types'
import { Bed, Thermometer } from 'lucide-react'
import React from 'react'

interface Props {
  categories: IRoomCategory[]
}

export function RoomCategories({ categories }: Props) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Room Categories</h2>
      <div className="grid grid-cols-1  gap-6">
        {categories.map((cat) => (
          <Card key={cat.id} className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {cat.name}
                {cat.isAc && <Badge variant="secondary">AC</Badge>}
              </CardTitle>
              {cat.description && (
                <p className="text-sm text-muted-foreground">{cat.description}</p>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bed className="h-4 w-4" />
                <span>{cat.noOfBeds} Bed{cat.noOfBeds > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Thermometer className="h-4 w-4" />
                <span>{cat.isAc ? 'AC Available' : 'Non-AC'}</span>
              </div>
              <div className="text-sm font-semibold">
                ₹{cat.baseRent.toLocaleString()} / month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}