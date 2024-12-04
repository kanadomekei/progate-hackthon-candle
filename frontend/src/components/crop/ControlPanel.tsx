"use client";

import { ChangeEvent } from "react";

interface ControlPanelProps {
  scale: number;
  rotation: number;
  onScaleChange: (value: number) => void;
  onRotationChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function ControlPanel({
  scale,
  rotation,
  onScaleChange,
  onRotationChange,
}: ControlPanelProps) {
  return (
    <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-4">
      <div className="space-y-6">
        {/* スケールコントロール */}
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
            <span>拡大・縮小</span>
            <span className="text-blue-600">{scale}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="400"
            value={scale}
            onChange={(e) => onScaleChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* 回転コントロール */}
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
            <span>回転</span>
            <span className="text-blue-600">{rotation}°</span>
          </label>
          <input
            type="range"
            min="-180"
            max="180"
            step="0.1"
            value={rotation}
            onChange={onRotationChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* 操作説明 */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">操作方法</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• ドラッグ: 画像の位置を移動</li>
            <li>• マウスホイール: 拡大・縮小</li>
            <li>• スライダー: 回転角度の調整</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
