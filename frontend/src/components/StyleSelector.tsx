"use client";

import { DesignStyle } from "./TShirtDesigner";

interface StyleSelectorProps {
  selectedStyle: DesignStyle;
  onStyleSelect: (style: DesignStyle) => void;
}

const DESIGN_STYLES = [
  {
    id: "minimal" as DesignStyle,
    name: "Minimal",
    description: "Clean, simple designs with modern aesthetics",
    icon: "◯",
  },
  {
    id: "art" as DesignStyle,
    name: "Art",
    description: "Expressive, artistic designs with bold elements",
    icon: "◑",
  },
  {
    id: "illustration" as DesignStyle,
    name: "Illustration",
    description: "Detailed illustrations and creative drawings",
    icon: "☆",
  },
];

export function StyleSelector({
  selectedStyle,
  onStyleSelect,
}: StyleSelectorProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Design Style</h2>

      <div className="space-y-3">
        {DESIGN_STYLES.map((style) => (
          <button
            key={style.id}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedStyle === style.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onStyleSelect(style.id)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{style.icon}</span>
              <div className="text-left">
                <span className="block font-medium">{style.name}</span>
                <span className="block text-sm text-gray-500">
                  {style.description}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
