import React from 'react';
import { Cpu, GitBranch, Wifi, WifiOff } from 'lucide-react';
import { useCircuitStore } from '../../store/useCircuitStore';

export const StatusBar: React.FC = () => {
  const { canvas, components, wires, selectedIds, activeTool, simulationStatus, project } = useCircuitStore();
  const [online, setOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const simColors = {
    idle:     'text-slate-600',
    running:  'text-emerald-400',
    paused:   'text-amber-400',
    complete: 'text-neon-400',
    error:    'text-rose-400',
  };

  return (
    <div className="h-5 flex items-center gap-4 px-3 bg-surface-0/90 border-t border-white/4 text-[10px] font-mono text-slate-600 flex-shrink-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-1">
        <Cpu size={9} className="text-neon-400" />
        <span className="text-slate-500">{project.name}</span>
      </div>

      <div className="w-px h-3 bg-white/8" />

      <span>{components.length} components</span>
      <span>{wires.length} wires</span>

      {selectedIds.length > 0 && (
        <>
          <div className="w-px h-3 bg-white/8" />
          <span className="text-neon-400">{selectedIds.length} selected</span>
        </>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right */}
      <span className={simColors[simulationStatus]}>
        ● {simulationStatus.toUpperCase()}
      </span>

      <div className="w-px h-3 bg-white/8" />

      <span>
        Tool: <span className="text-slate-400">{activeTool}</span>
      </span>

      <div className="w-px h-3 bg-white/8" />

      <span>
        {Math.round(canvas.transform.zoom * 100)}%
      </span>

      <span>
        X:{Math.round(-canvas.transform.x / canvas.transform.zoom)}&nbsp;
        Y:{Math.round(-canvas.transform.y / canvas.transform.zoom)}
      </span>

      <div className="w-px h-3 bg-white/8" />

      {online
        ? <Wifi size={9} className="text-emerald-500" />
        : <WifiOff size={9} className="text-rose-400" />
      }

      <span>
        <GitBranch size={9} className="inline mr-0.5" />
        v1.0.0
      </span>
    </div>
  );
};

export default StatusBar;
