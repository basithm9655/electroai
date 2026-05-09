// ─── Core Geometry ──────────────────────────────────────────────────────────
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Point, Size {}

export interface Transform {
  x: number;
  y: number;
  zoom: number;
}

// ─── Component Pins ─────────────────────────────────────────────────────────
export interface Pin {
  id: string;
  label: string;
  /** Relative to component origin, in grid units */
  x: number;
  y: number;
  direction: 'in' | 'out' | 'inout' | 'power' | 'ground';
}

// ─── Component Categories ────────────────────────────────────────────────────
export type ComponentCategory =
  | 'power'
  | 'passive'
  | 'semiconductor'
  | 'digital'
  | 'analog'
  | 'ic'
  | 'display'
  | 'input'
  | 'sensor'
  | 'mcu';

// ─── Component Properties ────────────────────────────────────────────────────
export interface ComponentProperties {
  // Passive
  resistance?: number;
  capacitance?: number;
  inductance?: number;
  // Power
  voltage?: number;
  current?: number;
  frequency?: number;
  // Semiconductor
  forwardVoltage?: number;
  beta?: number;
  // Labels
  label?: string;
  value?: string;
  unit?: string;
  // Visual
  color?: string;
  // Digital
  logicFamily?: 'CMOS' | 'TTL' | 'ECL';
  // Custom key-value
  [key: string]: unknown;
}

// ─── Circuit Component ───────────────────────────────────────────────────────
export interface CircuitComponent {
  id: string;
  type: string;
  /** Canvas position in grid units */
  position: Point;
  /** Rotation in degrees (0, 90, 180, 270) */
  rotation: number;
  pins: Pin[];
  properties: ComponentProperties;
  label: string;
  value: string;
  /** Visual bounding box in grid units */
  size: Size;
  selected: boolean;
  locked: boolean;
  zIndex: number;
}

// ─── Wire ────────────────────────────────────────────────────────────────────
export interface WirePoint {
  x: number;
  y: number;
}

export interface Wire {
  id: string;
  points: WirePoint[];
  /** [componentId, pinId] */
  fromPin?: [string, string];
  toPin?: [string, string];
  selected: boolean;
  animated: boolean;
  /** Simulated current value */
  currentValue?: number;
}

// ─── Component Definition (library) ─────────────────────────────────────────
export interface ComponentDef {
  type: string;
  label: string;
  category: ComponentCategory;
  subcategory?: string;
  description?: string;
  icon?: string;
  emoji?: string;
  defaultProperties: ComponentProperties;
  defaultSize: Size;
  pins: Pin[];
  svgSymbol?: string;
  tags?: string[];
}

// ─── Project ─────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  version: string;
  components: CircuitComponent[];
  wires: Wire[];
  metadata?: Record<string, unknown>;
}

// ─── Simulation ──────────────────────────────────────────────────────────────
export type SimulationStatus = 'idle' | 'running' | 'paused' | 'complete' | 'error';

export interface SimulationResult {
  id: string;
  timestamp: number;
  status: SimulationStatus;
  duration: number;
  nodes: NodeVoltage[];
  logs: LogEntry[];
  errors: string[];
}

export interface NodeVoltage {
  nodeId: string;
  label: string;
  voltages: number[];
  times: number[];
}

export type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  source?: string;
}

// ─── Canvas State ─────────────────────────────────────────────────────────────
export interface CanvasState {
  transform: Transform;
  gridSize: number;
  showGrid: boolean;
  snapToGrid: boolean;
  selectionRect?: Rect;
}

// ─── Tool Mode ────────────────────────────────────────────────────────────────
export type ToolMode =
  | 'select'
  | 'wire'
  | 'pan'
  | 'erase'
  | 'comment';

// ─── History (undo/redo) ─────────────────────────────────────────────────────
export interface HistoryEntry {
  id: string;
  description: string;
  components: CircuitComponent[];
  wires: Wire[];
  timestamp: number;
}

// ─── Keyboard Shortcut ────────────────────────────────────────────────────────
export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  action: string;
}

// ─── AI ──────────────────────────────────────────────────────────────────────
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  thinking?: boolean;
}

export interface AIContext {
  projectName: string;
  componentCount: number;
  wireCount: number;
  components: Array<{ type: string; label: string; value: string }>;
}
