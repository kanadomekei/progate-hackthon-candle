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
    promptText:
      "A simple and classic design with a white base, black accents, and red highlights",
  },
  {
    name: "Ocean",
    primary: "#e3f2fd",
    secondary: "#1976d2",
    accent: "#004ba0",
    promptText:
      "A refreshing ocean-inspired blue gradient design with wave-like curves",
  },
  {
    name: "Forest",
    primary: "#e8f5e9",
    secondary: "#388e3c",
    accent: "#00600f",
    promptText:
      "A soothing design using natural green tones, inspired by forests and leaves",
  },
  {
    name: "Sunset",
    primary: "#fff3e0",
    secondary: "#f57c00",
    accent: "#bb4d00",
    promptText:
      "A warm orange gradient design inspired by sunsets, featuring sun and light motifs",
  },
  {
    name: "Monochrome",
    primary: "#f5f5f5",
    secondary: "#616161",
    accent: "#212121",
    promptText:
      "A minimalist monochrome geometric pattern, simple and modern design",
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
