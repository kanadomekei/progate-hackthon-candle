"use client";

import { ImageCrop } from "@/components/crop/ImageCrop";
import { useSearchParams } from "next/navigation";

export default function CropPage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('image');

  if (!imageUrl) {
    return <div>画像が選択されていません</div>;
  }

  return <ImageCrop imagePath={imageUrl} />;
}
