import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Home, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { IPg } from '@/types'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from 'next/image'
import Link from 'next/link'
export function PgCard({ pg }: { pg: IPg }) {
  return (
    <Card className="w-full max-w-md rounded-2xl shadow-md overflow-hidden">
       {pg.images && pg.images.length > 0 && (
        <Carousel className="w-full">
          <CarouselContent>
            {pg.images
              .sort((a, b) => a.position - b.position) // sort by position
              .map((img) => (
              <CarouselItem key={img.id} className="flex justify-center">
                <div className="relative w-full h-60">
                  <Image
                    src={img.url}
                    alt={img.caption ?? "PG Image"}
                    fill
                    className="object-cover rounded-t-2xl"
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 w-full bg-black/40 text-white text-sm p-2">
                      {img.caption}
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
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
      <CardFooter className='flex justify-end'>
        <Link href={`/pg/${pg.id}`} className='bg-green-400 px-3 py-2 text-black rounded-md'>View</Link>
      </CardFooter>
    </Card>
  )
}