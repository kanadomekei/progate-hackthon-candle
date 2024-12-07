"use client";

import { ThemeColor } from "./TShirtDesigner";

interface ThemeColorSelectorProps {
  selectedThemeColor: ThemeColor | null;
  onThemeColorSelect: (color: ThemeColor) => void;
}

const THEME_COLORS: ThemeColor[] = [
  {
    name: "Monochrome",
    prompt: "create a minimalist design using only black, white, and grayscale tones. Focus on clean lines and geometric shapes",
  },
  {
    name: "Pastel",
    prompt: "design with soft, light pastel colors that create a gentle and dreamy atmosphere. Include rounded shapes and flowing elements",
  },
  {
    name: "Vivid",
    prompt: "create an eye-catching design with bold, saturated colors. Incorporate dynamic patterns and striking contrasts",
  },
  {
    name: "Earth Tones",
    prompt: "design using warm, natural earth-inspired colors. Include organic shapes and textures that reflect nature",
  },
  {
    name: "Neon",
    prompt: "create a modern, urban design with bright neon colors. Include bold typography and contemporary graphic elements",
  },
  {
    name: "Vintage",
    prompt: "design with a nostalgic feel using faded, muted colors. Include retro typography and classic design elements from the past",
  },
  {
    name: "Coastal",
    prompt: "create a relaxed, beach-inspired design using ocean blues and sandy neutrals. Include wave-like patterns and coastal motifs",
  },
  {
    name: "Forest",
    prompt: "design using deep forest greens and rich natural tones. Include botanical elements and woodland-inspired patterns",
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