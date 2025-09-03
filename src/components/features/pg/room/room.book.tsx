"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Thermometer } from "lucide-react";
import { IRoomCategory, IRoom } from "@/types";
import { useApiGet } from "@/hooks/api_hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export interface FloorLayout {
  floorNumber: number;
  rooms: IRoom[];
}

interface Props {
  categories: IRoomCategory[];
  pgId: string;
}

export function BookNow({ categories, pgId }: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories[0]?.id ?? ""
  );
  const router = useRouter()
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // 👇 Fetch layout instead of raw rooms
  const { data: layout = [] } = useApiGet<FloorLayout[]>(
    `/pg/rooms/${pgId}`,
    {},
    { queryKey: [pgId, "rooms-layout"] }
  );

  // Flatten just rooms of selected category
  const categoryRooms = layout
    .map((floor) => ({
      ...floor,
      rooms: floor.rooms.filter(
        (r) => r.categoryId === selectedCategoryId
      ),
    }))
    .filter((floor) => floor.rooms.length > 0);

  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [selectedFloor,setSelectedFloor] = useState<number>(0);
  useEffect(() => {
    // Reset when category changes
    const firstAvailable = categoryRooms[0]?.rooms[0];
    setSelectedRoomId(firstAvailable?.id ?? "");
  }, [selectedCategoryId, layout]);

  return (
    <Card className="rounded-2xl shadow-md w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Book a Room</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Category Select */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Select Room Category</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="border rounded-md p-2"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} {cat.isAc ? "(AC)" : "(Non-AC)"}
              </option>
            ))}
          </select>
        </div>

        {/* Category Details */}
        {selectedCategory && (
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="font-semibold">{selectedCategory.name}</p>
            {selectedCategory.description && (
              <p className="text-sm text-muted-foreground">
                {selectedCategory.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" /> {selectedCategory.noOfBeds} Bed
                {selectedCategory.noOfBeds > 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-1">
                <Thermometer className="h-4 w-4" />
                {selectedCategory.isAc ? "AC" : "Non-AC"}
              </div>
              <div className="font-semibold">
                ₹{selectedCategory.baseRent.toLocaleString()} / month
              </div>
            </div>
          </div>
        )}

        {/* Layout Rendering */}
        {categoryRooms.length > 0 ? (
          <div className="flex flex-col gap-6 border p-2">
            {categoryRooms.map((floor) => (
              <div key={floor.floorNumber}>
                <h3 className="font-semibold mb-2">
                  Floor {floor.floorNumber}
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {floor.rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => {room.noOfFreeBeds > 0 && setSelectedRoomId(room.id);
                        room.noOfFreeBeds>0 && setSelectedFloor(floor.floorNumber)
                      }}
                      className={`w-12 h-12 flex items-center justify-center border rounded-md cursor-pointer 
                        ${room.noOfFreeBeds <= 0 ? "bg-gray-300 cursor-not-allowed" : ""}
                        ${
                          selectedRoomId === room.id
                            ? "bg-green-500 text-white"
                            : "bg-white"
                        }`}
                    >
                      {room.roomNumber}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-red-500">
            No available rooms in this category
          </p>
        )}

        {/* Book Now Button */}
        <Link
        
          href={`/book?room=${selectedRoomId}&category=${selectedCategoryId}&floor=${selectedFloor}&pgId=${pgId}`}
     
          className="mt-4"
        >
          Book Now
        </Link>
      </CardContent>
    </Card>
  );
}
