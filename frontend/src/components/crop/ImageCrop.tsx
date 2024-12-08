"use client";

import { useEffect, useRef, useState } from "react";
import { ControlPanel } from "./ControlPanel";
import { ImageEditor } from "./ImageEditor";
import { ImageHistory } from "./ImageHistory";
import { ImageModal } from "./ImageModal";
import { CroppedImage } from "./types";
import { useRouter } from "next/navigation";

// Constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 430;
const OUT_WIDTH = 600;
const OUT_HEIGHT = 430;

interface ImageCropProps {
  imagePath: string;
}

// サイズの型を定義
type TShirtSize = "S" | "M" | "L" | "XL";

export const ImageCrop = ({ imagePath }: ImageCropProps) => {
  const router = useRouter();
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const outRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [scale, setScale] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [tshirtCoordinates, setTshirtCoordinates] = useState<
    [number, number][]
  >([]);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [imagePos, setImagePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const requestRef = useRef<number>();
  const [croppedImages, setCroppedImages] = useState<CroppedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<CroppedImage | null>(null);
  const [selectedSize, setSelectedSize] = useState<TShirtSize>("M");
  const [backgroundColor, setBackgroundColor] = useState<string>("#f8f9fa");

  // 座標データの読み込みを最適化
  const loadContours = async (size: TShirtSize) => {
    try {
      const response = await fetch(`/Tshirt-${size}.txt`);
      const text = await response.text();
      const coordinates = text
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [x, y] = line.split(",").map(Number);
          return [x, y] as [number, number];
        });
      setTshirtCoordinates(coordinates);
    } catch (error) {
      console.error("Failed to load contours:", error);
    }
  };

  // 画像読み込みの最適化
  const loadImage = () => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setImagePos({
        x: img.width / 2,
        y: img.height / 2,
      });
      const scl = parseInt(String((CANVAS_WIDTH / img.width) * 100));
      setScale(scl);
      imgRef.current = img;
      drawCanvas();
    };
    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
    img.src = imagePath;
  };

  // useEffectを最小限に
  useEffect(() => {
    loadImage();
    loadContours(selectedSize);

    const animationFrame = requestAnimationFrame(function animate() {
      drawCanvas();
      requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [imagePath, selectedSize]); // drawCanvasはここでは依存配列に含めない

  // サイズ変更時の処理を最適化
  const handleSizeChange = async (size: TShirtSize) => {
    setSelectedSize(size);
    await loadContours(size);
  };

  // Draw T-shirt shape
  const drawTShirtShape = (ctx: CanvasRenderingContext2D) => {
    if (tshirtCoordinates.length === 0) return;

    ctx.beginPath();
    const offsetX = 100;
    const offsetY = 60;
    const scale = 0.7;
    ctx.moveTo(
      tshirtCoordinates[0][0] * scale + offsetX,
      tshirtCoordinates[0][1] * scale + offsetY,
    );

    tshirtCoordinates.forEach(([x, y]) => {
      ctx.lineTo(x * scale + offsetX, y * scale + offsetY);
    });

    ctx.closePath();
  };

  // Draw rotated image
  const drawRotatedImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number,
  ) => {
    ctx.save();

    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);

    ctx.drawImage(img, 0, 0, img.width, img.height, x, y, width, height);

    ctx.restore();
  };

  // Draw canvas
  const drawCanvas = () => {
    const cvs = cvsRef.current;
    const img = imgRef.current;
    if (!cvs || !img || !imageLoaded) {
      console.log("Canvas drawing conditions not met:", {
        canvas: !!cvs,
        image: !!img,
        imageLoaded,
      });
      return;
    }

    const ctx = cvs.getContext("2d", { alpha: false });
    if (!ctx) return;

    const v = scale * 0.01;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    try {
      drawRotatedImage(
        ctx,
        img,
        CANVAS_WIDTH / 2 - imagePos.x * v,
        CANVAS_HEIGHT / 2 - imagePos.y * v,
        img.width * v,
        img.height * v,
        rotation,
      );

      ctx.strokeStyle = "rgba(200, 0, 0, 1)";
      drawTShirtShape(ctx);
      ctx.stroke();
    } catch (error) {
      console.error("Error drawing on canvas:", error);
    }
  };

  // Animation frame update
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
  }, [
    scale,
    rotation,
    imagePos,
    tshirtCoordinates,
    imageLoaded,
    backgroundColor,
  ]);

  // Crop image
  const cropImage = () => {
    const out = outRef.current;
    const img = imgRef.current;
    if (!out || !img || !imageLoaded) return;

    const ctx = out.getContext("2d", { alpha: false });
    if (!ctx) return;

    // 背景色で全体を塗りつぶす
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, OUT_WIDTH, OUT_HEIGHT);

    ctx.beginPath();
    if (tshirtCoordinates.length > 0) {
      const offsetX = 100;
      const offsetY = 50;
      const scale = 0.7;
      ctx.moveTo(
        tshirtCoordinates[0][0] * scale + offsetX,
        tshirtCoordinates[0][1] * scale + offsetY,
      );
      tshirtCoordinates.forEach(([x, y]) => {
        ctx.lineTo(x * scale + offsetX, y * scale + offsetY);
      });
    }
    ctx.closePath();
    ctx.clip();

    // 背景色を再度描画（クリッピングパスの内側のみ描画される）
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, OUT_WIDTH, OUT_HEIGHT);

    const v = scale * 0.01;
    drawRotatedImage(
      ctx,
      img,
      OUT_WIDTH / 2 - imagePos.x * v,
      OUT_HEIGHT / 2 - imagePos.y * v,
      img.width * v,
      img.height * v,
      rotation,
    );

    const newCroppedImage: CroppedImage = {
      id: crypto.randomUUID(),
      dataUrl: out.toDataURL("image/png"),
      timestamp: new Date(),
    };
    setCroppedImages((prev) => [...prev, newCroppedImage]);
  };

  // Download image
  const downloadImage = (image: CroppedImage) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = image.dataUrl;
    downloadLink.download = `cropped_image_${image.timestamp.getTime()}.png`;
    downloadLink.click();
  };

  // Delete image
  const deleteImage = (id: string) => {
    setCroppedImages((prev) => prev.filter((img) => img.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDown(true);
    setStartPos({ x: e.pageX, y: e.pageY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseDown) return;

    const dx = startPos.x - e.pageX;
    const dy = startPos.y - e.pageY;

    const angle = (rotation * Math.PI) / 180;

    const rotatedDx = dx * Math.cos(angle) + dy * Math.sin(angle);
    const rotatedDy = -dx * Math.sin(angle) + dy * Math.cos(angle);

    const v = scale * 0.01;

    setImagePos((prev) => ({
      x: prev.x + rotatedDx / v,
      y: prev.y + rotatedDy / v,
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

  const handleImageSelect = (image: CroppedImage) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">画像編集ツール</h1>
            <p className="text-gray-600">
              画像をドラッグし位置を調整し、スケールと回転を設定してください
            </p>
          </div>
          <div>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
            >
              画像生成に戻る
            </button>
          </div>
        </header>

        {/* サイズ選択ボタングループを追加 */}
        <div className="flex gap-2">
          {(["S", "M", "L", "XL"] as const).map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`px-4 py-2 rounded ${
                selectedSize === size
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ControlPanel
            scale={scale}
            rotation={rotation}
            backgroundColor={backgroundColor}
            onScaleChange={setScale}
            onRotationChange={handleRotationChange}
            onBackgroundColorChange={setBackgroundColor}
          />

          <ImageEditor
            cvsRef={cvsRef}
            CANVAS_WIDTH={CANVAS_WIDTH}
            CANVAS_HEIGHT={CANVAS_HEIGHT}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            onCropImage={cropImage}
            backgroundColor={backgroundColor}
          />
        </div>

        <canvas
          ref={outRef}
          width={OUT_WIDTH}
          height={OUT_HEIGHT}
          style={{ display: "none" }}
        />

        <ImageHistory
          croppedImages={croppedImages}
          onImageSelect={handleImageSelect}
          onDownloadImage={downloadImage}
          onDeleteImage={deleteImage}
        />
      </div>

      {selectedImage && (
        <ImageModal
          selectedImage={selectedImage}
          onClose={handleCloseModal}
          onDownload={downloadImage}
          onDelete={deleteImage}
        />
      )}
    </div>
  );
};
