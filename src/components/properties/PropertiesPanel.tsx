import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, RotateCw, Trash2, Copy, Lock, Tag, Sliders } from 'lucide-react';
import { useCircuitStore } from '../../store/useCircuitStore';

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-neon-400/40 transition-all"
  />
);

export const PropertiesPanel: React.FC = () => {
  const { components, selectedIds, updateComponent, removeComponents, duplicateComponents } = useCircuitStore();

  const selected = components.filter((c) => selectedIds.includes(c.id));
  const single = selected.length === 1 ? selected[0] : null;

  const update = (field: string, value: unknown) => {
    if (!single) return;
    if (['label', 'value', 'rotation', 'locked'].includes(field)) {
      updateComponent(single.id, { [field]: value } as never);
    } else {
      updateComponent(single.id, { properties: { ...single.properties, [field]: value } });
    }
  };

  const rotate = (delta: number) => {
    if (!single) return;
    updateComponent(single.id, { rotation: ((single.rotation + delta) + 360) % 360 });
  };

  return (
    <div className="h-full flex flex-col bg-surface-100/80 backdrop-blur-xl border-l border-white/5">
      {/* Header */}
      <div className="p-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Sliders size={13} className="text-neon-400" />
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Properties</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* No selection */}
        {selected.length === 0 && (
          <div className="text-center py-10">
            <div className="w-10 h-10 rounded-full bg-white/4 flex items-center justify-center mx-auto mb-3">
              <Sliders size={16} className="text-slate-600" />
            </div>
            <p className="text-xs text-slate-600">Select a component<br />to view properties</p>
          </div>
        )}

        {/* Multi-select */}
        {selected.length > 1 && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">{selected.length} components selected</p>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => duplicateComponents(selectedIds)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-electric-500/10 border border-electric-500/25 text-electric-400 text-xs hover:bg-electric-500/20 transition-all"
              >
                <Copy size={12} /> Duplicate
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => removeComponents(selectedIds)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs hover:bg-rose-500/20 transition-all"
              >
                <Trash2 size={12} /> Delete All
              </motion.button>
            </div>
          </div>
        )}

        {/* Single component */}
        {single && (
          <>
            {/* Type badge */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-neon-400/5 border border-neon-400/15">
              <div className="w-6 h-6 rounded bg-neon-400/15 flex items-center justify-center">
                <span className="text-xs text-neon-400 font-mono">{single.type.slice(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{single.label}</p>
                <p className="text-[10px] text-slate-500 font-mono">{single.type}</p>
              </div>
            </div>

            {/* Label */}
            <Field label="Label">
              <div className="relative">
                <Tag size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  className="w-full bg-white/5 border border-white/8 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-neon-400/40 transition-all"
                  value={single.label}
                  onChange={(e) => update('label', e.target.value)}
                />
              </div>
            </Field>

            {/* Value */}
            <Field label="Value">
              <Input value={single.value} onChange={(e) => update('value', e.target.value)} />
            </Field>

            {/* Component-specific properties */}
            {single.properties.resistance !== undefined && (
              <Field label="Resistance (Ω)">
                <Input type="number" value={single.properties.resistance as number} onChange={(e) => update('resistance', parseFloat(e.target.value))} />
              </Field>
            )}
            {single.properties.capacitance !== undefined && (
              <Field label="Capacitance (F)">
                <Input type="number" value={single.properties.capacitance as number} step="0.000001" onChange={(e) => update('capacitance', parseFloat(e.target.value))} />
              </Field>
            )}
            {single.properties.inductance !== undefined && (
              <Field label="Inductance (H)">
                <Input type="number" value={single.properties.inductance as number} step="0.0001" onChange={(e) => update('inductance', parseFloat(e.target.value))} />
              </Field>
            )}
            {single.properties.voltage !== undefined && (
              <Field label="Voltage (V)">
                <Input type="number" value={single.properties.voltage as number} onChange={(e) => update('voltage', parseFloat(e.target.value))} />
              </Field>
            )}
            {single.properties.current !== undefined && (
              <Field label="Current (A)">
                <Input type="number" value={single.properties.current as number} step="0.001" onChange={(e) => update('current', parseFloat(e.target.value))} />
              </Field>
            )}
            {single.properties.frequency !== undefined && (
              <Field label="Frequency (Hz)">
                <Input type="number" value={single.properties.frequency as number} onChange={(e) => update('frequency', parseFloat(e.target.value))} />
              </Field>
            )}
            {single.properties.color !== undefined && (
              <Field label="Color">
                <div className="flex gap-2 items-center">
                  <input type="color" value={single.properties.color as string} onChange={(e) => update('color', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                  <span className="text-xs text-slate-500 font-mono">{single.properties.color as string}</span>
                </div>
              </Field>
            )}

            {/* Position */}
            <Field label="Position">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-slate-600 mb-1">X</p>
                  <Input type="number" value={Math.round(single.position.x)} onChange={(e) => updateComponent(single.id, { position: { ...single.position, x: parseInt(e.target.value) } })} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-600 mb-1">Y</p>
                  <Input type="number" value={Math.round(single.position.y)} onChange={(e) => updateComponent(single.id, { position: { ...single.position, y: parseInt(e.target.value) } })} />
                </div>
              </div>
            </Field>

            {/* Rotation */}
            <Field label={`Rotation: ${single.rotation}°`}>
              <div className="flex gap-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => rotate(-90)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white/5 border border-white/8 text-xs text-slate-400 hover:bg-white/8 hover:text-white transition-all">
                  <RotateCcw size={12} /> -90°
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => rotate(90)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white/5 border border-white/8 text-xs text-slate-400 hover:bg-white/8 hover:text-white transition-all">
                  <RotateCw size={12} /> +90°
                </motion.button>
              </div>
            </Field>

            {/* Pins */}
            {single.pins.length > 0 && (
              <Field label="Pins">
                <div className="space-y-1">
                  {single.pins.map((pin) => (
                    <div key={pin.id} className="flex items-center gap-2 px-2 py-1 rounded bg-white/3 border border-white/5">
                      <div className={`w-1.5 h-1.5 rounded-full ${pin.direction === 'out' ? 'bg-emerald-400' : pin.direction === 'power' ? 'bg-amber-400' : 'bg-neon-400'}`} />
                      <span className="text-[10px] font-mono text-slate-400 w-6">{pin.id}</span>
                      <span className="text-[10px] text-slate-600">{pin.label}</span>
                      <span className="ml-auto text-[9px] text-slate-700">{pin.direction}</span>
                    </div>
                  ))}
                </div>
              </Field>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => duplicateComponents([single.id])}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs hover:bg-electric-500/20 transition-all">
                <Copy size={11} /> Duplicate
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => removeComponents([single.id])}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs hover:bg-rose-500/20 transition-all">
                <Trash2 size={11} /> Delete
              </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
