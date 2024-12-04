"use client";

import { ColorScheme } from "./TShirtDesigner";

interface ColorPaletteProps {
  selectedColors: ColorScheme;
  onColorSelect: (colors: ColorScheme, promptText: string) => void;
}

const COLOR_SCHEMES: (ColorScheme & { promptText: string })[] = [
  {
    name: "Classic",
    primary: "#ffffff",
    secondary: "#000000",
    accent: "#ff0000",
    promptText: "シンプルでクラシックなデザイン、白地に黒のアクセントと赤のポイント",
  },
  {
    name: "Ocean",
    primary: "#e3f2fd",
    secondary: "#1976d2",
    accent: "#004ba0",
    promptText: "爽やかな海をイメージした青系のグラデーション、波のような曲線を取り入れたデザイン",
  },
  {
    name: "Forest",
    primary: "#e8f5e9",
    secondary: "#388e3c",
    accent: "#00600f",
    promptText: "自然な緑の色合いを使用し、森や葉をモチーフにした癒しのデザイン",
  },
  {
    name: "Sunset",
    primary: "#fff3e0",
    secondary: "#f57c00",
    accent: "#bb4d00",
    promptText: "夕暮れをイメージした暖かみのあるオレンジ系のグラデーション、太陽や光をモチーフにしたデザイン",
  },
  {
    name: "Monochrome",
    primary: "#f5f5f5",
    secondary: "#616161",
    accent: "#212121",
    promptText: "モノトーンでミニマルな幾何学模様、シンプルでモダンなデザイン",
  },
];

export function ColorPalette({
  selectedColors,
  onColorSelect,
}: ColorPaletteProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Color Palette</h2>

      <div className="grid grid-cols-2 gap-3">
        {COLOR_SCHEMES.map((scheme) => (
          <button
            key={scheme.name}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedColors.name === scheme.name
                ? "border-blue-500 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onColorSelect(scheme, scheme.promptText)}
          >
            <span className="block text-sm font-medium mb-2">
              {scheme.name}
            </span>
            <div className="flex space-x-2">
              <div
                className="w-8 h-8 rounded-full border border-gray-200"
                style={{ backgroundColor: scheme.primary }}
              />
              <div
                className="w-8 h-8 rounded-full border border-gray-200"
                style={{ backgroundColor: scheme.secondary }}
              />
              <div
                className="w-8 h-8 rounded-full border border-gray-200"
                style={{ backgroundColor: scheme.accent }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
