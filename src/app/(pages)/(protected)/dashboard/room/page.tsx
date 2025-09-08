"use client"
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePg } from "@/context/PgContext";
import { useApiGet } from "@/hooks/api_hooks";

const initialRooms = [
  {
    floor: 1,
    rooms: [
      { id: 1, number: "101", type: "Single", status: "occupied", tenant: "Rahul Sharma" },
      { id: 2, number: "102", type: "Double", status: "vacant", tenant: null },
    ],
  },
  {
    floor: 2,
    rooms: [
      { id: 3, number: "201", type: "Single", status: "maintenance", tenant: null },
      { id: 4, number: "202", type: "Triple", status: "occupied", tenant: "Priya Singh" },
    ],
  },
];

export default function RoomPage() {
  const [floors, setFloors] = useState(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
const {currentPg}=usePg()
const {data} = useApiGet<any>(`/aggregate/pg/dashboard/room`,{params:{
  pg_id:currentPg?.id
}},{
  queryKey:["pg-dashboard-room",currentPg?.id]
})
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏠 Rooms</h1>

        {/* Add Room Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Room</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Room Number</Label>
                <Input placeholder="Enter room number" />
              </div>
              <div>
                <Label>Floor</Label>
                <Input placeholder="Enter floor number" type="number" />
              </div>
              <div>
                <Label>Type</Label>
                <Input placeholder="Single / Double / Triple" />
              </div>
              <Button className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Floors + Rooms Layout */}
      {floors.map((floor) => (
        <div key={floor.floor} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Floor {floor.floor}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {floor.rooms.map((room) => (
              <Dialog key={room.id} onOpenChange={(open) => !open && setSelectedRoom(null)}>
                <DialogTrigger asChild>
                  <Card
                    className={`cursor-pointer transition hover:shadow-md ${
                      room.status === "occupied"
                        ? "border-green-500"
                        : room.status === "vacant"
                        ? "border-blue-500"
                        : "border-yellow-500"
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <CardContent className="p-4 text-center">
                      <h3 className="text-lg font-bold">Room {room.number}</h3>
                      <p className="text-sm">{room.type}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          room.status === "occupied"
                            ? "bg-green-100 text-green-700"
                            : room.status === "vacant"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {room.status}
                      </span>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  {selectedRoom && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Room {selectedRoom.number} Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        <p>
                          <strong>Type:</strong> {selectedRoom.type}
                        </p>
                        <p>
                          <strong>Status:</strong> {selectedRoom.status}
                        </p>
                        {selectedRoom.tenant && (
                          <p>
                            <strong>Tenant:</strong> {selectedRoom.tenant}
                          </p>
                        )}
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
