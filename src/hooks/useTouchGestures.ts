import { useEffect, useRef } from 'react';
import { useCircuitStore } from '../store/useCircuitStore';

/**
 * Adds pinch-to-zoom and two-finger-pan touch support for the circuit canvas.
 * Attach the returned ref to the SVG element.
 */
export function useTouchGestures(svgRef: React.RefObject<SVGSVGElement>) {
  const { setZoom, setTransform, canvas } = useCircuitStore();
  const lastTouches = useRef<TouchList | null>(null);
  const lastDist = useRef<number | null>(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const getTouchDist = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getTouchMid = (touches: TouchList) => ({
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    });

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        lastDist.current = getTouchDist(e.touches);
        lastTouches.current = e.touches;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastDist.current !== null) {
        e.preventDefault();
        const newDist = getTouchDist(e.touches);
        const scale = newDist / lastDist.current;

        const rect = el.getBoundingClientRect();
        const mid = getTouchMid(e.touches);
        const center = { x: mid.x - rect.left, y: mid.y - rect.top };

        setZoom(canvas.transform.zoom * scale, center);
        lastDist.current = newDist;

        // Two-finger pan
        if (lastTouches.current) {
          const prevMid = {
            x: (lastTouches.current[0].clientX + lastTouches.current[1].clientX) / 2,
            y: (lastTouches.current[0].clientY + lastTouches.current[1].clientY) / 2,
          };
          const dx = mid.x - prevMid.x;
          const dy = mid.y - prevMid.y;
          setTransform({ x: canvas.transform.x + dx, y: canvas.transform.y + dy });
        }
        lastTouches.current = e.touches;
      }
    };

    const onTouchEnd = () => {
      lastDist.current = null;
      lastTouches.current = null;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [svgRef, canvas.transform, setZoom, setTransform]);
}
