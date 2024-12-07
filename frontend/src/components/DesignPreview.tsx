"use client";

import Image from "next/image";

interface DesignPreviewProps {
  generatedImage: string[];
  selectedImage: string | null;
  onImageSelect: (url: string | null) => void;
}

export function DesignPreview({
  generatedImage,
  selectedImage,
  onImageSelect,
}: DesignPreviewProps) {
  if (!generatedImage || generatedImage.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generatedImage.map((url, index) => (
          <Image
            key={index}
            src={url}
            alt={`Generated T-shirt design ${index + 1}`}
            width={200}
            height={200}
            className="w-full h-auto rounded-lg cursor-pointer"
            onClick={() => onImageSelect(url)}
          />
        ))}
      </div>

      {/* モーダルウィンドウ */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => onImageSelect(null)}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Selected T-shirt design"
              width={400}
              height={533}
              className="w-full h-auto rounded-lg max-w-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
