"use client";

import { useState } from "react";

export function TestComponent() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/generate-image-stable-diffusion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "A beautiful landscape with mountains",
        }),
      });

      if (!response.ok) {
        throw new Error("画像の生成に失敗しました");
      }

      // レスポンスをBlobとして取得
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("画像の生成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 mb-8 bg-white rounded-lg shadow">
      <button
        onClick={generateImage}
        disabled={isLoading}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? "生成中..." : "画像を生成"}
      </button>

      {imageUrl && (
        <div className="mt-4 flex justify-center">
          <img src={imageUrl} alt="Generated" className="max-w-[300px] h-auto" />
        </div>
      )}
    </div>
  );
} 