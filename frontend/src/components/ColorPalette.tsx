import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";

export type ColorScheme = {
  selectedColor: string;
};

export function ColorPalette() {
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">メインカラー</h2>

      {/* 選択中の色をプレビュー */}
      <div
        className="w-16 h-16 rounded-full mb-4 border-2 border-gray-300"
        style={{ backgroundColor: selectedColor }}
      ></div>

      {/* カラーピッカー */}
      <HexColorPicker
        color={selectedColor}
        onChange={setSelectedColor}
        className="mb-4"
      />

      {/* 選択したカラーコードを表示 */}
      <div className="text-gray-700 text-sm">
        <strong>Selected Color:</strong> {selectedColor}
      </div>
    </div>
  );
}