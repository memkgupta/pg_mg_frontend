"use client";
import { Card, CardContent } from "@/components/ui/card";
import { IRoom } from "@/types";

export default function RoomLayout({
  rooms,
  selectedRoom,
  setSelectedRoom,
}: {
  rooms?: IRoom[];
  selectedRoom: string;
  setSelectedRoom: (id: string) => void;
}) {
  if (!rooms?.length) return <div>No rooms available</div>;

  return (
    <div className="grid grid-cols-3 gap-2">
      {rooms.map((room) => (
        <Card
          key={room.id}
          className={`cursor-pointer border transition text-center ${
            selectedRoom === room.id ? "border-blue-500" : "border-gray-200"
          } ${room.noOfFreeBeds === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => room.noOfFreeBeds > 0 && setSelectedRoom(room.id)}
        >
          <CardContent className="p-2 flex flex-col items-center">
            <span className="text-sm font-semibold">{room.roomNumber}</span>
            <span className="text-xs text-gray-500">{room.category?.name}</span>
            <span
              className={`text-[10px] mt-1 ${
                room.noOfFreeBeds > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {room.noOfFreeBeds > 0 ? "Available" : "Occupied"}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
