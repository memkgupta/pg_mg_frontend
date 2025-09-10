

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Home, BedDouble, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-white">PG Stay</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Find your perfect Paying Guest accommodation with comfort, security,
            and convenience — all at one place.
          </p>
          <Link href={"/pg"}
            
            className="bg-white p-2 rounded-md text-green-700 font-semibold hover:bg-green-100"
          >
            Explore Rooms
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-700">
          Why Choose Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-md">
            <CardContent className="p-6 text-center">
              <Home className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Comfortable Stays</h3>
              <p className="text-gray-600">
                Fully furnished rooms with all basic amenities to make your stay
                cozy and pleasant.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-6 text-center">
              <BedDouble className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Affordable Rent</h3>
              <p className="text-gray-600">
                Choose from multiple categories of rooms at pocket-friendly
                prices without compromise.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                Your safety is our priority with 24x7 security and verified
                accommodations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-green-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-700">
            Amenities We Offer
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "High-Speed WiFi",
              "Daily Housekeeping",
              "Laundry Facilities",
              "24x7 Water & Power",
              "Nutritious Food",
              "Recreational Spaces",
            ].map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <span className="text-gray-700 text-lg">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-700">
          Ready to Book Your Stay?
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover affordable and comfortable PG accommodations tailored to your
          needs. Book now and make your stay hassle-free.
        </p>
        <Button
          size="lg"
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Get Started
        </Button>
      </section>
    </div>
  );
}
