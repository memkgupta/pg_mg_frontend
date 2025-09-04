"use client";
import PageLoader from "@/components/common/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiGet } from "@/hooks/api_hooks";
import { IPg, IRoom, IRoomCategory } from "@/types";
import { Bed, Wifi, Snowflake, ShowerHead, Users } from "lucide-react";


const roommates = [
  { id: 1, name: "Rahul Verma", room: "203", status: "Active" },
  { id: 2, name: "Ankit Sharma", room: "203", status: "Active" },
];

const facilities = [
  { id: 1, name: "WiFi", icon: <Wifi className="text-blue-600" size={20} /> },
  { id: 2, name: "Air Conditioning", icon: <Snowflake className="text-cyan-600" size={20} /> },
  { id: 3, name: "Attached Bathroom", icon: <ShowerHead className="text-green-600" size={20} /> },
  { id: 4, name: "Laundry Service", icon: <Bed className="text-purple-600" size={20} /> },
];

export default function RoomPage() {
  const{data:room,isFetching} = useApiGet<{roomDetails:IRoom,roomMates:{name?:string,phone?:string}[]}>(
    `/aggregate/dashboard/room`,{},{
      queryKey:["account-room"]
    }
  );
  return (
    <>
    {
     !room || isFetching ? (<PageLoader/>) :(
        <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Bed size={24} className="text-blue-600" /> My Room
      </h1>
      <p className="text-gray-500 text-sm">Details of your current stay</p>

      {/* Room Details */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-gray-700">
          <p><strong>PG Name:</strong> {room.roomDetails.pg?.name}</p>
          <p><strong>Room No:</strong> {room.roomDetails.roomNumber}</p>
          <p><strong>Type:</strong> {room.roomDetails.category?.name}</p>
          <p><strong>Rent:</strong> {room.roomDetails.category?.baseRent} / month</p>
        </CardContent>
      </Card>

      {/* Roommates */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="flex items-center gap-2">
          <Users size={20} className="text-purple-600" />
          <CardTitle>Roommates</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {room.roomMates.map((mate,index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 rounded-lg bg-gray-100"
              >
                <span className="font-medium">{mate.name}</span>
                <span className="text-xs ">{mate.phone}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Facilities */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {room.roomDetails.pg.amenities?.map((f) => (
              <div
                key={f}
                className="flex flex-col items-center justify-center p-4 border rounded-xl shadow-sm bg-white"
              >
              
                <span className="text-sm mt-2 text-gray-700">{f}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rules (Optional) */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>House Rules</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 text-sm space-y-2">
          <p>⏰ Curfew Time: 10 PM</p>
          <p>🚫 No outside guests allowed after 8 PM</p>
          <p>🔥 Cooking inside rooms not permitted</p>
        </CardContent>
      </Card>
    </div>
      )
    }
    </>
  );
}
