'use client';

import { useEffect, useRef, useState } from 'react';
import { ControlPanel } from './ControlPanel';
import { ImageEditor } from './ImageEditor';
import { ImageHistory } from './ImageHistory';
import { ImageModal } from './ImageModal';
import { CroppedImage } from './types';

// Constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 430;
const OUT_WIDTH = 600;
const OUT_HEIGHT = 430;

interface ImageCropProps {
  imagePath: string;
}

export const ImageCrop = ({ imagePath }: ImageCropProps) => {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const outRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [scale, setScale] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [tshirtCoordinates, setTshirtCoordinates] = useState<[number, number][]>([]);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imagePos, setImagePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const requestRef = useRef<number>();
  const [croppedImages, setCroppedImages] = useState<CroppedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<CroppedImage | null>(null);

  // Load coordinates data
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

  // Load image
  useEffect(() => {
    imgRef.current = new Image();
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
    img.src = imagePath;

    return () => {
      img?.removeEventListener('load', handleLoad);
      img?.removeEventListener('error', handleError);
    };
  }, [imagePath]);

  // Draw T-shirt shape
  const drawTShirtShape = (ctx: CanvasRenderingContext2D) => {
    if (tshirtCoordinates.length === 0) return;
    
    ctx.beginPath();
    ctx.moveTo(tshirtCoordinates[0][0], tshirtCoordinates[0][1]);
    
    tshirtCoordinates.forEach(([x, y]) => {
      ctx.lineTo(x, y);
    });
    
    ctx.closePath();
  };

  // Draw rotated image
  const drawRotatedImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, width: number, height: number, rotation: number) => {
    ctx.save();
    
    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);
    
    ctx.drawImage(
      img,
      0, 0, img.width, img.height,
      x, y, width, height
    );
    
    ctx.restore();
  };

  // Draw canvas
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
    
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    try {
      drawRotatedImage(
        ctx,
        img,
        (CANVAS_WIDTH / 2) - imagePos.x * v,
        (CANVAS_HEIGHT / 2) - imagePos.y * v,
        img.width * v,
        img.height * v,
        rotation
      );

      ctx.strokeStyle = 'rgba(200, 0, 0, 1)';
      drawTShirtShape(ctx);
      ctx.stroke();
    } catch (error) {
      console.error('Error drawing on canvas:', error);
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
  }, [scale, rotation, imagePos, tshirtCoordinates, imageLoaded]);

  // Crop image
  const cropImage = () => {
    const out = outRef.current;
    const img = imgRef.current;
    if (!out || !img || !imageLoaded) return;

    const ctx = out.getContext('2d', { alpha: false });
    if (!ctx) return;

    ctx.clearRect(0, 0, OUT_WIDTH, OUT_HEIGHT);

    ctx.beginPath();
    if (tshirtCoordinates.length > 0) {
      ctx.moveTo(tshirtCoordinates[0][0], tshirtCoordinates[0][1]);
      tshirtCoordinates.forEach(([x, y]) => {
        ctx.lineTo(x, y);
      });
    }
    ctx.closePath();
    ctx.clip();

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

    const newCroppedImage: CroppedImage = {
      id: crypto.randomUUID(),
      dataUrl: out.toDataURL('image/png'),
      timestamp: new Date()
    };
    setCroppedImages(prev => [...prev, newCroppedImage]);
  };

  // Download image
  const downloadImage = (image: CroppedImage) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = image.dataUrl;
    downloadLink.download = `cropped_image_${image.timestamp.getTime()}.png`;
    downloadLink.click();
  };

  // Delete image
  const deleteImage = (id: string) => {
    setCroppedImages(prev => prev.filter(img => img.id !== id));
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

  const handleImageSelect = (image: CroppedImage) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">画像編集ツール</h1>
          <p className="text-gray-600">画像をドラッグして位置を調整し、スケールと回転を設定してください</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ControlPanel
            scale={scale}
            rotation={rotation}
            onScaleChange={setScale}
            onRotationChange={handleRotationChange}
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
          />
        </div>
      </div>

      <canvas
        ref={outRef}
        width={OUT_WIDTH}
        height={OUT_HEIGHT}
        style={{ display: 'none' }}
      />

      <ImageHistory
        croppedImages={croppedImages}
        onImageSelect={handleImageSelect}
        onDownloadImage={downloadImage}
        onDeleteImage={deleteImage}
      />

      {selectedImage && (
        <ImageModal
          selectedImage={selectedImage}
          onClose={handleCloseModal}
          onDownload={downloadImage}
        />
      )}
    </div>
  );
};
