import { useCurrentPg } from "@/context/CurrentPgContext";
import { IRoom } from "@/types";

export default function TenantRoomInfo({ room }: { room?: Partial<IRoom> }) {
  if (!room) return null;
     
  return (
    <div>
      <p className="text-sm text-gray-500">Room</p>
      <p className="font-medium">
        Room {room.roomNumber} (Floor {room.floorNumber})
      </p>
    </div>
  );
}
