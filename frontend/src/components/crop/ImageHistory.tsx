'use client';

import Image from 'next/image';
import { CroppedImage } from '@/components/crop/types';

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
  onDeleteImage
}: ImageHistoryProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">切り取った画像一覧</h3>
      {croppedImages.length === 0 ? (
        <p className="text-gray-500">まだ切り取った画像はありません</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {croppedImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-sm p-4">
              <Image 
                src={image.dataUrl} 
                alt="切り取った画像"
                width={300}
                height={200}
                className="w-full h-48 object-contain mb-4 cursor-pointer"
                onClick={() => onImageSelect(image)}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {image.timestamp.toLocaleString()}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onDownloadImage(image)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md
                              text-sm transition-colors duration-200"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => onDeleteImage(image.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md
                              text-sm transition-colors duration-200"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 