"use client"
import { useCurrentPg } from '@/context/CurrentPgContext'
import { useApiGet } from '@/hooks/api_hooks'
import { APIResponse, IBooking, ITenant } from '@/types'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageLoader from '@/components/common/Loader'
import { useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const ViewBookingPage = ({params}:{params:{id:string}}) => {
    const {details:currentPg} = useCurrentPg()
    const router = useRouter()
    const [isFinalizing,setIsFinalizing] = useState(false)
    const {data:booking,isFetching} = useApiGet<IBooking>(`/aggregate/pg/dashboard/booking/${params.id}`,{
        params:{
            pg_id:currentPg.id
        }
    },{queryKey:["pg-dashboard-booking",params.id]})
    const queryClient = useQueryClient()
    const handleFinalizeTenant = async() => {
        
        if(booking)
        {
            try{
                setIsFinalizing(true)
        const res = await api.post<any,APIResponse<ITenant>>(`/pg/admin/tenant/admit-booking/${booking.id}`,{},{
            params:{
                pg_id:currentPg.id
            }
        })
        if(res.success )
        {
            toast("Tenant finalized");
queryClient.invalidateQueries({queryKey:["pg-dashboard-tenants"]});
           res.data &&  router.replace(`/dashboard/tenants/${res.data?.id}`)
        }
      }
      catch(error)
      {

      }
      finally{
setIsFinalizing(false);
      }
        }
      
    }

  return (
   <>
   {isFetching?<PageLoader/>:(booking &&  
     <div className="max-w-4xl mx-auto p-6 space-y-6">

      {/* 🔹 Finalize Tenant Button */}
      <div className="flex justify-end">
        <Button disabled={isFinalizing} onClick={handleFinalizeTenant} className="bg-green-600 hover:bg-green-700">
          Finalize Tenant
        </Button>
      </div>

      {/* Booking Info */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Booking ID:</span>
            <span>{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <Badge
              variant={
                booking.bookingStatus === "success" ? "default" : "secondary"
              }
            >
              {booking.bookingStatus}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Created At:</span>
            <span>{new Date(booking.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Updated At:</span>
            <span>{new Date(booking.updatedAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Transaction ID:</span>
            <span>{booking.transactionId ?? "N/A"}</span>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* PG Info */}
      {booking.pg && <Card>
        <CardHeader>
          <CardTitle>PG Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">PG Name:</span>
            <span>{booking.pg.name}</span>
          </div>
          <div>
            <span className="font-medium">Address:</span>
            <p className="whitespace-pre-line text-sm mt-1">
              {booking.pg.address}
            </p>
          </div>
        </CardContent>
      </Card>}

      <Separator />

      {/* Room Info */}
      {booking.room && <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Room ID:</span>
            <span>{booking.room.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Room Number:</span>
            <span>{booking.room.roomNumber}</span>
          </div>
        </CardContent>
      </Card>}

      <Separator />

      {/* User Info */}
      {booking.user && <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">User ID:</span>
            <span>{booking.user.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>{booking.user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{booking.user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Role:</span>
            <span>{booking.user.role}</span>
          </div>
        </CardContent>
      </Card>}
    </div>)}
   </>
  )
}

export default ViewBookingPage
