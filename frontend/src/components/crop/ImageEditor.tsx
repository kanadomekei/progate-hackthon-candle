'use client';

import { RefObject } from 'react';

interface ImageEditorProps {
  cvsRef: RefObject<HTMLCanvasElement>;
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onWheel: (e: React.WheelEvent) => void;
  onCropImage: () => void;
}

export function ImageEditor({
  cvsRef,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onWheel,
  onCropImage
}: ImageEditorProps) {
  return (
    <div className="lg:col-span-9 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <canvas
          ref={cvsRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
          className="w-full max-w-full cursor-move rounded-lg"
          style={{ 
            backgroundColor: '#f8f9fa',
            border: '2px solid #e2e8f0' 
          }}
        />
      </div>

      <div className="flex justify-start items-center space-x-4">
        <button
          onClick={onCropImage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg
                    transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M5 15l7-7 7 7" />
          </svg>
          <span>画像を切り取る</span>
        </button>
      </div>
    </div>
  );
} 