import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Trash2, Play, Square, ChevronDown, Activity } from 'lucide-react';
import { useCircuitStore } from '../../store/useCircuitStore';
import type { LogLevel } from '../../types';

const LOG_COLORS: Record<LogLevel, string> = {
  info:    'text-slate-400',
  warn:    'text-amber-400',
  error:   'text-rose-400',
  success: 'text-emerald-400',
  debug:   'text-violet-400',
};

const LOG_DOTS: Record<LogLevel, string> = {
  info:    'bg-slate-400',
  warn:    'bg-amber-400',
  error:   'bg-rose-400',
  success: 'bg-emerald-400',
  debug:   'bg-violet-400',
};

const STATUS_COLORS = {
  idle:     'text-slate-500',
  running:  'text-emerald-400 animate-pulse',
  paused:   'text-amber-400',
  complete: 'text-neon-400',
  error:    'text-rose-400',
};

export const SimulationPanel: React.FC = () => {
  const { logs, clearLogs, simulationStatus, runSimulation, stopSimulation, components, wires } = useCircuitStore();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const isRunning = simulationStatus === 'running';

  return (
    <div className="h-full flex flex-col bg-surface-0/95 backdrop-blur-xl border-t border-white/5">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-white/5 flex-shrink-0">
        <Terminal size={13} className="text-neon-400" />
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Simulation Console</h2>

        <div className="flex items-center gap-1.5 ml-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          <span className={`text-[11px] font-mono font-semibold ${STATUS_COLORS[simulationStatus]}`}>
            {simulationStatus.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <span className="text-[10px] text-slate-700 font-mono mr-2">
            {components.length}C · {wires.length}W
          </span>
          <motion.button whileTap={{ scale: 0.95 }}
            onClick={isRunning ? stopSimulation : runSimulation}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
              isRunning
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
            }`}>
            {isRunning ? <><Square size={10} /> Stop</> : <><Play size={10} /> Run</>}
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={clearLogs}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] border border-white/6 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
            <Trash2 size={10} /> Clear
          </motion.button>
        </div>
      </div>

      {/* Log output */}
      <div className="flex-1 overflow-y-auto font-mono text-[11px] p-3 space-y-0.5">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Activity size={20} className="text-slate-700 mx-auto mb-2" />
              <p className="text-slate-700">Press <span className="text-emerald-600">Run</span> to start simulation</p>
            </div>
          </div>
        ) : (
          logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2 py-0.5 group hover:bg-white/2 rounded px-1"
            >
              <span className="text-slate-700 flex-shrink-0 mt-0.5">
                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
              </span>
              <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${LOG_DOTS[log.level]}`} />
              {log.source && (
                <span className="text-slate-600 flex-shrink-0">[{log.source}]</span>
              )}
              <span className={LOG_COLORS[log.level]}>{log.message}</span>
            </motion.div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default SimulationPanel;
