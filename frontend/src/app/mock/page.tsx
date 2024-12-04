"use client";
import React, { useRef, useState, useEffect } from "react";

const CropComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState(100);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [tshirtCoordinates, setTshirtCoordinates] = useState<number[][]>([]);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ ix: 0, iy: 0 });
  const [start, setStart] = useState({ sx: 0, sy: 0 });

  const canvasWidth = 600;
  const canvasHeight = 450;

  useEffect(() => {
    // Load image
    const img = new Image();
    img.src = "/tamago.jpg"; // パスを変更
    img.onload = () => {
      setImage(img);
      setOffset({ ix: img.width / 2, iy: img.height / 2 });
    };

    // Load contours from a file
    fetch("/contours.txt")
      .then((response) => response.text())
      .then((text) => {
        const coordinates = text
          .split("\n")
          .map((line) => line.split(",").map(Number));
        setTshirtCoordinates(coordinates);
      });
  }, []);

  const drawCanvas = (ix: number, iy: number, v: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !image) return;

    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 背景画像を描画
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      canvasWidth / 2 - ix * v,
      canvasHeight / 2 - iy * v,
      image.width * v,
      image.height * v,
    );

    // Tシャツの形を描画
    if (tshirtCoordinates.length > 0) {
      ctx.strokeStyle = "rgba(200, 0, 0, 1)";
      ctx.beginPath();
      ctx.moveTo(tshirtCoordinates[0][0], tshirtCoordinates[0][1]);
      tshirtCoordinates.forEach(([x, y]) => {
        ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
    }
  };

  const handleScaleChange = (value: number) => {
    setScale(value);
    drawCanvas(offset.ix, offset.iy, value * 0.01);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDragging(true);
    setStart({ sx: e.pageX, sy: e.pageY });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;
    setDragging(false);
    const { sx, sy } = start;
    const { ix, iy } = offset;
    const v = scale * 0.01;
    setOffset({ ix: ix + (sx - e.pageX) / v, iy: iy + (sy - e.pageY) / v });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;
    const { sx, sy } = start;
    const { ix, iy } = offset;
    const v = scale * 0.01;
    drawCanvas(ix + (sx - e.pageX) / v, iy + (sy - e.pageY) / v, v);
  };

  const handleCrop = () => {
    const outputCanvas = outputCanvasRef.current;
    const ctx = outputCanvas?.getContext("2d");
    if (!ctx || !image || tshirtCoordinates.length === 0) return;

    if (!outputCanvas) {
      console.error("Output canvas is null.");
      return;
    }
    
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

    // Clip T-shirt shape
    ctx.beginPath();
    ctx.moveTo(tshirtCoordinates[0][0], tshirtCoordinates[0][1]);
    tshirtCoordinates.forEach(([x, y]) => {
      ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.clip();

    // Draw cropped image
    const { ix, iy } = offset;
    const v = scale * 0.01;
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      outputCanvas.width / 2 - ix * v,
      outputCanvas.height / 2 - iy * v,
      image.width * v,
      image.height * v,
    );
  };

  return (
    <div>
      <input
        type="range"
        min="10"
        max="400"
        value={scale}
        onChange={(e) => handleScaleChange(Number(e.target.value))}
        style={{ width: "300px" }}
      />
      <br />
      <canvas
        id="cvs"
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></canvas>
      <br />
      <button onClick={handleCrop}>CROP</button>
      <br />
      <canvas
        id="out"
        width={canvasWidth}
        height={canvasHeight}
        ref={outputCanvasRef}
      ></canvas>
    </div>
  );
};

export default CropComponent;
