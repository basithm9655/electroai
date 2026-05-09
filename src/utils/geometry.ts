import type { Point, Rect, Transform } from '../types';

export const snapToGrid = (v: number, grid: number) => Math.round(v / grid) * grid;
export const snapPoint = (p: Point, grid: number): Point => ({
  x: snapToGrid(p.x, grid),
  y: snapToGrid(p.y, grid),
});

export const screenToCanvas = (screen: Point, t: Transform): Point => ({
  x: (screen.x - t.x) / t.zoom,
  y: (screen.y - t.y) / t.zoom,
});

export const canvasToScreen = (canvas: Point, t: Transform): Point => ({
  x: canvas.x * t.zoom + t.x,
  y: canvas.y * t.zoom + t.y,
});

export const dist = (a: Point, b: Point) =>
  Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);

export const rectContains = (rect: Rect, p: Point) =>
  p.x >= rect.x && p.x <= rect.x + rect.width &&
  p.y >= rect.y && p.y <= rect.y + rect.height;

export const rectsOverlap = (a: Rect, b: Rect) =>
  a.x < b.x + b.width && a.x + a.width > b.x &&
  a.y < b.y + b.height && a.y + a.height > b.y;

export const normalizeRect = (start: Point, end: Point): Rect => ({
  x: Math.min(start.x, end.x),
  y: Math.min(start.y, end.y),
  width: Math.abs(end.x - start.x),
  height: Math.abs(end.y - start.y),
});

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export const rotatePoint = (p: Point, deg: number, origin: Point = { x: 0, y: 0 }): Point => {
  const rad = (deg * Math.PI) / 180;
  const dx = p.x - origin.x;
  const dy = p.y - origin.y;
  return {
    x: origin.x + dx * Math.cos(rad) - dy * Math.sin(rad),
    y: origin.y + dx * Math.sin(rad) + dy * Math.cos(rad),
  };
};
