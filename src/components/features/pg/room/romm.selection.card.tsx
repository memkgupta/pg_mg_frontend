import React, { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bed, Thermometer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IRoom, IRoomCategory } from '@/types'

interface Props {
  category: IRoomCategory
  rooms: IRoom[]
  onBook: (roomId: string) => void
}
export function RoomSelectionCard({ category, rooms, onBook }: Props) {
  const [selectedRoom, setSelectedRoom] = useState<string>(rooms[0]?.id ?? '')

  return (
    <Card className="rounded-2xl shadow-md w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {category.name}
          {category.isAc && <Badge variant="secondary">AC</Badge>}
        </CardTitle>
        {category.description && (
          <p className="text-sm text-muted-foreground">{category.description}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bed className="h-4 w-4" />
          <span>{category.noOfBeds} Bed{category.noOfBeds > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Thermometer className="h-4 w-4" />
          <span>{category.isAc ? 'AC Available' : 'Non-AC'}</span>
        </div>
        <div className="text-sm font-semibold">₹{category.baseRent.toLocaleString()} / month</div>

        {/* Room Select Dropdown */}
        {rooms.length > 0 ? (
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="border rounded-md p-2 mt-2"
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id} disabled={room.noOfFreeBeds<1}>
                {room.noOfFreeBeds} {room.noOfFreeBeds>=1 ? '' : '(Unavailable)'}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-red-500">No rooms available</p>
        )}

        {/* Book Now Button */}
        <Button
          className="mt-2"
          disabled={!selectedRoom}
          onClick={() => selectedRoom && onBook(selectedRoom)}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  )
}