"use client";

import { ThemeColor } from "./TShirtDesigner";

interface ThemeColorSelectorProps {
  selectedThemeColor: ThemeColor | null;
  onThemeColorSelect: (color: ThemeColor) => void;
}

const THEME_COLORS: ThemeColor[] = [
  {
    name: "Monochrome",
    prompt:
      "黒、白、グレースケールのみを使用したミニマリストデザインを作成してください。クリーンなラインと幾何学的な形状に重点を置いてください",
  },
  {
    name: "Pastel",
    prompt:
      "優しく夢のような雰囲気を作り出す、柔らかいパステルカラーでデザインしてください。丸みを帯びた形状と流れるような要素を含めてください",
  },
  {
    name: "Vivid",
    prompt:
      "鮮やかな彩度の高い色を使用して目を引くデザインを作成してください。ダイナミックなパターンと印象的なコントラストを取り入れてください",
  },
  {
    name: "Earth Tones",
    prompt:
      "暖かみのある自然な大地の色を使用してデザインしてください。自然を反映した有機的な形状とテクスチャを含めてください",
  },
  {
    name: "Neon",
    prompt:
      "明るいネオンカラーを使用したモダンでアーバンなデザインを作成してください。大胆なタイポグラフィと現代的なグラフィック要素を含めてください",
  },
  {
    name: "Vintage",
    prompt:
      "色あせた落ち着いた色を使用してノスタルジックな雰囲気のデザインを作成してください。レトロなタイポグラフィと昔ながらのデザイン要素を含めてください",
  },
  {
    name: "Coastal",
    prompt:
      "オーシャンブルーと砂浜のような中間色を使用してリラックスした海辺をイメージしたデザインを作成してください。波のようなパターンと海辺のモチーフを含めてください",
  },
  {
    name: "Forest",
    prompt:
      "深い森の緑と豊かな自然の色調を使用してデザインしてください。植物の要素と森林をイメージしたパターンを含めてください",
  },
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
