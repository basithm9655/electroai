import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useCircuitStore } from '../../store/useCircuitStore';
import { screenToCanvas, snapPoint, normalizeRect } from '../../utils/geometry';
import { getComponentDef } from '../../services/componentLibrary';
import { nanoid } from '../../utils/nanoid';
import ComponentSymbol from './ComponentSymbol';
import WireLayer from './WireLayer';
import { useTouchGestures } from '../../hooks/useTouchGestures';
import type { Point, CircuitComponent } from '../../types';

const GRID = 20;

interface DragState {
  componentId: string;
  startMouse: Point;
  startPos: Point;
}

interface PanState {
  startMouse: Point;
  startTransform: Point;
}

export const CircuitCanvas: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Touch support (pinch-to-zoom, two-finger pan)
  useTouchGestures(svgRef);
  const {
    components, wires, wireInProgress,
    canvas, setTransform, setZoom,
    activeTool, setActiveTool,
    selectedIds, setSelectedIds, clearSelection, toggleSelect,
    addComponent, updateComponent, removeComponents,
    addWirePoint, finishWire, startWire, cancelWire,
    pushHistory,
  } = useCircuitStore();

  const [dragState, setDragState] = useState<DragState | null>(null);
  const [panState, setPanState] = useState<PanState | null>(null);
  const [selBox, setSelBox] = useState<{ start: Point; end: Point } | null>(null);
  const [hoveredPin, setHoveredPin] = useState<{ compId: string; pinId: string } | null>(null);

  const { transform, showGrid } = canvas;

  /* ── Coordinate helpers ─────────────────────────── */
  const getSVGPoint = useCallback((e: React.MouseEvent | MouseEvent): Point => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const toCanvas = useCallback((screen: Point) => screenToCanvas(screen, transform), [transform]);

  /* ── Drop from sidebar ──────────────────────────── */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('component-type');
    if (!type) return;
    const def = getComponentDef(type);
    if (!def) return;
    const screen = getSVGPoint(e as unknown as React.MouseEvent);
    const pos = snapPoint(toCanvas(screen), GRID);
    const id = nanoid();
    const newComp: CircuitComponent = {
      id, type,
      position: { x: pos.x - def.defaultSize.width / 2, y: pos.y - def.defaultSize.height / 2 },
      rotation: 0,
      pins: def.pins,
      properties: { ...def.defaultProperties },
      label: def.label,
      value: def.defaultProperties.value ?? '',
      size: def.defaultSize,
      selected: false,
      locked: false,
      zIndex: components.length,
    };
    addComponent(newComp);
    setSelectedIds([id]);
  }, [getSVGPoint, toCanvas, components.length, addComponent, setSelectedIds]);

  /* ── Wheel zoom ─────────────────────────────────── */
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const screen = { x: e.clientX - svgRef.current!.getBoundingClientRect().left, y: e.clientY - svgRef.current!.getBoundingClientRect().top };
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(transform.zoom * delta, screen);
  }, [transform.zoom, setZoom]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  /* ── Mouse down ─────────────────────────────────── */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setPanState({ startMouse: { x: e.clientX, y: e.clientY }, startTransform: { x: transform.x, y: transform.y } });
      return;
    }
    if (e.button !== 0) return;

    const target = e.target as SVGElement;
    const compEl = target.closest('[data-id]') as SVGGElement | null;

    if (activeTool === 'wire') {
      const pos = snapPoint(toCanvas(getSVGPoint(e)), GRID);
      if (wireInProgress) addWirePoint(pos);
      else startWire(pos);
      return;
    }

    if (activeTool === 'erase') {
      if (compEl) removeComponents([compEl.dataset.id!]);
      return;
    }

    if (compEl) {
      const id = compEl.dataset.id!;
      if (!e.shiftKey && !selectedIds.includes(id)) clearSelection();
      toggleSelect(id);
      const comp = components.find((c) => c.id === id);
      if (comp) {
        setDragState({ componentId: id, startMouse: getSVGPoint(e), startPos: { ...comp.position } });
      }
    } else {
      clearSelection();
      const pos = toCanvas(getSVGPoint(e));
      setSelBox({ start: pos, end: pos });
    }
  }, [activeTool, transform, wireInProgress, selectedIds, components, toCanvas, getSVGPoint, addWirePoint, startWire, removeComponents, clearSelection, toggleSelect]);

  /* ── Mouse move ─────────────────────────────────── */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (panState) {
      setTransform({
        x: panState.startTransform.x + (e.clientX - panState.startMouse.x),
        y: panState.startTransform.y + (e.clientY - panState.startMouse.y),
      });
      return;
    }
    if (dragState) {
      const screen = getSVGPoint(e);
      const delta = {
        x: (screen.x - dragState.startMouse.x) / transform.zoom,
        y: (screen.y - dragState.startMouse.y) / transform.zoom,
      };
      const newPos = snapPoint({ x: dragState.startPos.x + delta.x, y: dragState.startPos.y + delta.y }, GRID);
      updateComponent(dragState.componentId, { position: newPos });
      if (selectedIds.length > 1) {
        selectedIds.filter((id) => id !== dragState.componentId).forEach((id) => {
          const c = components.find((x) => x.id === id);
          if (c) updateComponent(id, { position: snapPoint({ x: c.position.x + delta.x / 20, y: c.position.y + delta.y / 20 }, GRID) });
        });
      }
      return;
    }
    if (selBox) {
      const pos = toCanvas(getSVGPoint(e));
      setSelBox((s) => s ? { ...s, end: pos } : null);
    }
  }, [panState, dragState, selBox, transform.zoom, getSVGPoint, setTransform, updateComponent, selectedIds, components, toCanvas]);

  /* ── Mouse up ───────────────────────────────────── */
  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (dragState) { pushHistory('Move component'); setDragState(null); }
    if (panState) setPanState(null);
    if (selBox) {
      const rect = normalizeRect(selBox.start, selBox.end);
      if (rect.width > 5 || rect.height > 5) {
        const inRect = components
          .filter((c) => c.position.x < rect.x + rect.width && c.position.x + c.size.width > rect.x && c.position.y < rect.y + rect.height && c.position.y + c.size.height > rect.y)
          .map((c) => c.id);
        setSelectedIds(inRect);
      }
      setSelBox(null);
    }
  }, [dragState, panState, selBox, components, pushHistory, setSelectedIds]);

  /* ── Double-click to finish wire ────────────────── */
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (activeTool === 'wire' && wireInProgress) {
      finishWire();
    }
  }, [activeTool, wireInProgress, finishWire]);

  /* ── Keyboard ───────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { cancelWire(); clearSelection(); setActiveTool('select'); }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length) removeComponents(selectedIds);
      }
      if (e.key === 'v' && !e.ctrlKey) setActiveTool('select');
      if (e.key === 'w' && !e.ctrlKey) setActiveTool('wire');
      if (e.key === 'e' && !e.ctrlKey) setActiveTool('erase');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedIds, cancelWire, clearSelection, setActiveTool, removeComponents]);

  /* ── Grid pattern ───────────────────────────────── */
  const gridPath = React.useMemo(() => {
    const size = GRID * transform.zoom;
    const ox = transform.x % size;
    const oy = transform.y % size;
    return { size, ox, oy };
  }, [transform]);

  const selRect = selBox ? normalizeRect(selBox.start, selBox.end) : null;

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ cursor: activeTool === 'wire' ? 'crosshair' : activeTool === 'erase' ? 'cell' : panState ? 'grabbing' : 'default', background: 'transparent' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <defs>
        <pattern id="grid-dot" x={gridPath.ox} y={gridPath.oy} width={gridPath.size} height={gridPath.size} patternUnits="userSpaceOnUse">
          <circle cx={0} cy={0} r={1} fill="rgba(100,116,139,0.35)" />
        </pattern>
        <pattern id="grid-major" x={gridPath.ox} y={gridPath.oy} width={gridPath.size * 5} height={gridPath.size * 5} patternUnits="userSpaceOnUse">
          <rect width={gridPath.size * 5} height={gridPath.size * 5} fill="none" stroke="rgba(100,116,139,0.12)" strokeWidth={0.5} />
        </pattern>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#00d4f0" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grid */}
      {showGrid && (
        <g>
          <rect width="100%" height="100%" fill="url(#grid-dot)" />
          <rect width="100%" height="100%" fill="url(#grid-major)" />
        </g>
      )}

      {/* Canvas transform group */}
      <g transform={`translate(${transform.x},${transform.y}) scale(${transform.zoom})`}>
        {/* Wires */}
        <WireLayer wires={wires} wireInProgress={wireInProgress} />

        {/* Components */}
        {components.map((comp) => (
          <ComponentSymbol
            key={comp.id}
            component={comp}
            isSelected={selectedIds.includes(comp.id)}
            zoom={transform.zoom}
          />
        ))}
      </g>

      {/* Selection rectangle (screen space) */}
      {selRect && (
        <rect
          x={selRect.x * transform.zoom + transform.x}
          y={selRect.y * transform.zoom + transform.y}
          width={selRect.width * transform.zoom}
          height={selRect.height * transform.zoom}
          fill="rgba(0,212,240,0.06)"
          stroke="rgba(0,212,240,0.6)"
          strokeWidth={1}
          strokeDasharray="4 3"
        />
      )}
    </svg>
  );
};

export default CircuitCanvas;
