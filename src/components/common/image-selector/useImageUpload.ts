import { useState } from "react";
import { genUploader } from "uploadthing/client";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { SelectedImage } from "./types";
import { cryptoRandomId } from "./utils";

const { uploadFiles } = genUploader<OurFileRouter>();

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<SelectedImage> => {
    setIsUploading(true);
    try {
      const response = await uploadFiles("imageUploader", {
        files: [file],
      });

      return {
        local_id: cryptoRandomId(),
        url: response[0].ufsUrl,
        name: response[0].name,
        size: file.size,
      };
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
}
