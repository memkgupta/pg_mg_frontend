"use client";

import { useState } from "react";
import PgBasicInfoForm from "@/components/features/dashboard/pg-details/PgBasicInfoForm";
import PgOwnerInfoForm from "@/components/features/dashboard/pg-details/PgOwnerInfoForm";
import PgAddressForm from "@/components/features/dashboard/pg-details/PgAddressForm";
import PgAmenitiesForm from "@/components/features/dashboard/pg-details/PgAmenities";
import PgGalleryForm from "@/components/features/dashboard/pg-details/PgGalleryForm";
import { Button } from "@/components/ui/button";
import { PgImage } from "@/types/index";
import PgDetailsProvider from "@/context/PgDetailsContext";
import SaveDetailsButton from "@/components/features/dashboard/pg-details/SaveDetailsButton";


interface PgDetails {
  id: string;
  name: string;
  description?: string;
  ownerName?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  amenities?: string[];
  images: PgImage[];
}

export default function PgDetailsPage() {


 

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
   
         <PgBasicInfoForm
       
      />
      <PgOwnerInfoForm
      
      />
      <PgAddressForm
       
      />
      <PgAmenitiesForm />
      <PgGalleryForm
    
      />
      <div className="flex justify-end">
        <SaveDetailsButton />      </div>

      
    </div>
  );
}
