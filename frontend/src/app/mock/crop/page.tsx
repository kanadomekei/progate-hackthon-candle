'use client';

import { useEffect, useRef, useState } from 'react';

export default function CropPage() {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const outRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(new Image());
  const [scale, setScale] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [tshirtCoordinates, setTshirtCoordinates] = useState<[number, number][]>([]);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imagePos, setImagePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const requestRef = useRef<number>();

  // 定数
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 430;
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

  // 画像の描画（回転を含む）
  const drawRotatedImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, width: number, height: number, rotation: number) => {
    ctx.save();
    
    // 回転の中心を設定
    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);
    
    // 画像を描画
    ctx.drawImage(
      img,
      0, 0, img.width, img.height,
      x, y, width, height
    );
    
    ctx.restore();
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

    const ctx = cvs.getContext('2d', { alpha: false });
    if (!ctx) return;

    const v = scale * 0.01;
    
    // 背景の描画
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    try {
      // 画像の描画（回転を含む）
      drawRotatedImage(
        ctx,
        img,
        (CANVAS_WIDTH / 2) - imagePos.x * v,
        (CANVAS_HEIGHT / 2) - imagePos.y * v,
        img.width * v,
        img.height * v,
        rotation
      );

      // Tシャツ型の描画
      ctx.strokeStyle = 'rgba(200, 0, 0, 1)';
      drawTShirtShape(ctx);
      ctx.stroke();
    } catch (error) {
      console.error('Error drawing on canvas:', error);
    }
  };

  // アニメーションフレームを使用した描画更新
  const animate = () => {
    drawCanvas();
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [scale, rotation, imagePos, tshirtCoordinates, imageLoaded]);

  // 画像の切り取り処理
  const cropImage = () => {
    const out = outRef.current;
    const img = imgRef.current;
    if (!out || !img || !imageLoaded) return;

    const ctx = out.getContext('2d', { alpha: false });
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

    // 切り抜いた画像の描画（回転を含む）
    const v = scale * 0.01;
    drawRotatedImage(
      ctx,
      img,
      (OUT_WIDTH / 2) - imagePos.x * v,
      (OUT_HEIGHT / 2) - imagePos.y * v,
      img.width * v,
      img.height * v,
      rotation
    );
  };

  // 画像のダウンロード処理
  const downloadImage = () => {
    const out = outRef.current;
    if (!out) return;

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
    
    // マウスの移動量を計算
    const dx = startPos.x - e.pageX;
    const dy = startPos.y - e.pageY;
    
    // 回転角度をラジアンに変換
    const angle = (rotation * Math.PI) / 180;
    
    // 回転を考慮した移動量の計算
    const rotatedDx = dx * Math.cos(angle) + dy * Math.sin(angle);
    const rotatedDy = -dx * Math.sin(angle) + dy * Math.cos(angle);
    
    const v = scale * 0.01;
    
    setImagePos(prev => ({
      x: prev.x + rotatedDx / v,
      y: prev.y + rotatedDy / v
    }));
    
    setStartPos({ x: e.pageX, y: e.pageY });
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY * -0.05;
    const newScale = Math.min(400, Math.max(10, scale + delta));
    setScale(newScale);
  };

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRotation(Number(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">画像編集ツール</h1>
          <p className="text-gray-600">画像をドラッグして位置を調整し、スケールと回転を設定してください</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* コントロールパネル */}
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
                  onChange={(e) => setScale(Number(e.target.value))}
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
                  onChange={handleRotationChange}
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

          {/* メインエディター */}
          <div className="lg:col-span-9 space-y-6">
            {/* プレビューキャンバス */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <canvas
                ref={cvsRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                className="w-full max-w-full cursor-move rounded-lg"
                style={{ 
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #e2e8f0' 
                }}
              />
            </div>

            {/* アクションボタン */}
            <div className="flex justify-between items-center">
              <button
                onClick={cropImage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg
                          transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M7 21h10a2 2 0 002-2V9l-6-6H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>画像を保存</span>
              </button>
            </div>

            {/* 出力プレビュー */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4">出力プレビュー</h3>
              <canvas
                ref={outRef}
                width={OUT_WIDTH}
                height={OUT_HEIGHT}
                className="w-full max-w-full rounded-lg"
                style={{ 
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #e2e8f0' 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
