import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Home, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { IPg } from '@/types'
export function PgCard({ pg }: { pg: IPg }) {
  return (
    <Card className="w-full max-w-md rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {pg.name}
          {pg.isVerified && <Badge variant="secondary">Verified</Badge>}
        </CardTitle>
        {pg.description && (
          <p className="text-sm text-muted-foreground">{pg.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="h-4 w-4" />
          <span>{pg.totalRooms ?? "N/A"} Rooms</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{pg.address}, {pg.city}, {pg.state} - {pg.pincode}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{pg.contactNumber}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{pg.email}</span>
        </div>

        {pg.amenities && pg.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {pg.amenities.map((amenity, idx) => (
              <Badge key={idx} variant="outline">{amenity}</Badge>
            ))}
          </div>
        )}

        <div className="pt-2">
          {pg.isActive ? (
            <Badge className="bg-green-500 text-white">Active</Badge>
          ) : (
            <Badge variant="destructive">Inactive</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}