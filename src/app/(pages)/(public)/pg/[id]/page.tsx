import { BACKEND_BASE_URL } from '@/constants'
import React from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Home, MapPin, Phone, Mail } from 'lucide-react'
import { IPg, IPgImage } from '@/types'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { RoomCategories } from '@/components/features/pg/room/room.category'
import { RoomSelectionCard } from '@/components/features/pg/room/romm.selection.card'
import { BookNow } from '@/components/features/pg/room/room.book'
import { ReviewCarousel } from '@/components/features/pg/reviews/pg.review'
export default async function ViewPgPage({ params }: { params: Promise<{ id: string }> }){
  const {id} =await params
  const res = await fetch(`${BACKEND_BASE_URL}pg/view/${id}`, {
    cache: "no-store" // ❗important if you want SSR instead of caching
  })
  const resData = await res.json()
  console.log(resData.data.roomCategories)
  const pg:IPg =resData.data
  return(
    <>
  <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Carousel Section */}
        {pg.images && pg.images.length > 0 && (
          <div className="lg:w-1/2 w-full h-80">
            <Carousel className="w-full h-full rounded-2xl overflow-hidden">
              <CarouselContent>
                {pg.images
                  .sort((a, b) => a.position - b.position)
                  .map((img) => (
                    <CarouselItem key={img.id} className="relative w-full h-80">
                      <Image
                        src={img.url}
                        alt={img.caption ?? 'PG Image'}
                        fill
                        className="object-cover rounded-2xl"
                      />
                      {img.caption && (
                        <div className="absolute bottom-0 left-0 w-full bg-black/40 text-white text-sm p-2">
                          {img.caption}
                        </div>
                      )}
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow" />
            </Carousel>
          </div>
        )}

        {/* PG Details Card */}
        <div className="lg:w-1/2 w-full">
          <Card className="rounded-2xl shadow-md">
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
                <span>{pg.totalRooms ?? 'N/A'} Rooms</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{pg.address}, {pg.city}, {pg.state} - {pg.pincode}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{pg.contactNumber}</span>
              </div>

              {pg.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{pg.email}</span>
                </div>
              )}

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
        
        </div>
      </div>
  <div className="flex flex-col lg:flex-row gap-6">
  {/* Categories */}
  {pg.roomCategories && (
    <div className="order-2 lg:order-1 flex-1">
      <RoomCategories categories={pg.roomCategories} />
    </div>
  )}

  {/* Book Now */}
  {pg.roomCategories && (
    <div className="order-1 lg:order-2 flex-1">
      <BookNow categories={pg.roomCategories} pgId={id} />
    </div>
  )}
</div>
<ReviewCarousel />
    </div>
    </>
  )
}
