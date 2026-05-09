import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Save, Undo2, Redo2, ZoomIn, ZoomOut, Maximize2,
  Play, Square, Upload, Grid, Magnet,
  MousePointer2, Pencil, Eraser, Cpu, Sparkles, Plus,
  Keyboard
} from 'lucide-react';
import { useCircuitStore } from '../../store/useCircuitStore';

interface ToolBtnProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'danger' | 'success' | 'neon';
  shortcut?: string;
}

const ToolBtn: React.FC<ToolBtnProps> = ({ icon, label, onClick, active, disabled, variant = 'default', shortcut }) => {
  const colors = {
    default: active ? 'bg-neon-400/15 border-neon-400/40 text-neon-400' : 'border-white/6 text-slate-400 hover:text-white hover:bg-white/6 hover:border-white/12',
    danger:  'border-rose-500/30 text-rose-400 hover:bg-rose-500/10',
    success: active ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' : 'border-white/6 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10',
    neon:    'border-neon-400/40 text-neon-400 bg-neon-400/10 hover:bg-neon-400/20 shadow-neon-sm',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      title={shortcut ? `${label} (${shortcut})` : label}
      className={`relative flex items-center justify-center w-8 h-8 rounded-lg border text-sm transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed ${colors[variant]}`}
    >
      {icon}
    </motion.button>
  );
};

const Divider = () => <div className="w-px h-5 bg-white/8 mx-0.5" />;

export const TopToolbar: React.FC<{ onOpenShortcuts?: () => void }> = ({ onOpenShortcuts }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    project, setProjectName,
    activeTool, setActiveTool,
    undo, redo, canUndo, canRedo,
    canvas, setZoom, resetView, toggleGrid, toggleSnap,
    simulationStatus, runSimulation, stopSimulation,
    toggleAI,
    exportJSON, importJSON,
    newProject,
    addLog,
  } = useCircuitStore();

  const handleSave = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${project.name.replace(/\s+/g, '_')}.json`;
    a.click(); URL.revokeObjectURL(url);
    addLog('success', `Saved: ${project.name}.json`, 'IO');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => importJSON(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = '';
  };

  const isRunning = simulationStatus === 'running';

  return (
    <header className="h-12 flex items-center gap-1.5 px-3 bg-surface-100/90 backdrop-blur-xl border-b border-white/5 z-30 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-400 to-electric-500 flex items-center justify-center shadow-neon-sm">
          <Cpu size={14} className="text-surface-0" />
        </div>
        <span className="font-display font-bold text-sm text-white hidden sm:block">CircuitOS</span>
      </div>

      <Divider />

      {/* Project name */}
      <input
        className="bg-transparent text-sm font-medium text-slate-300 hover:text-white focus:text-white focus:outline-none focus:bg-white/5 rounded px-2 py-0.5 w-36 truncate transition-colors"
        value={project.name}
        onChange={(e) => setProjectName(e.target.value)}
        title="Project name"
      />

      <Divider />

      {/* File ops */}
      <ToolBtn icon={<Plus size={14} />} label="New Project" onClick={newProject} />
      <ToolBtn icon={<Save size={14} />} label="Save / Export JSON" onClick={handleSave} />
      <ToolBtn icon={<Upload size={14} />} label="Import JSON" onClick={() => fileRef.current?.click()} />
      <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

      <Divider />

      {/* History */}
      <ToolBtn icon={<Undo2 size={14} />} label="Undo" shortcut="Ctrl+Z" onClick={undo} disabled={!canUndo()} />
      <ToolBtn icon={<Redo2 size={14} />} label="Redo" shortcut="Ctrl+Y" onClick={redo} disabled={!canRedo()} />

      <Divider />

      {/* Tools */}
      <ToolBtn icon={<MousePointer2 size={14} />} label="Select" shortcut="V" onClick={() => setActiveTool('select')} active={activeTool === 'select'} />
      <ToolBtn icon={<Pencil size={14} />} label="Wire" shortcut="W" onClick={() => setActiveTool('wire')} active={activeTool === 'wire'} />
      <ToolBtn icon={<Eraser size={14} />} label="Erase" shortcut="E" onClick={() => setActiveTool('erase')} active={activeTool === 'erase'} />

      <Divider />

      {/* View */}
      <ToolBtn icon={<ZoomIn size={14} />} label="Zoom In" onClick={() => setZoom(canvas.transform.zoom * 1.2)} />
      <ToolBtn icon={<ZoomOut size={14} />} label="Zoom Out" onClick={() => setZoom(canvas.transform.zoom * 0.8)} />
      <ToolBtn icon={<Maximize2 size={14} />} label="Reset View" onClick={resetView} />
      <ToolBtn icon={<Grid size={14} />} label="Toggle Grid" onClick={toggleGrid} active={canvas.showGrid} />
      <ToolBtn icon={<Magnet size={14} />} label="Snap to Grid" onClick={toggleSnap} active={canvas.snapToGrid} />

      <Divider />

      {/* Simulation */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={isRunning ? stopSimulation : runSimulation}
        className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold border transition-all ${
          isRunning
            ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 hover:bg-rose-500/25'
            : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
        }`}
      >
        {isRunning ? <Square size={12} /> : <Play size={12} />}
        <span className="hidden md:block">{isRunning ? 'Stop' : 'Simulate'}</span>
      </motion.button>

      <Divider />

      {/* AI */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={toggleAI}
        className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold border bg-violet-500/15 border-violet-500/40 text-violet-300 hover:bg-violet-500/25 transition-all"
      >
        <Sparkles size={12} className="animate-pulse" />
        <span className="hidden md:block">AI</span>
      </motion.button>

      {/* Zoom indicator + shortcuts */}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-[11px] font-mono text-slate-600 hidden lg:block">
          {Math.round(canvas.transform.zoom * 100)}%
        </span>
        <ToolBtn icon={<Keyboard size={13} />} label="Keyboard Shortcuts (?)" onClick={() => onOpenShortcuts?.()} />
      </div>
    </header>
  );
};

export default TopToolbar;
