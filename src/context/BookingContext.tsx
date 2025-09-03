"use client";
import api from "@/services/api";
import { IRoomCategory } from "@/types";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";

// Booking stages
export type BookingStage =
  | "ROOM_DETAILS"
  | "TERMS"
  | "PAYMENT"
  | "CONFIRMATION"
  | "EXPIRED"
  |"COMPLETED"
  | "CANCELLED";

// Booking data interface
export interface BookingDetails {
  id?: string;
  roomId: string;
  pgId: string;
  category?: IRoomCategory;
  startDate: string;
}

// Context state
interface BookingContextState {
  stage: BookingStage;
  bookingDetails: BookingDetails | null;
  isLoading: boolean;
  isReady: boolean;
  setStage: (stage: BookingStage) => void;
  setBookingDetails: (details: BookingDetails) => void;
  resetBooking: () => void;
  cancelBooking: () => void;
  clearStorage: () => void;
}

const STORAGE_KEY = "booking_state";
const BOOKING_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

const BookingContext = createContext<BookingContextState | undefined>(
  undefined
);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [stage, setStage] = useState<BookingStage>("ROOM_DETAILS");
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Clear storage utility
  const clearStorage = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear session storage:", error);
    }
  }, []);

  // Save state to sessionStorage
  const saveToStorage = useCallback((stageToSave: BookingStage, detailsToSave: BookingDetails | null) => {
    if (!detailsToSave) return;

    try {
      const dataToStore = {
        stage: stageToSave,
        bookingDetails: detailsToSave,
        savedAt: Date.now(),
      };
      
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.warn("Failed to save to session storage:", error);
    }
  }, []);

  // Load state from sessionStorage on mount
  useEffect(() => {
    const loadFromStorage = async () => {
      setIsLoading(true);
      
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        
        if (stored) {
          const parsed = JSON.parse(stored) as {
            stage: BookingStage;
            bookingDetails: BookingDetails;
            savedAt: number;
          };

          // Calculate if booking is still valid
          const bookingStartTime = new Date(parsed.bookingDetails.startDate).getTime();
          const elapsed = Date.now() - bookingStartTime;
          const isExpired = elapsed >= BOOKING_TIMEOUT;

          if (isExpired) {
            // Booking expired, clean up
            setStage("EXPIRED");
            setBookingDetails(null);
            clearStorage();
            
            // Try to cancel the booking on the server
            if (parsed.bookingDetails.id) {
              try {
                await api.delete(`/booking/${parsed.bookingDetails.id}`);
              } catch (error) {
                console.warn("Failed to cancel expired booking:", error);
              }
            }
          } else {
            // Booking is still valid, restore state
            setStage(parsed.stage);
            setBookingDetails(parsed.bookingDetails);
          }
        }
      } catch (err) {
        console.error("Failed to load booking state:", err);
        clearStorage();
      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    };

    loadFromStorage();
  }, [clearStorage]);

  // Save to storage whenever state changes
  useEffect(() => {
    if (!isReady || isLoading) return;
    
    if (bookingDetails && stage !== "EXPIRED" && stage !== "CANCELLED") {
      saveToStorage(stage, bookingDetails);
    } else if (stage === "EXPIRED" || stage === "CANCELLED") {
      clearStorage();
    }
  }, [stage, bookingDetails, isReady, isLoading, saveToStorage, clearStorage]);

  // Enhanced setBookingDetails with automatic saving
  const handleSetBookingDetails = useCallback((details: BookingDetails) => {
    setBookingDetails(details);
    // The useEffect above will handle saving to storage
  }, []);

  // Enhanced setStage with automatic saving
  const handleSetStage = useCallback((newStage: BookingStage) => {
    setStage(newStage);
    // The useEffect above will handle saving to storage
  }, []);

  // Cancel booking function
  const cancelBooking = useCallback(async () => {
    if (!bookingDetails) return;

    try {
      setIsLoading(true);
      
      // Cancel on server if booking has an ID
      if (bookingDetails.id) {
        await api.delete(`/booking/${bookingDetails.id}`);
      }
      
      // Update local state
      setStage("CANCELLED");
      setBookingDetails(null);
      clearStorage();
      
      toast.success("Booking cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setIsLoading(false);
    }
  }, [bookingDetails, clearStorage]);

  // Reset booking function
  const resetBooking = useCallback(() => {
    setBookingDetails(null);
    setStage("ROOM_DETAILS");
    clearStorage();
  }, [clearStorage]);

  // Calculate remaining time for current booking
  const getRemainingTime = useCallback((): number => {
    if (!bookingDetails?.startDate) return 0;
    
    const startTime = new Date(bookingDetails.startDate).getTime();
    const elapsed = Date.now() - startTime;
    return Math.max(BOOKING_TIMEOUT - elapsed, 0);
  }, [bookingDetails]);

  // Auto-expire booking when time runs out
  useEffect(() => {
    if (!bookingDetails || !isReady) return;

    const remainingTime = getRemainingTime();
    
    if (remainingTime <= 0) {
      setStage("EXPIRED");
      setBookingDetails(null);
      clearStorage();
      toast.error("Booking session expired");
      return;
    }

    // Set timeout for when booking expires
    const timeoutId = setTimeout(() => {
      setStage("EXPIRED");
      setBookingDetails(null);
      clearStorage();
      toast.error("Booking session expired");
      
      // Try to cancel on server
      if (bookingDetails.id) {
        api.delete(`/booking/${bookingDetails.id}`).catch(console.warn);
      }
    }, remainingTime);

    return () => clearTimeout(timeoutId);
  }, [bookingDetails, isReady, getRemainingTime, clearStorage]);

  const contextValue: BookingContextState = {
    stage,
    bookingDetails,
    isLoading,
    isReady,
    setStage: handleSetStage,
    setBookingDetails: handleSetBookingDetails,
    resetBooking,
    cancelBooking,
    clearStorage,
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextState => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

// Hook to get remaining booking time in seconds
export const useBookingTimer = () => {
  const { bookingDetails, isReady } = useBooking();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!bookingDetails?.startDate || !isReady) {
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const startTime = new Date(bookingDetails.startDate).getTime();
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(Math.floor((BOOKING_TIMEOUT - elapsed) / 1000), 0);
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [bookingDetails, isReady]);

  return timeLeft;
};