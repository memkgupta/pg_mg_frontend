"use client"
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePg } from "@/context/PgContext";
import { useApiGet } from "@/hooks/api_hooks";
import AddRoomCategory from "@/components/features/dashboard/AddRoomCategory";
import AddRoom from "@/components/features/dashboard/AddRoom";
import { IRoom } from "@/types";

export default function RoomPage() {
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
  const { currentPg } = usePg();

  const { data: layout } = useApiGet<Record<number, IRoom[]>>(
    `/aggregate/pg/dashboard/room`,
    { params: { pg_id: currentPg?.id } },
    { queryKey: ["pg-dashboard-room", currentPg?.id] }
  );

  // Convert { "1": [...], "2": [...] } → [{ floor: 1, rooms: [...] }]
  const floors = layout
    ? Object.entries(layout).map(([floor, rooms]) => ({
        floor: Number(floor),
        rooms,
      }))
    : [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏠 Rooms</h1>
        <div className="flex gap-2 items-center">
          <AddRoom />
          <AddRoomCategory />
        </div>
      </div>

      {/* Floors + Rooms Layout */}
      {floors.map((floor) => (
        <div key={floor.floor} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Floor {floor.floor}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {floor.rooms.map((room) => (
              <Dialog
                key={room.id}
                onOpenChange={(open) => !open && setSelectedRoom(null)}
              >
                <DialogTrigger asChild>
                  <Card
                    className="cursor-pointer transition hover:shadow-md border border-gray-200"
                    onClick={() => setSelectedRoom(room)}
                  >
                    <CardContent className="p-4 text-center">
                      <h3 className="text-lg font-bold">
                        Room {room.roomNumber}
                      </h3>
                      {room.category && (
                        <p className="text-sm text-gray-600">
                          {room.category.name} • {room.category.noOfBeds} Beds
                        </p>
                      )}
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                        Free Beds: {room.noOfFreeBeds}
                      </span>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  {selectedRoom && (
                    <>
                      <DialogHeader>
                        <DialogTitle>
                          Room {selectedRoom.roomNumber} Details
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        <p>
                          <strong>Floor:</strong> {selectedRoom.floorNumber}
                        </p>
                        <p>
                          <strong>Category:</strong>{" "}
                          {selectedRoom.category?.name}
                        </p>
                        <p>
                          <strong>Beds:</strong>{" "}
                          {selectedRoom.noOfFreeBeds}
                        </p>
                        <p>
                          <strong>Rent:</strong> ₹
                          {selectedRoom.category?.baseRent}
                        </p>
                        <p>
                          <strong>Free Beds:</strong>{" "}
                          {selectedRoom.noOfFreeBeds}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline">Edit</Button>
                        <Button variant="destructive">Delete</Button>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
