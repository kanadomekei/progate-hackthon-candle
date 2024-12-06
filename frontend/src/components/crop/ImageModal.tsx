"use client";

import Image from "next/image";
import { CroppedImage } from "./types";

interface ImageModalProps {
  selectedImage: CroppedImage;
  onClose: () => void;
  onDownload: (image: CroppedImage) => void;
  onDelete: (id: string) => void;
}

export function ImageModal({
  selectedImage,
  onClose,
  onDownload,
  onDelete,
}: ImageModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-5xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">切り取った画像の確認</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="bg-gray-100 rounded-lg p-4">
          <Image
            src={selectedImage.dataUrl}
            alt="拡大表示"
            width={1200}
            height={900}
            className="max-h-[70vh] w-full object-contain"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={() => onDelete(selectedImage.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            削除
          </button>
          <button
            onClick={() => onDownload(selectedImage)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            ダウンロード
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
