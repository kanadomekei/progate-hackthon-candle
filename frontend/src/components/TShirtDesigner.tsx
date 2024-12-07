"use client";

import { useState } from "react";
import { PositivePrompt } from "./PositivePrompt";
import { ThemeColorSelector } from "./ThemeColorSelector";
import { DesignPreview } from "./DesignPreview";
import { SamplePrompt } from "./SamplePrompt";

export type ThemeColor = {
  name: string;
  prompt: string;
};

// モデルタイプの型定義を追加
type ModelType = 'nova' | 'stable-diffusion';

export function TShirtDesigner() {
  const [selectedThemeColor, setSelectedThemeColor] =
    useState<ThemeColor | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>('stable-diffusion');

  const [isLoading, setIsLoading] = useState(false);
  const baseURL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://w35iey431a.execute-api.us-west-2.amazonaws.com";

  const generateImage = async () => {
    setIsLoading(true);
    try {
      // エンドポイントをモデルに基づいて決���
      const endpoint = selectedModel === 'nova' 
        ? `${baseURL}/generate-image-stable-diffusion`
        : `${baseURL}/generate-image-stable-diffusion`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });
      if (!response.ok) {
        throw new Error("画像の生成に失敗しました");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImageUrls((prev) => [...prev, imageUrl]);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("画像の生成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // プロンプトを更新する関数
  const updatePrompt = (newPrompt: string) => {
    let finalPrompt = newPrompt;
    if (selectedThemeColor) {
      finalPrompt = `${newPrompt}, ${selectedThemeColor.prompt}`;
    }
    setPrompt(finalPrompt);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-7 space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">モデルを選択</h3>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="stable-diffusion"
                  checked={selectedModel === 'stable-diffusion'}
                  onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                  className="mr-2"
                />
                Stable Diffusion
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="nova"
                  checked={selectedModel === 'nova'}
                  onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                  className="mr-2"
                />
                Nova
              </label>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <PositivePrompt prompt={prompt} setPrompt={setPrompt} />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <SamplePrompt onPromptSelect={setPrompt} />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ThemeColorSelector
              selectedThemeColor={selectedThemeColor}
              onThemeColorSelect={(color) => {
                setSelectedThemeColor(color);
                if (color) {
                  updatePrompt(prompt);
                }
              }}
            />
          </div>
          <button
            onClick={generateImage}
            disabled={isLoading}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "生成中..." : "画像を生成"}
          </button>
        </div>

        <div className="col-span-5">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6">Generated Designs</h2>
            <DesignPreview
              generatedImage={generatedImageUrls}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
