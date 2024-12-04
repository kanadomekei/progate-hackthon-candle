"use client";

import { DesignStyle, ColorScheme } from "./TShirtDesigner";

interface TShirtPreviewProps {
  style: DesignStyle;
  colors: ColorScheme;
}

export function TShirtPreview({ style, colors }: TShirtPreviewProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Design Preview</h2>

      <div className="relative w-full aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden">
        {/* T-shirt Base */}
        <svg
          viewBox="0 0 300 400"
          className="w-full h-full"
          style={{ backgroundColor: colors.primary }}
        >
          {/* T-shirt Outline */}
          <path
            d="M75 50 L125 50 L150 25 L175 50 L225 50 L250 100 L225 125 L225 350 L75 350 L75 125 L50 100 L75 50"
            fill={colors.primary}
            stroke={colors.secondary}
            strokeWidth="2"
          />

          {/* Collar */}
          <path
            d="M125 50 Q150 60 175 50"
            fill="none"
            stroke={colors.secondary}
            strokeWidth="2"
          />

          {/* Sleeves */}
          <path
            d="M75 50 Q60 75 50 100"
            fill="none"
            stroke={colors.secondary}
            strokeWidth="2"
          />
          <path
            d="M225 50 Q240 75 250 100"
            fill="none"
            stroke={colors.secondary}
            strokeWidth="2"
          />

          {/* Design Area */}
          <rect
            x="100"
            y="100"
            width="100"
            height="100"
            fill="none"
            stroke={colors.accent}
            strokeDasharray="4"
            strokeWidth="1"
            className="opacity-50"
          />

          {/* Placeholder Text */}
          <text
            x="150"
            y="150"
            textAnchor="middle"
            className="text-xs"
            fill={colors.secondary}
          >
            Design Area
          </text>
        </svg>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Style: <span className="font-medium capitalize">{style}</span>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Front View
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
            Back View
          </button>
        </div>
      </div>
    </div>
  );
}
