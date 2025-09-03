"use client";
import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface IReview {
  id: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export function ReviewCarousel() {
  const reviews: IReview[] = [
    { id: "r1", userName: "Aman Sharma", rating: 5, comment: "Absolutely loved staying here! Clean rooms and friendly staff.", createdAt: "2025-08-28T10:15:00Z" },
    { id: "r2", userName: "Neha Verma", rating: 4, comment: "Nice facilities and good AC. WiFi could be better.", createdAt: "2025-08-26T12:30:00Z" },
    { id: "r3", userName: "Rohit Singh", rating: 3, comment: "Decent PG but a bit noisy during evenings.", createdAt: "2025-08-24T09:45:00Z" },
    { id: "r4", userName: "Priya Jain", rating: 5, comment: "Super clean rooms and the gym is amazing!", createdAt: "2025-08-22T14:20:00Z" },
    { id: "r5", userName: "Vikram Patel", rating: 2, comment: "Rooms are okay but food and maintenance need improvement.", createdAt: "2025-08-20T18:05:00Z" },
    { id: "r6", userName: "Sana Ali", rating: 4, comment: "Great location and easy access to public transport.", createdAt: "2025-08-18T16:50:00Z" },
    { id: "r7", userName: "Karan Mehta", rating: 5, comment: "Highly recommended! Safe and comfortable environment.", createdAt: "2025-08-15T11:10:00Z" },
    { id: "r8", userName: "Anjali Rao", rating: 3, comment: "Rooms are fine, but the internet is slow sometimes.", createdAt: "2025-08-12T08:30:00Z" },
  ];

  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current]);

  // optional: cleanup autoplay on unmount
  useEffect(() => {
    const current = autoplay.current;
    return () => current.stop();
  }, []);

  if (!reviews.length) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex-none w-80 select-none">
            <Card className="p-4 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {review.userName}
                  <span className="flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400" />
                    ))}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
