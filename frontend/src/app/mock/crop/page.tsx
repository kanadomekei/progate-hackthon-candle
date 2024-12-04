'use client';

import { useEffect, useRef, useState } from 'react';

export default function CropPage() {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const outRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(new Image());
  const [scale, setScale] = useState<number>(100);
  const [tshirtCoordinates, setTshirtCoordinates] = useState<[number, number][]>([]);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imagePos, setImagePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // 定数
  const CANVAS_WIDTH = 700;
  const CANVAS_HEIGHT = 450;
  const OUT_WIDTH = 600;
  const OUT_HEIGHT = 430;

  // 座標データの読み込み
  useEffect(() => {
    async function loadContours() {
      try {
        const response = await fetch('/contourss.txt');
        const text = await response.text();
        const coordinates = text.split('\n')
          .filter(line => line.trim())
          .map(line => {
            const [x, y] = line.split(',').map(Number);
            return [x, y] as [number, number];
          });
        setTshirtCoordinates(coordinates);
      } catch (error) {
        console.error('Failed to load contours:', error);
      }
    }
    loadContours();
  }, []);

  // 画像の読み込み
  useEffect(() => {
    const img = imgRef.current;
    
    const handleLoad = () => {
      console.log('Image loaded successfully');
      setImageLoaded(true);
      setImagePos({
        x: img.width / 2,
        y: img.height / 2
      });
      const scl = parseInt(String(CANVAS_WIDTH / img.width * 100));
      setScale(scl);
      drawCanvas();
    };

    const handleError = (error: ErrorEvent) => {
      console.error('Error loading image:', error);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    img.src = '/sample.png';

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, []);

  // Tシャツ型の描画
  const drawTShirtShape = (ctx: CanvasRenderingContext2D) => {
    if (tshirtCoordinates.length === 0) return;
    
    ctx.beginPath();
    ctx.moveTo(tshirtCoordinates[0][0], tshirtCoordinates[0][1]);
    
    tshirtCoordinates.forEach(([x, y]) => {
      ctx.lineTo(x, y);
    });
    
    ctx.closePath();
  };

  // キャンバスの描画
  const drawCanvas = () => {
    const cvs = cvsRef.current;
    const img = imgRef.current;
    if (!cvs || !img || !imageLoaded) {
      console.log('Canvas drawing conditions not met:', { 
        canvas: !!cvs, 
        image: !!img, 
        imageLoaded 
      });
      return;
    }

    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const v = scale * 0.01;
    
    // 背景の描画
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    try {
      // 画像の描画
      ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        (CANVAS_WIDTH / 2) - imagePos.x * v,
        (CANVAS_HEIGHT / 2) - imagePos.y * v,
        img.width * v,
        img.height * v
      );

      // Tシャツ型の描画
      ctx.strokeStyle = 'rgba(200, 0, 0, 1)';
      drawTShirtShape(ctx);
      ctx.stroke();
    } catch (error) {
      console.error('Error drawing on canvas:', error);
    }
  };

  // 画像のクロップ
  const cropImage = () => {
    const out = outRef.current;
    const img = imgRef.current;
    if (!out || !img || !imageLoaded) return;

    const ctx = out.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, OUT_WIDTH, OUT_HEIGHT);

    // クリッピングパスの設定
    ctx.beginPath();
    if (tshirtCoordinates.length > 0) {
      ctx.moveTo(tshirtCoordinates[0][0], tshirtCoordinates[0][1]);
      tshirtCoordinates.forEach(([x, y]) => {
        ctx.lineTo(x, y);
      });
    }
    ctx.closePath();
    ctx.clip();

    // 切り抜いた画像の描画
    const v = scale * 0.01;
    ctx.drawImage(
      img,
      0, 0, img.width, img.height,
      (OUT_WIDTH / 2) - imagePos.x * v,
      (OUT_HEIGHT / 2) - imagePos.y * v,
      img.width * v,
      img.height * v
    );

    // ダウンロードリンクの生成
    const dataUrl = out.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = 'cropped_image.png';
    downloadLink.click();
  };

  // マウスイベントハンドラー
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDown(true);
    setStartPos({ x: e.pageX, y: e.pageY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseDown) return;
    const v = scale * 0.01;
    const newX = imagePos.x + (startPos.x - e.pageX) / v;
    const newY = imagePos.y + (startPos.y - e.pageY) / v;
    setImagePos({ x: newX, y: newY });
    drawCanvas();
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY * -0.05;
    const newScale = Math.min(400, Math.max(10, scale + delta));
    setScale(newScale);
    drawCanvas();
  };

  useEffect(() => {
    drawCanvas();
  }, [scale, tshirtCoordinates, imageLoaded]);

  return (
    <div className="p-4">
      <div className="mb-4">
        Scale: {scale}%
        <input
          type="range"
          min="10"
          max="400"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="w-[300px] mb-4"
        />
      </div>
      <div className="mb-4">
        <canvas
          ref={cvsRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ border: '1px solid #ccc' }}
        />
      </div>
      <div className="mb-4">
        <button
          onClick={cropImage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          CROP
        </button>
      </div>
      <div>
        <canvas
          ref={outRef}
          width={OUT_WIDTH}
          height={OUT_HEIGHT}
          style={{ border: '1px solid #ccc' }}
        />
      </div>
    </div>
  );
}
