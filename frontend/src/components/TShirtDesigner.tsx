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
  minimal: "Create a minimal design using simple lines and shapes",
  art: "Design an artistic pattern with bold and expressive elements",
  illustration: "Generate a detailed illustration with creative drawing",
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
  const [generatedImageUrl, setGeneratedImageUrl] = useState<
    string | undefined
  >(undefined);
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleColorSelect = (_colors: ColorScheme, promptText: string) =>
    setPrompt(promptText);

  const handleStyleSelect = (style: DesignStyle) => {
    setSelectedStyle(style);
    setPrompt(STYLE_PROMPTS[style]);
  };

  const generateImage = async () => {
    setIsGenerating(true);
    console.log("Generating image with prompt:", prompt);
    try {
      const response = await fetch(
        `${baseURL}/generate-image-stable-diffusion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        },
      );

      if (!response.ok) throw new Error("Failed to generate image");

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-12 gap-8">
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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <button
              onClick={generateImage}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400"
            >
              {isGenerating ? "Generating design..." : "Generate design"}
            </button>
          </div>
        </div>
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
