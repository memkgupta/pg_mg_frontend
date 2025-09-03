"use client";
import { BACKEND_BASE_URL } from '@/constants';
import { useBooking } from '@/context/BookingContext';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw, 
  AlertTriangle,
  Home,
  Calendar
} from 'lucide-react';

type ConfirmationState = 
  | 'loading'
  | 'confirming' 
  | 'success' 
  | 'failed' 
  | 'no-booking'
  | 'retrying';

const ConfirmBooking = () => {
  const router = useRouter();
  const bookingContext = useBooking();
  
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>('loading');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string>('');

  // Handle cases where there's no booking context or details
  const handleNoBooking = useCallback(() => {
    setConfirmationState('no-booking');
    toast.error("No booking found to confirm");
    // Don't immediately redirect - let user see the error state
  }, []);

  // Confirm booking with retries
  const confirmBooking = useCallback(async () => {
    if (!bookingContext.bookingDetails?.id) {
      handleNoBooking();
      return;
    }

    setConfirmationState('confirming');
    setError('');
    
    let success = false;
    let tries = 0;
    const maxRetries = 4;

    while (!success && tries < maxRetries) {
      tries++;
      setAttempts(tries);
      
      if (tries > 1) {
        setConfirmationState('retrying');
      }

      try {
        const { data } = await api.get(
          `/booking/confirm/${bookingContext.bookingDetails.id}`
        );

        if (data?.success === true) {
          success = true;
          setConfirmationState('success');
          toast.success("Booking confirmed successfully! 🎉");
          
          // Clean up booking context
          bookingContext.clearStorage();
          bookingContext.resetBooking();
          
          // Redirect to success page after a short delay
          setTimeout(() => {
            router.replace('/book/booking-success');
          }, 2000);
          
          return;
        } else {
          throw new Error(data?.message || 'Confirmation failed');
        }
      } catch (err: any) {
        console.error(`Confirmation attempt ${tries} failed:`, err);
        setError(err?.response?.data?.message || err.message || 'Unknown error');
        
        // Wait before next retry (exponential backoff)
        if (tries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, tries * 1000));
        }
      }
    }

    // If we exhausted all retries
    if (!success) {
      setConfirmationState('failed');
      const errorMsg = `Booking confirmation failed after ${maxRetries} attempts`;
      toast.error(errorMsg);
      setError(error || errorMsg);
    }
  }, [bookingContext, router, handleNoBooking, error]);

  // Initialize confirmation process
  useEffect(() => {
    // Wait for booking context to be ready
    if (!bookingContext.isReady) {
      return;
    }

    // Check if we have booking details
    if (!bookingContext.bookingDetails?.id) {
      handleNoBooking();
      return;
    }

    // Set stage to confirmation
    bookingContext.setStage("CONFIRMATION");
    
    // Start confirmation process
    confirmBooking();
  }, [bookingContext.isReady, bookingContext.bookingDetails?.id, confirmBooking, handleNoBooking]);

  // Handle retry
  const handleRetry = () => {
    setAttempts(0);
    setError('');
    
    setConfirmationState('loading');
  };

  // Handle navigation
  const handleGoHome = () => {
    bookingContext.resetBooking();
    router.replace('/');
  };

  const handleGoToBookings = () => {
    bookingContext.resetBooking();
    router.replace('/my-bookings');
  };

  // Render different states
  const renderContent = () => {
    switch (confirmationState) {
      case 'loading':
        return (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Initializing...</h2>
            <p className="text-gray-600">Please wait while we prepare your booking confirmation</p>
          </div>
        );

      case 'confirming':
        return (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Confirming Your Booking</h2>
            <p className="text-gray-600 mb-4">
              Please wait while we process your booking confirmation...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>Attempt {attempts} of 4</span>
            </div>
          </div>
        );

      case 'retrying':
        return (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-orange-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Retrying Confirmation</h2>
            <p className="text-gray-600 mb-4">
              Previous attempt failed, retrying automatically...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-orange-600">
              <span>Attempt {attempts} of 4</span>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-green-800">Booking Confirmed! 🎉</h2>
            <p className="text-gray-600 mb-6">
              Your booking has been successfully confirmed. You will be redirected shortly.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleGoToBookings} className="bg-green-600 hover:bg-green-700">
                <Calendar className="w-4 h-4 mr-2" />
                View My Bookings
              </Button>
              <Button onClick={handleGoHome} variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-800">Confirmation Failed</h2>
            <p className="text-gray-600 mb-4">
              We couldn't confirm your booking after {attempts} attempts.
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={handleGoHome} variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        );

      case 'no-booking':
        return (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-yellow-800">No Booking Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any booking to confirm. This might happen if your booking session expired or was already processed.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.replace('/rooms')} className="bg-blue-600 hover:bg-blue-700">
                Browse Rooms
              </Button>
              <Button onClick={handleGoHome} variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmBooking;