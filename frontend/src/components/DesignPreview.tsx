"use client";

import { useState } from "react";
import Image from "next/image";

interface DesignPreviewProps {
  generatedImage: string[];
}

export function DesignPreview({ generatedImage }: DesignPreviewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {generatedImage && generatedImage.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generatedImage.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={`Generated T-shirt design ${index + 1}`}
              width={200}
              height={200}
              className="w-full h-auto rounded-lg cursor-pointer"
              onClick={() => handleImageClick(url)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">まだ画像が生成されていません</p>
      )}

      {/* モーダルウィンドウ */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg p-4">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            ></button>
            <Image
              src={selectedImage}
              alt="Selected T-shirt design"
              width={800}
              height={1067}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
