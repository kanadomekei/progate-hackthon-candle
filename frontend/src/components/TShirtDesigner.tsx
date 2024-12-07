"use client";

import { useState } from "react";
import { PositivePrompt } from "./PositivePrompt";

import { ColorPalette } from "./ColorPalette";
import { StyleSelector } from "./DesignStyle";
import { DesignPreview } from "./DesignPreview";
import { NegativePromptSection } from "./NegativePronpt";
import Image from "next/image";

export type DesignStyle = string;
export type ColorScheme = { selectedColor: string };

export function TShirtDesigner() {
  const [selectedStyles, setSelectedStyles] = useState<DesignStyle[]>([]);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const baseURL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://w35iey431a.execute-api.us-west-2.amazonaws.com";

  const generateImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/generate-image-stable-diffusion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
          }),
        },
      );
      if (!response.ok) {
        throw new Error("画像の生成に失敗しました");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImageUrls(prev => [...prev, imageUrl]);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("画像の生成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-12 gap-8">
        {/* 左側: プロンプト、その下にカラーパレットとスタイルセレクター */}
        <div className="col-span-7 space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <PositivePrompt prompt={prompt} setPrompt={setPrompt} />
          </div>
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <NegativePromptSection
                negativePrompt={negativePrompt}
                setNegativePrompt={setNegativePrompt}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ColorPalette />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <StyleSelector
                selectedStyles={selectedStyles}
                onStyleSelect={setSelectedStyles}
              />
            </div>
          </div>
          {/* デザイン生成ボタン */}
          <button
            onClick={generateImage}
            disabled={isLoading}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "生成中..." : "画像を生成"}
          </button>
        </div>

        {/* 右側: プレビューを画像一覧表示に変更 */}
        <div className="col-span-5">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6">Generated Designs</h2>
            <DesignPreview generatedImage={generatedImageUrls} />
          </div>
        </div>
      </div>
    </div>
  );
}
