"use client";

import Image from "next/image";
import { CroppedImage } from "./types";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";

interface ImageHistoryProps {
  croppedImages: CroppedImage[];
  onImageSelect: (image: CroppedImage) => void;
  onDownloadImage: (image: CroppedImage) => void;
  onDeleteImage: (id: string) => void;
}

export function ImageHistory({
  croppedImages,
  onImageSelect,
  onDownloadImage,
  onDeleteImage,
}: ImageHistoryProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        切り取った画像一覧
      </h3>
      {croppedImages.length === 0 ? (
        <p className="text-gray-500">まだ切り取った画像はありません</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {croppedImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-sm p-4">
              <Image
                src={image.dataUrl}
                alt="切り取った画像"
                width={300}
                height={200}
                className="w-full h-48 object-contain cursor-pointer mb-2"
                onClick={() => onImageSelect(image)}
              />
              <div className="flex justify-between mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadImage(image)}
                  className="flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteImage(image.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
