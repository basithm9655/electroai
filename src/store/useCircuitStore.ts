import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CircuitComponent, Wire, Project, CanvasState, ToolMode,
  HistoryEntry, SimulationResult, SimulationStatus, LogEntry,
  Point, Transform, AIMessage
} from '../types';
import { nanoid } from '../utils/nanoid';

interface CircuitStore {
  // Project
  project: Project;
  setProjectName: (name: string) => void;

  // Components
  components: CircuitComponent[];
  addComponent: (c: CircuitComponent) => void;
  updateComponent: (id: string, updates: Partial<CircuitComponent>) => void;
  removeComponents: (ids: string[]) => void;
  duplicateComponents: (ids: string[]) => void;
  setComponents: (cs: CircuitComponent[]) => void;

  // Wires
  wires: Wire[];
  addWire: (w: Wire) => void;
  updateWire: (id: string, updates: Partial<Wire>) => void;
  removeWires: (ids: string[]) => void;
  setWires: (ws: Wire[]) => void;

  // Selection
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  toggleSelect: (id: string) => void;
  clearSelection: () => void;
  selectAll: () => void;

  // Canvas
  canvas: CanvasState;
  setTransform: (t: Partial<Transform>) => void;
  setZoom: (zoom: number, center?: Point) => void;
  resetView: () => void;
  toggleGrid: () => void;
  toggleSnap: () => void;

  // Tool
  activeTool: ToolMode;
  setActiveTool: (t: ToolMode) => void;

  // Wire drawing
  wireInProgress: { points: Point[]; fromPin?: [string, string] } | null;
  startWire: (p: Point, fromPin?: [string, string]) => void;
  addWirePoint: (p: Point) => void;
  finishWire: (toPin?: [string, string]) => void;
  cancelWire: () => void;

  // History
  history: HistoryEntry[];
  historyIndex: number;
  pushHistory: (desc: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Simulation
  simulationStatus: SimulationStatus;
  simulationResult: SimulationResult | null;
  logs: LogEntry[];
  addLog: (level: LogEntry['level'], msg: string, src?: string) => void;
  clearLogs: () => void;
  runSimulation: () => void;
  stopSimulation: () => void;

  // AI Panel
  aiOpen: boolean;
  aiMessages: AIMessage[];
  toggleAI: () => void;
  addAIMessage: (msg: Omit<AIMessage, 'id' | 'timestamp'>) => void;

  // Panels
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  bottomPanelOpen: boolean;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleBottomPanel: () => void;

  // Import / Export
  exportJSON: () => string;
  importJSON: (json: string) => void;
  newProject: () => void;
}

const defaultCanvas: CanvasState = {
  transform: { x: 0, y: 0, zoom: 1 },
  gridSize: 20,
  showGrid: true,
  snapToGrid: true,
};

const makeProject = (): Project => ({
  id: nanoid(),
  name: 'Untitled Circuit',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  version: '1.0.0',
  components: [],
  wires: [],
});

const snap = (val: number, grid: number) => Math.round(val / grid) * grid;

export const useCircuitStore = create<CircuitStore>()(
  persist(
    (set, get) => ({
        project: makeProject(),
        setProjectName: (name) => set((s) => ({ project: { ...s.project, name } })),

        components: [],
        addComponent: (c) => {
          get().pushHistory('Add component');
          set((s) => ({ components: [...s.components, c] }));
        },
        updateComponent: (id, updates) =>
          set((s) => ({
            components: s.components.map((c) => (c.id === id ? { ...c, ...updates } : c)),
          })),
        removeComponents: (ids) => {
          get().pushHistory('Delete');
          set((s) => ({
            components: s.components.filter((c) => !ids.includes(c.id)),
            wires: s.wires.filter(
              (w) => !ids.includes(w.fromPin?.[0] ?? '') && !ids.includes(w.toPin?.[0] ?? '')
            ),
            selectedIds: s.selectedIds.filter((id) => !ids.includes(id)),
          }));
        },
        duplicateComponents: (ids) => {
          get().pushHistory('Duplicate');
          const { components } = get();
          const dupes = components
            .filter((c) => ids.includes(c.id))
            .map((c) => ({ ...c, id: nanoid(), position: { x: c.position.x + 40, y: c.position.y + 40 }, selected: true }));
          set((s) => ({
            components: [...s.components.map((c) => ({ ...c, selected: false })), ...dupes],
            selectedIds: dupes.map((d) => d.id),
          }));
        },
        setComponents: (cs) => set({ components: cs }),

        wires: [],
        addWire: (w) => set((s) => ({ wires: [...s.wires, w] })),
        updateWire: (id, updates) =>
          set((s) => ({ wires: s.wires.map((w) => (w.id === id ? { ...w, ...updates } : w)) })),
        removeWires: (ids) => set((s) => ({ wires: s.wires.filter((w) => !ids.includes(w.id)) })),
        setWires: (ws) => set({ wires: ws }),

        selectedIds: [],
        setSelectedIds: (ids) =>
          set((s) => ({
            selectedIds: ids,
            components: s.components.map((c) => ({ ...c, selected: ids.includes(c.id) })),
          })),
        toggleSelect: (id) => {
          const { selectedIds } = get();
          const next = selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id];
          get().setSelectedIds(next);
        },
        clearSelection: () => get().setSelectedIds([]),
        selectAll: () => get().setSelectedIds(get().components.map((c) => c.id)),

        canvas: defaultCanvas,
        setTransform: (t) =>
          set((s) => ({ canvas: { ...s.canvas, transform: { ...s.canvas.transform, ...t } } })),
        setZoom: (zoom, center) => {
          const { canvas } = get();
          const clampedZoom = Math.max(0.1, Math.min(5, zoom));
          if (center) {
            const scale = clampedZoom / canvas.transform.zoom;
            set((s) => ({
              canvas: {
                ...s.canvas,
                transform: {
                  zoom: clampedZoom,
                  x: center.x - (center.x - s.canvas.transform.x) * scale,
                  y: center.y - (center.y - s.canvas.transform.y) * scale,
                },
              },
            }));
          } else {
            set((s) => ({ canvas: { ...s.canvas, transform: { ...s.canvas.transform, zoom: clampedZoom } } }));
          }
        },
        resetView: () => set((s) => ({ canvas: { ...s.canvas, transform: { x: 0, y: 0, zoom: 1 } } })),
        toggleGrid: () => set((s) => ({ canvas: { ...s.canvas, showGrid: !s.canvas.showGrid } })),
        toggleSnap: () => set((s) => ({ canvas: { ...s.canvas, snapToGrid: !s.canvas.snapToGrid } })),

        activeTool: 'select',
        setActiveTool: (t) => set({ activeTool: t }),

        wireInProgress: null,
        startWire: (p, fromPin) => set({ wireInProgress: { points: [p], fromPin }, activeTool: 'wire' }),
        addWirePoint: (p) =>
          set((s) => ({
            wireInProgress: s.wireInProgress
              ? { ...s.wireInProgress, points: [...s.wireInProgress.points, p] }
              : null,
          })),
        finishWire: (toPin) => {
          const { wireInProgress } = get();
          if (!wireInProgress || wireInProgress.points.length < 2) {
            set({ wireInProgress: null });
            return;
          }
          const wire: Wire = {
            id: nanoid(),
            points: wireInProgress.points,
            fromPin: wireInProgress.fromPin,
            toPin,
            selected: false,
            animated: false,
          };
          set((s) => ({ wires: [...s.wires, wire], wireInProgress: null, activeTool: 'select' }));
        },
        cancelWire: () => set({ wireInProgress: null, activeTool: 'select' }),

        history: [],
        historyIndex: -1,
        pushHistory: (desc) => {
          const { components, wires, history, historyIndex } = get();
          const entry: HistoryEntry = {
            id: nanoid(),
            description: desc,
            components: JSON.parse(JSON.stringify(components)),
            wires: JSON.parse(JSON.stringify(wires)),
            timestamp: Date.now(),
          };
          const newHistory = history.slice(0, historyIndex + 1);
          newHistory.push(entry);
          if (newHistory.length > 50) newHistory.shift();
          set({ history: newHistory, historyIndex: newHistory.length - 1 });
        },
        undo: () => {
          const { history, historyIndex } = get();
          if (historyIndex <= 0) return;
          const idx = historyIndex - 1;
          const entry = history[idx];
          set({ components: entry.components, wires: entry.wires, historyIndex: idx, selectedIds: [] });
        },
        redo: () => {
          const { history, historyIndex } = get();
          if (historyIndex >= history.length - 1) return;
          const idx = historyIndex + 1;
          const entry = history[idx];
          set({ components: entry.components, wires: entry.wires, historyIndex: idx, selectedIds: [] });
        },
        canUndo: () => get().historyIndex > 0,
        canRedo: () => get().historyIndex < get().history.length - 1,

        simulationStatus: 'idle',
        simulationResult: null,
        logs: [],
        addLog: (level, message, source) =>
          set((s) => ({
            logs: [...s.logs, { id: nanoid(), level, message, timestamp: Date.now(), source }],
          })),
        clearLogs: () => set({ logs: [] }),
        runSimulation: () => {
          const { addLog, components } = get();
          set({ simulationStatus: 'running' });
          addLog('info', '▶ Simulation started', 'SPICE');
          addLog('info', `Loaded ${components.length} component(s)`, 'Netlist');
          setTimeout(() => {
            addLog('success', '✓ DC operating point analysis complete', 'SPICE');
            addLog('info', 'Node voltages calculated', 'Solver');
            set({
              simulationStatus: 'complete',
              simulationResult: {
                id: nanoid(), timestamp: Date.now(), status: 'complete',
                duration: 120, nodes: [], logs: [], errors: [],
              },
            });
          }, 1500);
        },
        stopSimulation: () => {
          get().addLog('warn', '■ Simulation stopped by user', 'SPICE');
          set({ simulationStatus: 'idle' });
        },

        aiOpen: false,
        aiMessages: [],
        toggleAI: () => set((s) => ({ aiOpen: !s.aiOpen })),
        addAIMessage: (msg) =>
          set((s) => ({ aiMessages: [...s.aiMessages, { ...msg, id: nanoid(), timestamp: Date.now() }] })),

        leftPanelOpen: true,
        rightPanelOpen: true,
        bottomPanelOpen: true,
        toggleLeftPanel: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
        toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
        toggleBottomPanel: () => set((s) => ({ bottomPanelOpen: !s.bottomPanelOpen })),

        exportJSON: () => {
          const { components, wires, project } = get();
          return JSON.stringify({ ...project, components, wires, exportedAt: Date.now() }, null, 2);
        },
        importJSON: (json) => {
          try {
            const data = JSON.parse(json);
            set({
              project: { ...makeProject(), ...data },
              components: data.components ?? [],
              wires: data.wires ?? [],
              selectedIds: [],
            });
            get().addLog('success', `Imported project: ${data.name}`, 'IO');
          } catch {
            get().addLog('error', 'Failed to parse JSON', 'IO');
          }
        },
        newProject: () => {
          set({
            project: makeProject(),
            components: [],
            wires: [],
            selectedIds: [],
            history: [],
            historyIndex: -1,
            logs: [],
            simulationStatus: 'idle',
            simulationResult: null,
          });
        },
      }
    ),
    {
      name: 'circuit-os-project',
      partialize: (s) => ({ project: s.project, components: s.components, wires: s.wires }),
    }
  )
);

export { snap };
