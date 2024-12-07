"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  if (!generatedImage || generatedImage.length === 0) {
    return null;
  }

  const handleCropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage) {
      router.push(`/crop?image=${encodeURIComponent(selectedImage)}`);
    }
  };

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
            <div className="mt-4 flex justify-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={handleCropClick}
              >
                服の型に切り取る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
