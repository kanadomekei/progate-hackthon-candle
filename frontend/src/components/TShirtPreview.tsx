"use client";

import { DesignStyle, ColorScheme } from "./TShirtDesigner";

interface TShirtPreviewProps {
  style: DesignStyle;
  colors: ColorScheme;
  view: 'front' | 'back';
}

export function TShirtPreview({ style, colors, view }: TShirtPreviewProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-center items-center mb-3">
        <span className="px-4 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
          {view === 'front' ? 'Front View' : 'Back View'}
        </span>
      </div>

      <div className="relative w-full aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden">
        <svg
          viewBox="0 0 300 400"
          className="w-full h-full"
          style={{ backgroundColor: colors.primary }}
        >
          {/* T-shirt Outline - より太いストローク */}
          <path
            d="M75 50 L125 50 L150 25 L175 50 L225 50 L250 100 L225 125 L225 350 L75 350 L75 125 L50 100 L75 50"
            fill={colors.primary}
            stroke={colors.secondary}
            strokeWidth="3"
          />

          {/* Collar - より太いストローク */}
          <path
            d="M125 50 Q150 60 175 50"
            fill="none"
            stroke={colors.secondary}
            strokeWidth="3"
          />

          {/* Sleeves - より太いストローク */}
          <path
            d="M75 50 Q60 75 50 100"
            fill="none"
            stroke={colors.secondary}
            strokeWidth="3"
          />
          <path
            d="M225 50 Q240 75 250 100"
            fill="none"
            stroke={colors.secondary}
            strokeWidth="3"
          />

          {/* Design Area - より大きく */}
          <rect
            x="90"
            y="90"
            width="120"
            height="120"
            fill="none"
            stroke={colors.accent}
            strokeDasharray="4"
            strokeWidth="2"
            className="opacity-50"
          />

          {/* Placeholder Text - より大きく */}
          <text
            x="150"
            y="150"
            textAnchor="middle"
            className="text-sm"
            fill={colors.secondary}
          >
            {view === 'front' ? 'Front Design Area' : 'Back Design Area'}
          </text>
        </svg>
      </div>
    </div>
  );
}
