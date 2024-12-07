"use client";

import { ImageCrop } from "@/components/crop/ImageCrop";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CropContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("image");

  if (!imageUrl) {
    return <div>画像が選択されていません</div>;
  }

  return <ImageCrop imagePath={imageUrl} />;
}

export default function CropPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <CropContent />
    </Suspense>
  );
}
