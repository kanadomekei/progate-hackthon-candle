"use client";

import { DesignStyle } from "./TShirtDesigner";

interface StyleSelectorProps {
  selectedStyles: DesignStyle[];
  onStyleSelect: (styles: DesignStyle[]) => void;
}

const DESIGN_STYLES = [
  "3d-model",
  "analog-film",
  "animé",
  "cinematic",
  "comic-book",
  "digital-art",
  "enhance",
  "fantasy-art",
  "isometric",
  "line-art",
  "low-poly",
  "modeling-compound",
  "neon-punk",
  "origami",
  "photographic",
  "pixel-art",
  "tile-texture",
];

export function StyleSelector({
  selectedStyles,
  onStyleSelect,
}: StyleSelectorProps) {
  const handleStyleToggle = (style: DesignStyle) => {
    // 選択されているかどうかをチェック
    const isSelected = selectedStyles.includes(style);
    let updatedStyles;

    if (isSelected) {
      // 既に選択されている場合は解除
      updatedStyles = selectedStyles.filter((s) => s !== style);
    } else {
      // 新しく選択
      updatedStyles = [...selectedStyles, style];
    }

    // 新しいスタイルリストを渡す
    onStyleSelect(updatedStyles);
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">デザインスタイル</h2>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {DESIGN_STYLES.map((style) => (
          <button
            key={style}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedStyles.includes(style)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleStyleToggle(style)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-left">
                <span className="block font-medium">{style}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
