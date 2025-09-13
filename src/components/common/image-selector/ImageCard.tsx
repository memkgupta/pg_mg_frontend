"use client"
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { SelectedImage } from "./types";

interface ImageCardProps {
  img: SelectedImage;
  onRemove: (id: string) => void;
  onReplace: (id: string, file: File) => void;
}

export function ImageCard({ img, onRemove, onReplace }: ImageCardProps) {
  const ref = useRef<HTMLInputElement | null>(null);

  const handleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!img.id) return;
    onReplace(img.id, e.target.files[0]);
  };

  const handleRemove = () => {
    if (img.id) {
      onRemove(img.id);
    }
  };

  return (
    <div className="relative border rounded-md overflow-hidden">
      <img
        src={img.url}
        alt={img.name ?? "image"}
        className="object-cover w-full h-40"
      />
      <div className="absolute inset-0 flex items-end justify-between p-2 bg-gradient-to-t from-black/40 to-transparent">
        <div className="text-xs text-white truncate max-w-[70%]">
          {img.name}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={handleRemove}>
            Remove
          </Button>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleReplace}
          />
          <Button size="sm" variant="ghost" onClick={() => ref.current?.click()}>
            Replace
          </Button>
        </div>
      </div>
    </div>
  );
}