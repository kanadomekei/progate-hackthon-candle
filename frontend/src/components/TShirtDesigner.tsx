"use client";

import { useState } from "react";
import { PromptSection } from "./PromptSection";
import { ColorPalette } from "./ColorPalette";
import { StyleSelector } from "./StyleSelector";
import { TShirtPreview } from "./TShirtPreview";
import { DesignVariations } from "./DesignVariations";

export type DesignStyle = "minimal" | "art" | "illustration";
export type ColorScheme = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
};

const STYLE_PROMPTS = {
  minimal: "Create a minimalist design with clean lines and simple shapes",
  art: "Design an artistic pattern with bold and expressive elements",
  illustration: "Generate a detailed illustration with creative drawings",
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

  const handleColorSelect = (_colors: ColorScheme, promptText: string) => {
    setPrompt(promptText);
  };

  const handleStyleSelect = (style: DesignStyle) => {
    setSelectedStyle(style);
    setPrompt(STYLE_PROMPTS[style]);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-row gap-8">
        {/* 左側: Tシャツプレビュー */}
        <div className="w-1/3">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6 space-y-6">
            <TShirtPreview style={selectedStyle} colors={selectedColors} />
            <TShirtPreview style={selectedStyle} colors={selectedColors} />
          </div>
        </div>

        {/* 右側: コントロールパネル */}
        <div className="w-2/3 grid grid-cols-2 gap-6">
          {/* 右側左列: プロンプトとカラーパレット */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <PromptSection prompt={prompt} onPromptChange={setPrompt} />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <ColorPalette
                selectedColors={selectedColors}
                onColorSelect={handleColorSelect}
              />
            </div>
          </div>

          {/* 右側右列: スタイルセレクターとデザインバリエーション */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <StyleSelector
                selectedStyle={selectedStyle}
                onStyleSelect={handleStyleSelect}
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <DesignVariations />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
