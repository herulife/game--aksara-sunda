"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TracingCanvasProps = {
  guideLetter: string;
  onInkChange?: (hasInk: boolean) => void;
  onTraceStateChange?: (state: { hasInk: boolean; likelyCorrect: boolean }) => void;
};

const STROKE_COLOR = "#2e2415";
const BORDER_COLOR = "#d9c89c";
const BACKGROUND_COLOR = "rgba(255, 250, 240, 0.86)";
const GUIDE_BOUNDS = {
  left: 72,
  top: 42,
  right: 248,
  bottom: 278,
};
const GUIDE_FONT_SIZE = 220;
const GUIDE_CELL_SIZE = 18;
const GUIDE_SAMPLE_RADIUS = 12;
const GUIDE_ALPHA_THRESHOLD = 18;

export function TracingCanvas({ guideLetter, onInkChange, onTraceStateChange }: TracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const guideMaskRef = useRef<Uint8ClampedArray | null>(null);
  const guideMaskMetaRef = useRef({ width: 0, height: 0, totalGuideCells: 1 });
  const [hasInk, setHasInk] = useState(false);
  const pointStatsRef = useRef({
    totalPoints: 0,
    insidePoints: 0,
    onGuidePoints: 0,
    minX: Number.POSITIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
    guideCells: new Set<string>(),
  });

  const canvasSize = useMemo(() => ({ width: 320, height: 320 }), []);

  function resetPointStats() {
    pointStatsRef.current = {
      totalPoints: 0,
      insidePoints: 0,
      onGuidePoints: 0,
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
      guideCells: new Set<string>(),
    };
    onTraceStateChange?.({ hasInk: false, likelyCorrect: false });
  }

  function isPointInsideGuide(x: number, y: number) {
    return (
      x >= GUIDE_BOUNDS.left &&
      x <= GUIDE_BOUNDS.right &&
      y >= GUIDE_BOUNDS.top &&
      y <= GUIDE_BOUNDS.bottom
    );
  }

  function calculateTraceState(nextHasInk: boolean) {
    const stats = pointStatsRef.current;

    if (!nextHasInk || stats.totalPoints < 20) {
      return { hasInk: nextHasInk, likelyCorrect: false };
    }

    const width = Math.max(0, stats.maxX - stats.minX);
    const height = Math.max(0, stats.maxY - stats.minY);
    const insideRatio = stats.insidePoints / Math.max(1, stats.totalPoints);
    const onGuideRatio = stats.onGuidePoints / Math.max(1, stats.totalPoints);
    const guideCoverage =
      stats.guideCells.size / Math.max(1, guideMaskMetaRef.current.totalGuideCells);
    const staysWithinGuide =
      stats.minX >= GUIDE_BOUNDS.left - 14 &&
      stats.maxX <= GUIDE_BOUNDS.right + 14 &&
      stats.minY >= GUIDE_BOUNDS.top - 14 &&
      stats.maxY <= GUIDE_BOUNDS.bottom + 14;
    const enoughShapeSpread = width >= 72 && width <= 188 && height >= 138 && height <= 252;
    const likelyCorrect =
      insideRatio >= 0.8 &&
      onGuideRatio >= 0.62 &&
      guideCoverage >= 0.12 &&
      staysWithinGuide &&
      enoughShapeSpread;

    return {
      hasInk: nextHasInk,
      likelyCorrect,
    };
  }

  function isPointNearGuide(x: number, y: number) {
    const alphaMap = guideMaskRef.current;
    const { width, height } = guideMaskMetaRef.current;

    if (!alphaMap || width === 0 || height === 0) {
      return false;
    }

    const startX = Math.max(0, Math.floor(x - GUIDE_SAMPLE_RADIUS));
    const endX = Math.min(width - 1, Math.ceil(x + GUIDE_SAMPLE_RADIUS));
    const startY = Math.max(0, Math.floor(y - GUIDE_SAMPLE_RADIUS));
    const endY = Math.min(height - 1, Math.ceil(y + GUIDE_SAMPLE_RADIUS));

    for (let offsetY = startY; offsetY <= endY; offsetY += 1) {
      for (let offsetX = startX; offsetX <= endX; offsetX += 1) {
        if (alphaMap[offsetY * width + offsetX] > GUIDE_ALPHA_THRESHOLD) {
          return true;
        }
      }
    }

    return false;
  }

  function updatePointStats(point: { x: number; y: number }) {
    const stats = pointStatsRef.current;
    stats.totalPoints += 1;
    if (isPointInsideGuide(point.x, point.y)) {
      stats.insidePoints += 1;
    }
    if (isPointNearGuide(point.x, point.y)) {
      stats.onGuidePoints += 1;
      const cellX = Math.floor((point.x - GUIDE_BOUNDS.left) / GUIDE_CELL_SIZE);
      const cellY = Math.floor((point.y - GUIDE_BOUNDS.top) / GUIDE_CELL_SIZE);
      stats.guideCells.add(`${cellX}:${cellY}`);
    }
    stats.minX = Math.min(stats.minX, point.x);
    stats.minY = Math.min(stats.minY, point.y);
    stats.maxX = Math.max(stats.maxX, point.x);
    stats.maxY = Math.max(stats.maxY, point.y);
    onTraceStateChange?.(calculateTraceState(true));
  }

  function drawBase(context: CanvasRenderingContext2D, width: number, height: number) {
    context.clearRect(0, 0, width, height);
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = BORDER_COLOR;
    context.lineWidth = 4;
    context.strokeRect(2, 2, width - 4, height - 4);

    context.strokeStyle = "rgba(125, 110, 72, 0.16)";
    context.lineWidth = 1;
    context.setLineDash([8, 8]);
    context.beginPath();
    context.moveTo(width / 2, 24);
    context.lineTo(width / 2, height - 24);
    context.moveTo(24, height / 2);
    context.lineTo(width - 24, height / 2);
    context.stroke();
    context.setLineDash([]);
  }

  const rebuildGuideMask = useCallback(async () => {
    if (typeof document === "undefined") return;

    try {
      await document.fonts.load(`${GUIDE_FONT_SIZE}px "Noto Sans Sundanese"`, guideLetter);
      await document.fonts.ready;
    } catch {
      // Keep going even if the font loading API is unavailable.
    }

    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvasSize.width;
    offscreenCanvas.height = canvasSize.height;
    const context = offscreenCanvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    context.fillStyle = "#000";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `${GUIDE_FONT_SIZE}px "Noto Sans Sundanese"`;
    context.fillText(guideLetter, canvasSize.width / 2, canvasSize.height / 2 + 6);

    const imageData = context.getImageData(0, 0, canvasSize.width, canvasSize.height);
    const alphaMap = new Uint8ClampedArray(canvasSize.width * canvasSize.height);
    const occupiedGuideCells = new Set<string>();

    for (let y = 0; y < canvasSize.height; y += 1) {
      for (let x = 0; x < canvasSize.width; x += 1) {
        const alpha = imageData.data[(y * canvasSize.width + x) * 4 + 3];
        alphaMap[y * canvasSize.width + x] = alpha;

        if (
          alpha > GUIDE_ALPHA_THRESHOLD &&
          x >= GUIDE_BOUNDS.left &&
          x <= GUIDE_BOUNDS.right &&
          y >= GUIDE_BOUNDS.top &&
          y <= GUIDE_BOUNDS.bottom
        ) {
          const cellX = Math.floor((x - GUIDE_BOUNDS.left) / GUIDE_CELL_SIZE);
          const cellY = Math.floor((y - GUIDE_BOUNDS.top) / GUIDE_CELL_SIZE);
          occupiedGuideCells.add(`${cellX}:${cellY}`);
        }
      }
    }

    guideMaskRef.current = alphaMap;
    guideMaskMetaRef.current = {
      width: canvasSize.width,
      height: canvasSize.height,
      totalGuideCells: Math.max(1, occupiedGuideCells.size),
    };
    onTraceStateChange?.(calculateTraceState(hasInk));
  }, [canvasSize.height, canvasSize.width, guideLetter, hasInk, onTraceStateChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    async function setupCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvasSize.width * ratio;
      canvas.height = canvasSize.height * ratio;
      canvas.style.width = `${canvasSize.width}px`;
      canvas.style.height = `${canvasSize.height}px`;

      if (cancelled) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(ratio, ratio);
      drawBase(context, canvasSize.width, canvasSize.height);
      await rebuildGuideMask();
    }

    void setupCanvas();

    return () => {
      cancelled = true;
    };
  }, [canvasSize.height, canvasSize.width, guideLetter, rebuildGuideMask]);

  useEffect(() => {
    onInkChange?.(hasInk);
  }, [hasInk, onInkChange]);

  function getCanvasPoint(clientX: number, clientY: number, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  function ensureDrawingContext() {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.strokeStyle = STROKE_COLOR;
    context.lineWidth = 10;
    context.lineCap = "round";
    context.lineJoin = "round";
    return { canvas, context };
  }

  function startStrokeAt(clientX: number, clientY: number) {
    const drawing = ensureDrawingContext();
    if (!drawing) return;

    const point = getCanvasPoint(clientX, clientY, drawing.canvas);
    isDrawingRef.current = true;
    lastPointRef.current = point;
    drawing.context.beginPath();
    drawing.context.moveTo(point.x, point.y);
    updatePointStats(point);

    if (!hasInk) {
      setHasInk(true);
    }
  }

  function drawTo(clientX: number, clientY: number) {
    if (!isDrawingRef.current) return;
    const drawing = ensureDrawingContext();
    if (!drawing) return;
    const point = getCanvasPoint(clientX, clientY, drawing.canvas);
    const lastPoint = lastPointRef.current;

    if (!lastPoint) {
      lastPointRef.current = point;
      return;
    }

    drawing.context.beginPath();
    drawing.context.moveTo(lastPoint.x, lastPoint.y);
    drawing.context.lineTo(point.x, point.y);
    drawing.context.stroke();

    const distance = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
    const steps = Math.max(1, Math.ceil(distance / 6));
    for (let index = 1; index <= steps; index += 1) {
      const progress = index / steps;
      updatePointStats({
        x: lastPoint.x + (point.x - lastPoint.x) * progress,
        y: lastPoint.y + (point.y - lastPoint.y) * progress,
      });
    }

    lastPointRef.current = point;
  }

  function stopStroke() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    drawBase(context, canvasSize.width, canvasSize.height);
    isDrawingRef.current = false;
    lastPointRef.current = null;
    setHasInk(false);
    resetPointStats();
  }

  useEffect(() => {
    resetPointStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideLetter]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-[320px] w-full max-w-[320px] overflow-hidden rounded-[0.9rem] border-2 border-[#d9c89c] bg-[#fffaf0] shadow-inner">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-aksara text-[10rem] leading-none text-black/18">
            {guideLetter}
          </span>
        </div>
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onPointerDown={(event) => {
            event.preventDefault();
            startStrokeAt(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => {
            event.preventDefault();
            drawTo(event.clientX, event.clientY);
          }}
          onPointerUp={(event) => {
            event.preventDefault();
            stopStroke();
          }}
          onPointerCancel={stopStroke}
          onPointerLeave={stopStroke}
          onMouseDown={(event) => {
            event.preventDefault();
            startStrokeAt(event.clientX, event.clientY);
          }}
          onMouseMove={(event) => {
            event.preventDefault();
            drawTo(event.clientX, event.clientY);
          }}
          onMouseUp={stopStroke}
          onMouseLeave={stopStroke}
          onTouchStart={(event) => {
            event.preventDefault();
            const touch = event.touches[0];
            if (touch) startStrokeAt(touch.clientX, touch.clientY);
          }}
          onTouchMove={(event) => {
            event.preventDefault();
            const touch = event.touches[0];
            if (touch) drawTo(touch.clientX, touch.clientY);
          }}
          onTouchEnd={(event) => {
            event.preventDefault();
            stopStroke();
          }}
          className="absolute inset-0 z-10 h-full w-full select-none touch-none"
          style={{ touchAction: "none" }}
        />
      </div>
      <div className="flex w-full max-w-[320px] items-center justify-between gap-3">
        <p className="text-left text-xs font-black text-[#665534] sm:text-sm">
          Tulis di area ini dengan jari atau mouse.
        </p>
        <button
          type="button"
          onClick={clearCanvas}
          className="rounded-[0.9rem] bg-[#7db5e8] px-3 py-2 text-sm font-black text-white shadow-[0_10px_18px_rgba(35,28,15,0.16)]"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
