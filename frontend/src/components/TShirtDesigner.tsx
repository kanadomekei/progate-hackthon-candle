"use client";

import { useState } from "react";
import { PromptSection } from "./PromptSection";
import { NegativePromptSection } from "./NegativePronpt";
import { ColorPalette } from "./ColorPalette";
import { StyleSelector } from "./StyleSelector";
import { TShirtPreview } from "./TShirtPreview";

export type DesignStyle = string
export type ColorScheme = {selectedColor: string;};


export function TShirtDesigner() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<DesignStyle[]>([]);
  const [generatedImageUrls] = useState<string[]>([]);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [prompt, setPrompt] = useState("");

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-12 gap-8">
        {/* 左側: プロンプト、その下にカラーパレットとスタイルセレクター */}
        <div className="col-span-7 space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <PromptSection
              prompt={prompt}
              setPrompt={setPrompt}
            />
          </div>
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <NegativePromptSection 
                negativePrompt={negativePrompt}
                setNegativePrompt={setNegativePrompt}
              />
            </div>
          </div>
            {/* デザイン生成ボタン */}
            <div className="bg-white rounded-lg shadow-lg p-6">
            <button
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400"
            >
              {isGenerating ? "create design..." : "create design"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ColorPalette/>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <StyleSelector
                selectedStyles={selectedStyles}
                onStyleSelect={setSelectedStyles}/>
            </div>
          </div>
        </div>

        {/* 右側: Tシャツプレビュー */}
        <div className="col-span-5">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6">Design Preview</h2>
            <TShirtPreview generatedImage={generatedImageUrls} />
          </div>
        </div>
      </div>
    </div>
  );
}
