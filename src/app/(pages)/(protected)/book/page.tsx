"use client";
import { FloorLayout } from "@/components/features/pg/room/room.book";
import { useBooking, useBookingTimer } from "@/context/BookingContext";
import { useApiGet } from "@/hooks/api_hooks";
import { APIResponse, IBooking, IRoom } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Bed,
  Wifi,
  Snowflake,
  Bath,
  IndianRupee,
  Clock,
  RefreshCw,
  Loader2,
} from "lucide-react";
import api from "@/services/api";
import axios from "axios";
import { BACKEND_BASE_URL } from "@/constants";

const BookPgPage = () => {
  const bookingContext = useBooking();
  const timeLeft = useBookingTimer(); // Use the custom hook for timer
  const params = useSearchParams();
  const router = useRouter();
  const query_client = useQueryClient();

  const [room, setRoom] = useState<IRoom | undefined>(undefined);
  const [isInitializing, setIsInitializing] = useState(false);
  const [roomLoading, setRoomLoading] = useState(true);

  const room_id = params.get("room");
  const floor = params.get("floor");
  const pgId = params.get("pgId");
  const existingBookingId = params.get("bookingId");

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Fetch room data
  const fetchRoomData = useCallback(async () => {
    if (!pgId || !room_id) return;

    setRoomLoading(true);
    try {
      let layout = query_client.getQueryData<FloorLayout[]>([
        pgId,
        "rooms-layout",
      ]);

      if (!layout) {
        const { data: apiResponse } = await api.get<APIResponse<FloorLayout[]>>(
          `/pg/rooms/${pgId}`
        );
        layout = apiResponse.data;
      }

      const foundRoom = layout
        ?.flatMap((fl) => fl.rooms)
        .find((r) => r.id == room_id);
      if (!foundRoom) {
        toast.error("Room not found");
        router.back();
        return;
      }

      setRoom(foundRoom);
    } catch (error) {
      console.error("Failed to load room data:", error);
      toast.error("Failed to load room data");
      router.back();
    } finally {
      setRoomLoading(false);
    }
  }, [pgId, room_id, query_client, router]);

  // Fetch existing booking details from server
  const fetchExistingBooking = useCallback(
    async (bookingId: string) => {
      try {
        const response = await api.get<APIResponse<IBooking>>(
          `/booking/${bookingId}`
        );
        const booking = response.data.data;

        if (!booking) {
          throw new Error("Booking not found");
        }

        // Check if booking is still valid
        const startTime = new Date(booking.startDate).getTime();
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(15 * 60 * 1000 - elapsed, 0);

        if (remainingTime <= 0) {
          // Booking expired
          await api.delete(`/booking/${bookingId}`);
          toast.error("Booking session expired");
          bookingContext.resetBooking();
          router.back();
          return;
        }

        // Restore booking context
        bookingContext.setBookingDetails({
          id: booking.id,
          pgId: booking.pgId || pgId!,
          roomId: booking.roomId || room_id!,
          startDate: booking.startDate.toString(),
          category: room?.category,
        });
      } catch (error) {
        console.error("Failed to fetch existing booking:", error);
        // Remove invalid booking ID from URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("bookingId");
        window.history.replaceState({}, "", newUrl.toString());

        // Create new booking instead
        await createNewBooking();
      }
    },
    [bookingContext, pgId, room_id, room?.category, router]
  );

  // Create new booking
  const createNewBooking = useCallback(async () => {
    if (!room_id || !pgId || isInitializing) return;

    setIsInitializing(true);
    try {
      const init_booking = await api.post<APIResponse<IBooking>>(
        `/booking/create?room=${room_id}`
      );
      const bookingId = init_booking.data.data?.id;

      if (!bookingId) {
        throw new Error("Failed to create booking");
      }

      // Add booking ID to URL for refresh handling
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("bookingId", bookingId);
      window.history.replaceState({}, "", newUrl.toString());

      bookingContext.setBookingDetails({
        id: bookingId,
        pgId: pgId,
        roomId: room_id,
        startDate: new Date().toISOString(),
        category: room?.category,
      });

      toast.success("Booking session started");
    } catch (error) {
      console.error("Failed to create booking:", error);
      toast.error("Failed to start booking session");
      router.back();
    } finally {
      setIsInitializing(false);
    }
  }, [room_id, pgId, room?.category, bookingContext, router, isInitializing]);

  // Initialize booking when context is ready
  useEffect(() => {
    if (!bookingContext.isReady || roomLoading) return;

    const initializeBooking = async () => {
      // Check if there's an existing booking ID in URL
      if (existingBookingId && !bookingContext.bookingDetails) {
        await fetchExistingBooking(existingBookingId);
      } else if (!bookingContext.bookingDetails && !bookingContext.isLoading && bookingContext.stage!="COMPLETED") {
        // No existing booking, create new one
        await createNewBooking();
      }
    };

    initializeBooking();
  }, [
    bookingContext.isReady,
    bookingContext.bookingDetails,
    bookingContext.isLoading,
    roomLoading,
    existingBookingId,
    fetchExistingBooking,
    createNewBooking,
  ]);

  // Load room data
  useEffect(() => {
    fetchRoomData();
  }, [fetchRoomData]);

  // Handle expired bookings
  useEffect(() => {
    if (bookingContext.stage === "EXPIRED") {
      toast.error("Booking session expired");
      router.back();
    }
  }, [bookingContext.stage, router]);

  // Handle payment
  const handlePayNow = async () => {
    if (!bookingContext.bookingDetails?.id) {
      toast.error("No active booking found");
      return;
    }

    if (timeLeft <= 0) {
      toast.error("Booking session expired");
      return;
    }

    toast("Proceeding to payment...");
    try {
      await axios.put(
        `${BACKEND_BASE_URL}webhook/confirm-payment/${bookingContext.bookingDetails.id}`
      );
      bookingContext.setStage("CONFIRMATION");
      router.replace(`/book/confirm`);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error("Payment error:", error);
    }
  };

  // Show loading states
  if (bookingContext.isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading booking session...</p>
        </div>
      </div>
    );
  }

  if (roomLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Initializing booking...</p>
        </div>
      </div>
    );
  }

  // Show error state if room not found
  if (!room) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Room Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The requested room could not be found.
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  // Show error state if no booking details
  if (!bookingContext.bookingDetails) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Booking Session Error
        </h2>
        <p className="text-gray-600 mb-6">
          Could not initialize booking session.
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Bed className="text-blue-600" /> Room Details
      </h1>

      {/* Room Info Card */}
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>
            Room {room.roomNumber} - {room.category?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            <strong>Facilities:</strong>
          </p>
          <ul className="flex gap-4 text-gray-600">
            <li className="flex items-center gap-1">
              <Snowflake className="w-4 h-4" /> AC
            </li>
            <li className="flex items-center gap-1">
              <Wifi className="w-4 h-4" /> WiFi
            </li>
            <li className="flex items-center gap-1">
              <Bath className="w-4 h-4" /> Attached Bathroom
            </li>
          </ul>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <IndianRupee className="text-green-600" /> Monthly Rent:{" "}
              {room.category?.baseRent}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timer */}
      {timeLeft > 0 && (
        <Card
          className={`border-2 ${
            timeLeft < 300
              ? "border-red-200 bg-red-50"
              : "border-orange-200 bg-orange-50"
          }`}
        >
          <CardContent className="p-4">
            <div
              className={`flex items-center gap-2 font-medium ${
                timeLeft < 300 ? "text-red-600" : "text-orange-600"
              }`}
            >
              <Clock className="w-4 h-4" />
              Time remaining: {formatTime(timeLeft)}
              {timeLeft < 300 && (
                <span className="text-sm ml-2">(Hurry up!)</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expired message */}
      {timeLeft <= 0 && (
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 font-medium">
              <Clock className="w-4 h-4" />
              Booking session expired
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          onClick={handlePayNow}
          disabled={timeLeft <= 0}
        >
          {timeLeft <= 0 ? "Session Expired" : "Pay Now"}
        </Button>
      </div>
    </div>
  );
};

export default BookPgPage;
