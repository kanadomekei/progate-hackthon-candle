"use client";

import { ThemeColor } from "./TShirtDesigner";

interface ThemeColorSelectorProps {
  selectedThemeColor: ThemeColor | null;
  onThemeColorSelect: (color: ThemeColor) => void;
}

const THEME_COLORS: ThemeColor[] = [
  {
    name: "Monochrome",
    prompt: "monochrome color scheme, black and white tones, grayscale design",
  },
  {
    name: "Pastel",
    prompt: "soft pastel colors, gentle and soothing color palette, light and airy tones",
  },
  {
    name: "Vivid",
    prompt: "vibrant and bold colors, high saturation, energetic color scheme",
  },
  {
    name: "Earth Tones",
    prompt: "earth tones, natural colors, warm browns, sage greens, terracotta, organic palette",
  },
  {
    name: "Neon",
    prompt: "neon colors, bright fluorescent tones, electric color palette, glowing effect",
  },
  {
    name: "Vintage",
    prompt: "vintage color palette, muted and faded tones, retro color scheme, aged appearance",
  },
  {
    name: "Coastal",
    prompt: "coastal colors, ocean blues, sandy beiges, seafoam greens, beach inspired palette",
  },
  {
    name: "Forest",
    prompt: "forest colors, deep emerald greens, rich browns, woodland color palette, natural dark tones",
  }
];

export function ThemeColorSelector({
  selectedThemeColor,
  onThemeColorSelect,
}: ThemeColorSelectorProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Color Theme</h2>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {THEME_COLORS.map((color) => (
          <button
            key={color.name}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedThemeColor?.name === color.name
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onThemeColorSelect(color)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{color.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 