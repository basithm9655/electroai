# CircuitOS — Complete Project Summary

> **"Figma + LTspice + Tinkercad + AI Copilot"**

---

## Quick Start

```bash
cd /home/basi/Downloads/ELEROAI/circuit-os
npm run dev       # Dev server → http://localhost:5173
npm run build     # Production build
```

---

## Folder Structure

```
circuit-os/
├── public/favicon.svg
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── CircuitCanvas.tsx      # SVG infinite canvas, pan/zoom/drag
│   │   │   ├── ComponentSymbol.tsx    # SVG symbol renderer per type
│   │   │   └── WireLayer.tsx          # Orthogonal wire routing
│   │   ├── sidebar/ComponentSidebar.tsx  # Collapsible category library + search
│   │   ├── toolbar/TopToolbar.tsx        # Tool modes, file ops, simulation
│   │   ├── properties/PropertiesPanel.tsx # Dynamic right panel
│   │   ├── simulation/SimulationPanel.tsx # Bottom console + logs
│   │   ├── ui/AIPanel.tsx               # AI assistant slide-over
│   │   └── AppLayout.tsx                # Animated panel layout
│   ├── services/componentLibrary.ts     # 50+ component defs + search
│   ├── store/useCircuitStore.ts         # Zustand state + localStorage persist
│   ├── types/index.ts                   # All TypeScript interfaces
│   ├── utils/geometry.ts                # Canvas math helpers
│   ├── utils/nanoid.ts                  # Lightweight ID generator
│   ├── App.tsx / main.tsx / index.css
├── index.html                           # PWA meta + fonts
├── vite.config.ts                       # Vite + vite-plugin-pwa
├── tailwind.config.js                   # Custom design tokens
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS v3 (custom theme) |
| Animation | Framer Motion |
| State | Zustand v4 + persist middleware |
| Icons | Lucide React |
| PWA | vite-plugin-pwa + Workbox |
| Rendering | Custom SVG (no third-party canvas lib) |

---

## Design System Tokens

| Token | Hex | Use |
|-------|-----|-----|
| `surface-0` | `#060912` | Canvas background |
| `surface-50` | `#0a0f1e` | App background |
| `surface-100` | `#0d1426` | Panel backgrounds |
| `neon-400` | `#00d4f0` | Primary accent, selections |
| `electric-500` | `#0ea5e9` | Wire color |
| `violet-500` | `#8b5cf6` | AI panel, digital |
| `emerald-400` | `#34d399` | Success / simulation |
| `rose-400` | `#fb7185` | Errors / delete |

**Fonts:** Inter · Outfit (display) · JetBrains Mono (console/labels)

---

## Component Library (50+ across 10 categories)

| Category | Components |
|----------|-----------|
| Power | Battery, DC Supply, AC Supply, Ground, Current Source |
| Passive | Resistor, Potentiometer, Capacitor, Polar Cap, Inductor, Transformer |
| Semiconductor | Diode, Zener, LED, Schottky, NPN/PNP BJT, NMOS/PMOS |
| Digital | AND, OR, NOT, NAND, NOR, XOR gates; D FF, JK FF |
| Analog | Op-Amp 741, Comparator |
| IC | 555 Timer, Multiplexer, ADC, DAC |
| Display | LED, 7-Segment, Oscilloscope |
| Input | Switch, Push Button, Clock Generator |
| Sensors | Temp LM35, LDR, Ultrasonic HC-SR04 |
| MCU | Arduino UNO, ESP32 |

---

## Canvas Keyboard Controls

| Action | Shortcut |
|--------|---------|
| Select tool | V |
| Wire tool | W |
| Erase tool | E |
| Cancel / deselect | Esc |
| Delete selected | Delete / Backspace |
| Pan | Alt+Drag or Middle Mouse |
| Zoom | Scroll wheel |
| Finish wire | Double-click |
| Multi-select | Shift+Click |
| Drop component | Drag from sidebar |

---

## TypeScript Data Model

```typescript
interface CircuitComponent {
  id: string;
  type: string;           // 'resistor' | 'led' | 'npn' | ...
  position: Point;        // { x, y } in grid units
  rotation: number;       // 0 | 90 | 180 | 270
  pins: Pin[];
  properties: ComponentProperties;
  label: string;          // 'R1', 'C2', ...
  value: string;          // '10kΩ', '1µF', ...
  size: Size;
  selected: boolean;
  locked: boolean;
  zIndex: number;
}
```

---

## Zustand Store

- **Project** — name, id, timestamps
- **Components** — add, update, remove, duplicate
- **Wires** — add, update, remove, in-progress drawing state
- **Selection** — selectedIds, toggle, selectAll, clear
- **Canvas** — transform (x,y,zoom), grid visibility, snap
- **Tool** — select / wire / erase mode
- **History** — undo/redo stack (50-state max)
- **Simulation** — idle/running/complete status, colored logs
- **AI** — panel open, message thread
- **Panels** — left/right/bottom open state
- **IO** — exportJSON, importJSON, newProject
- **Persist** — auto-saves components+wires to localStorage

---

## PWA

- Installable with Web App Manifest
- Offline via Workbox (CacheFirst for fonts, assets)
- Auto-updates (registerType: autoUpdate)
- Standalone display, landscape-primary orientation
- iOS safe-area CSS support

---

## AI Panel

- Slide-over panel (320px, right side)
- Suggestion chips for common circuits
- Contextual answers based on live circuit state
- Simulated responses; ready for real API:
  - Update `getAIResponse()` in `AIPanel.tsx`
  - Connect to OpenAI / Gemini / Anthropic endpoint

---

## Layout Diagram

```
┌──────────────────────────────────────────────┐
│                Top Toolbar                   │
├────────┬─────────────────────────────┬───────┤
│ Left   │                             │ Right │
│ Sidebar│  SVG Canvas (infinite)      │ Props │
│ 220px  │  pan/zoom/drag-drop         │ 240px │
│        │  + AI Panel overlay 320px   │       │
├────────┴─────────────────────────────┴───────┤
│          Simulation Console 180px            │
└──────────────────────────────────────────────┘
```

All 4 panels collapse with animated Framer Motion springs.

---

## Future Roadmap

| Feature | Status |
|---------|--------|
| SPICE netlist export | Planned |
| Real simulation engine | Planned |
| AI circuit generation | Planned (hook ready) |
| PCB layout mode | Planned |
| Multiplayer | Planned |
| Electron/Tauri desktop | Planned (compatible arch) |
| Cloud project sync | Planned |
| Waveform viewer | Planned |

---

*CircuitOS v1.0.0*
