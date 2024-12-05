"use client";

import { useState } from "react";
import { PromptSection } from "./PromptSection";
import { ColorPalette } from "./ColorPalette";
import { StyleSelector } from "./StyleSelector";
import { TShirtPreview } from "./TShirtPreview";

export type DesignStyle = "minimal" | "art" | "illustration";
export type ColorScheme = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
};

const STYLE_PROMPTS = {
  minimal: "シンプルな線とフォルムを使用したミニマルなデザインを作成",
  art: "大胆で表現力豊かな要素を持つアート的なパターンをデザイン",
  illustration: "創造的な描画による詳細なイラストを生成",
};

export function TShirtDesigner() {
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>("minimal");
  const [selectedColors] = useState<ColorScheme>({
    name: "Default",
    primary: "#ffffff",
    secondary: "#000000",
    accent: "#ff0000",
  });
  const [prompt, setPrompt] = useState(STYLE_PROMPTS.minimal);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>();

  const handleColorSelect = (_colors: ColorScheme, promptText: string) => {
    setPrompt(promptText);
  };

  const handleStyleSelect = (style: DesignStyle) => {
    setSelectedStyle(style);
    setPrompt(STYLE_PROMPTS[style]);
  };

  const handleGenerateDesign = async () => {
    try {
      setIsGenerating(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 仮の遅延
      setGeneratedImageUrl("/sample2.png");
    } catch (error) {
      console.error("Error generating design:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-12 gap-8">
        {/* 左側: プロンプト、その下にカラーパレットとスタイルセレクター */}
        <div className="col-span-7 space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <PromptSection prompt={prompt} onPromptChange={setPrompt} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ColorPalette
                selectedColors={selectedColors}
                onColorSelect={handleColorSelect}
              />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <StyleSelector
                selectedStyle={selectedStyle}
                onStyleSelect={handleStyleSelect}
              />
            </div>
          </div>
          {/* デザイン生成ボタン */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <button
              onClick={handleGenerateDesign}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400"
            >
              {isGenerating ? "create design..." : "create design"}
            </button>
          </div>
        </div>

        {/* 右側: Tシャツプレビュー */}
        <div className="col-span-5">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6">Design Preview</h2>
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <TShirtPreview generatedImageUrl={generatedImageUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
