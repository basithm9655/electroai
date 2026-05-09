import React from 'react';
import type { CircuitComponent } from '../../types';

interface Props { component: CircuitComponent; isSelected: boolean; zoom: number; }

const PIN_R = 4;
const SEL_COLOR = '#00d4f0';
const STROKE = '#94a3b8';

function PinDots({ component }: { component: CircuitComponent }) {
  return (
    <>
      {component.pins.map((pin) => (
        <circle
          key={pin.id}
          cx={pin.x} cy={pin.y}
          r={PIN_R}
          fill="#0d1426"
          stroke={SEL_COLOR}
          strokeWidth={1.5}
          className="cursor-crosshair transition-all hover:r-6"
        />
      ))}
    </>
  );
}

function SelectionBox({ w, h }: { w: number; h: number }) {
  return (
    <rect
      x={-6} y={-6} width={w + 12} height={h + 12}
      fill="none"
      stroke={SEL_COLOR}
      strokeWidth={1.5}
      strokeDasharray="4 3"
      rx={4}
      className="animate-pulse"
    />
  );
}

/* ── Symbol renderers by type ───────────────────────────── */
function SymbolResistor({ w, h }: { w: number; h: number }) {
  const cx = w / 2, cy = h / 2;
  return (
    <g>
      <line x1={0} y1={cy} x2={cx - 18} y2={cy} stroke={STROKE} strokeWidth={2} />
      <rect x={cx - 18} y={cy - 8} width={36} height={16} rx={2} fill="none" stroke={SEL_COLOR} strokeWidth={1.8} />
      <line x1={cx + 18} y1={cy} x2={w} y2={cy} stroke={STROKE} strokeWidth={2} />
    </g>
  );
}

function SymbolCapacitor({ w, h }: { w: number; h: number }) {
  const cx = w / 2, cy = h / 2;
  return (
    <g>
      <line x1={0} y1={cy} x2={cx - 6} y2={cy} stroke={STROKE} strokeWidth={2} />
      <line x1={cx - 6} y1={cy - 12} x2={cx - 6} y2={cy + 12} stroke={SEL_COLOR} strokeWidth={3} />
      <line x1={cx + 6} y1={cy - 12} x2={cx + 6} y2={cy + 12} stroke={SEL_COLOR} strokeWidth={3} />
      <line x1={cx + 6} y1={cy} x2={w} y2={cy} stroke={STROKE} strokeWidth={2} />
    </g>
  );
}

function SymbolInductor({ w, h }: { w: number; h: number }) {
  const cy = h / 2;
  const arcs = [14, 26, 38, 50];
  return (
    <g>
      <line x1={0} y1={cy} x2={10} y2={cy} stroke={STROKE} strokeWidth={2} />
      {arcs.map((x) => (
        <path key={x} d={`M${x} ${cy} a6 6 0 0 1 12 0`} fill="none" stroke={SEL_COLOR} strokeWidth={1.8} />
      ))}
      <line x1={62} y1={cy} x2={w} y2={cy} stroke={STROKE} strokeWidth={2} />
    </g>
  );
}

function SymbolBattery({ w, h }: { w: number; h: number }) {
  const cy = h / 2;
  return (
    <g>
      <line x1={0} y1={cy} x2={20} y2={cy} stroke={STROKE} strokeWidth={2} />
      <line x1={20} y1={cy - 12} x2={20} y2={cy + 12} stroke={SEL_COLOR} strokeWidth={3} />
      <line x1={28} y1={cy - 7} x2={28} y2={cy + 7} stroke={SEL_COLOR} strokeWidth={2} />
      <line x1={28} y1={cy} x2={w} y2={cy} stroke={STROKE} strokeWidth={2} />
      <text x={16} y={cy - 14} fontSize={9} fill="#34d399" textAnchor="middle">+</text>
      <text x={32} y={cy - 14} fontSize={9} fill="#f87171" textAnchor="middle">−</text>
    </g>
  );
}

function SymbolGround({ w, h }: { w: number; h: number }) {
  const cx = w / 2;
  return (
    <g>
      <line x1={cx} y1={0} x2={cx} y2={12} stroke={STROKE} strokeWidth={2} />
      <line x1={cx - 14} y1={12} x2={cx + 14} y2={12} stroke={SEL_COLOR} strokeWidth={2.5} />
      <line x1={cx - 9} y1={18} x2={cx + 9} y2={18} stroke={SEL_COLOR} strokeWidth={2} />
      <line x1={cx - 4} y1={24} x2={cx + 4} y2={24} stroke={SEL_COLOR} strokeWidth={1.5} />
    </g>
  );
}

function SymbolDiode({ w, h }: { w: number; h: number }) {
  const cy = h / 2, cx = w / 2;
  return (
    <g>
      <line x1={0} y1={cy} x2={cx - 12} y2={cy} stroke={STROKE} strokeWidth={2} />
      <polygon points={`${cx - 12},${cy - 10} ${cx - 12},${cy + 10} ${cx + 10},${cy}`} fill="none" stroke={SEL_COLOR} strokeWidth={1.8} />
      <line x1={cx + 10} y1={cy - 10} x2={cx + 10} y2={cy + 10} stroke={SEL_COLOR} strokeWidth={2} />
      <line x1={cx + 10} y1={cy} x2={w} y2={cy} stroke={STROKE} strokeWidth={2} />
    </g>
  );
}

function SymbolLED({ w, h, color }: { w: number; h: number; color?: string }) {
  const cy = h / 2, cx = w / 2;
  const c = color ?? '#00d4f0';
  return (
    <g>
      <line x1={0} y1={cy} x2={cx - 12} y2={cy} stroke={STROKE} strokeWidth={2} />
      <polygon points={`${cx - 12},${cy - 10} ${cx - 12},${cy + 10} ${cx + 10},${cy}`} fill={c + '30'} stroke={c} strokeWidth={1.8} />
      <line x1={cx + 10} y1={cy - 10} x2={cx + 10} y2={cy + 10} stroke={c} strokeWidth={2} />
      <line x1={cx + 10} y1={cy} x2={w} y2={cy} stroke={STROKE} strokeWidth={2} />
      <line x1={cx + 14} y1={cy - 8} x2={cx + 20} y2={cy - 16} stroke={c} strokeWidth={1.5} markerEnd="url(#arrow)" />
      <line x1={cx + 18} y1={cy - 4} x2={cx + 24} y2={cy - 12} stroke={c} strokeWidth={1.5} />
    </g>
  );
}

function SymbolNPN({ w, h }: { w: number; h: number }) {
  const mx = 30;
  return (
    <g>
      <line x1={0} y1={h / 2} x2={mx} y2={h / 2} stroke={STROKE} strokeWidth={2} />
      <line x1={mx} y1={8} x2={mx} y2={h - 8} stroke={SEL_COLOR} strokeWidth={2.5} />
      <line x1={mx} y1={16} x2={w - 10} y2={4} stroke={SEL_COLOR} strokeWidth={2} />
      <line x1={mx} y1={h - 16} x2={w - 10} y2={h - 4} stroke={SEL_COLOR} strokeWidth={2} />
      <polygon points={`${w - 18},${h - 8} ${w - 10},${h - 4} ${w - 14},${h - 14}`} fill={SEL_COLOR} />
      <line x1={w - 10} y1={4} x2={w} y2={4} stroke={STROKE} strokeWidth={2} />
      <line x1={w - 10} y1={h - 4} x2={w} y2={h - 4} stroke={STROKE} strokeWidth={2} />
    </g>
  );
}

function SymbolOpAmp({ w, h }: { w: number; h: number }) {
  return (
    <g>
      <polygon points={`0,0 0,${h} ${w},${h / 2}`} fill="none" stroke={SEL_COLOR} strokeWidth={1.8} />
      <line x1={0} y1={h * 0.25} x2={12} y2={h * 0.25} stroke={STROKE} strokeWidth={1.5} />
      <line x1={0} y1={h * 0.75} x2={12} y2={h * 0.75} stroke={STROKE} strokeWidth={1.5} />
      <text x={8} y={h * 0.25 + 4} fontSize={10} fill="#34d399">+</text>
      <text x={8} y={h * 0.75 + 4} fontSize={10} fill="#f87171">−</text>
      <line x1={w} y1={h / 2} x2={w + 4} y2={h / 2} stroke={STROKE} strokeWidth={2} />
    </g>
  );
}

function SymbolGate({ type, w, h }: { type: string; w: number; h: number }) {
  const cy = h / 2;
  const colors: Record<string, string> = { and:'#3b82f6', or:'#8b5cf6', not:'#ec4899', nand:'#06b6d4', nor:'#f59e0b', xor:'#10b981' };
  const c = colors[type] ?? SEL_COLOR;
  return (
    <g>
      <rect x={8} y={4} width={w - 16} height={h - 8} rx={type === 'and' ? (h - 8) / 2 : 4} fill={c + '18'} stroke={c} strokeWidth={1.8} />
      <text x={w / 2} y={cy + 5} textAnchor="middle" fontSize={11} fontWeight="700" fill={c} fontFamily="JetBrains Mono, monospace">
        {type.toUpperCase()}
      </text>
      <line x1={0} y1={cy - 8} x2={8} y2={cy - 8} stroke={STROKE} strokeWidth={2} />
      <line x1={0} y1={cy + 8} x2={8} y2={cy + 8} stroke={STROKE} strokeWidth={2} />
      <line x1={w - 8} y1={cy} x2={w} y2={cy} stroke={STROKE} strokeWidth={2} />
      {(type === 'nand' || type === 'nor') && <circle cx={w - 4} cy={cy} r={4} fill="none" stroke={c} strokeWidth={1.5} />}
    </g>
  );
}

function SymbolIC({ label, w, h }: { label: string; w: number; h: number }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={4} fill="rgba(139,92,246,0.12)" stroke="#8b5cf6" strokeWidth={1.8} />
      <text x={w / 2} y={h / 2 + 5} textAnchor="middle" fontSize={11} fontWeight="700" fill="#a78bfa" fontFamily="JetBrains Mono, monospace">{label}</text>
    </g>
  );
}

function SymbolGeneric({ type, w, h }: { type: string; w: number; h: number }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h} rx={4} fill="rgba(0,212,240,0.08)" stroke={SEL_COLOR} strokeWidth={1.5} strokeDasharray="4 2" />
      <text x={w / 2} y={h / 2 + 5} textAnchor="middle" fontSize={10} fill={SEL_COLOR} fontFamily="JetBrains Mono, monospace">{type}</text>
    </g>
  );
}

/* ── Main component renderer ─────────────────────────────── */
export const ComponentSymbol: React.FC<Props> = ({ component, isSelected }) => {
  const { type, position, rotation, size, label, value, properties } = component;
  const { width: w, height: h } = size;
  const cx = position.x + w / 2;
  const cy = position.y + h / 2;

  const renderSymbol = () => {
    switch (type) {
      case 'resistor': case 'potentiometer': return <SymbolResistor w={w} h={h} />;
      case 'capacitor': case 'cap_polar': return <SymbolCapacitor w={w} h={h} />;
      case 'inductor': return <SymbolInductor w={w} h={h} />;
      case 'battery': return <SymbolBattery w={w} h={h} />;
      case 'gnd': return <SymbolGround w={w} h={h} />;
      case 'diode': case 'zener': case 'schottky': return <SymbolDiode w={w} h={h} />;
      case 'led': case 'led_display': return <SymbolLED w={w} h={h} color={properties.color as string} />;
      case 'npn': case 'pnp': return <SymbolNPN w={w} h={h} />;
      case 'opamp': case 'comparator': return <SymbolOpAmp w={w} h={h} />;
      case 'and': case 'or': case 'not': case 'nand': case 'nor': case 'xor': case 'xnor':
        return <SymbolGate type={type} w={w} h={h} />;
      case '555timer': return <SymbolIC label="555" w={w} h={h} />;
      case 'arduino': return <SymbolIC label="ARDUINO" w={w} h={h} />;
      case 'esp32': return <SymbolIC label="ESP32" w={w} h={h} />;
      case 'adc': return <SymbolIC label="ADC" w={w} h={h} />;
      case 'dac': return <SymbolIC label="DAC" w={w} h={h} />;
      case 'mux': return <SymbolIC label="MUX" w={w} h={h} />;
      default: return <SymbolGeneric type={type} w={w} h={h} />;
    }
  };

  return (
    <g
      transform={`translate(${position.x},${position.y}) rotate(${rotation},${w / 2},${h / 2})`}
      style={{ cursor: 'move' }}
      data-id={component.id}
    >
      {isSelected && <SelectionBox w={w} h={h} />}
      {renderSymbol()}
      <PinDots component={component} />
      {/* Label */}
      <text
        x={w / 2} y={h + 14}
        textAnchor="middle"
        fontSize={10}
        fontWeight="600"
        fill="#94a3b8"
        fontFamily="JetBrains Mono, monospace"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >{label}</text>
      {value && (
        <text
          x={w / 2} y={h + 26}
          textAnchor="middle"
          fontSize={9}
          fill="#475569"
          fontFamily="JetBrains Mono, monospace"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >{value}</text>
      )}
    </g>
  );
};

export default ComponentSymbol;
