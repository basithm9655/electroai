import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PanelLeftOpen, PanelLeftClose, PanelRightOpen, PanelRightClose, ChevronDown, ChevronUp } from 'lucide-react';
import { TopToolbar } from './toolbar/TopToolbar';
import { ComponentSidebar } from './sidebar/ComponentSidebar';
import { CircuitCanvas } from './canvas/CircuitCanvas';
import { PropertiesPanel } from './properties/PropertiesPanel';
import { SimulationPanel } from './simulation/SimulationPanel';
import { AIPanel } from './ui/AIPanel';
import { StatusBar } from './ui/StatusBar';
import { ShortcutOverlay } from './ui/ShortcutOverlay';
import { useCircuitStore } from '../store/useCircuitStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useIsMobile } from '../hooks/useIsMobile';

const SIDEBAR_W = 220;
const PROPS_W = 240;
const BOTTOM_H = 180;

export const AppLayout: React.FC = () => {
  const {
    leftPanelOpen, rightPanelOpen, bottomPanelOpen,
    toggleLeftPanel, toggleRightPanel, toggleBottomPanel,
    aiOpen, wireInProgress, finishWire, cancelWire
  } = useCircuitStore();

  const [shortcutOpen, setShortcutOpen] = useState(false);
  const isMobile = useIsMobile();

  // Global keyboard shortcuts
  useKeyboardShortcuts();

  // '?' key opens shortcut overlay
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '?') setShortcutOpen(true);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-surface-50 select-none">
      {/* Top Toolbar */}
      <TopToolbar onOpenShortcuts={() => setShortcutOpen(true)} />

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left sidebar */}
        <AnimatePresence initial={false}>
          {leftPanelOpen && (
            <motion.div
              key="left-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isMobile ? '100%' : SIDEBAR_W, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className={`flex-shrink-0 overflow-hidden ${isMobile ? 'absolute z-30 h-full border-r border-white/10 bg-surface-100/90 backdrop-blur-md shadow-2xl' : ''}`}
            >
              <ComponentSidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left panel toggle */}
        <motion.button
          onClick={toggleLeftPanel}
          className="absolute z-20 w-5 h-10 flex items-center justify-center bg-surface-300/90 backdrop-blur border border-white/8 rounded-r-lg text-slate-500 hover:text-neon-400 hover:bg-surface-400 transition-all"
          animate={{ left: leftPanelOpen ? SIDEBAR_W : 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
          title="Toggle sidebar (Ctrl+B)"
        >
          {leftPanelOpen ? <PanelLeftClose size={11} /> : <PanelLeftOpen size={11} />}
        </motion.button>

        {/* Center canvas area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative overflow-hidden canvas-bg">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

            {/* Circuit Canvas */}
            <CircuitCanvas />

            {/* Mobile/PC friendly wiring controls */}
            <AnimatePresence>
              {wireInProgress && (
                <motion.div
                  initial={{ y: -50, opacity: 0, x: '-50%' }}
                  animate={{ y: 20, opacity: 1, x: '-50%' }}
                  exit={{ y: -50, opacity: 0, x: '-50%' }}
                  className="absolute top-0 left-1/2 z-30 flex items-center gap-2 p-2 bg-surface-200/90 backdrop-blur-md border border-white/10 rounded-full shadow-2xl"
                >
                  <span className="text-[11px] text-emerald-400 font-semibold px-2 animate-pulse flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    Wiring Mode
                  </span>
                  <button 
                    onClick={() => finishWire()}
                    className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold hover:bg-emerald-500/30 transition-colors cursor-pointer"
                  >
                    Finish Wire
                  </button>
                  <button 
                    onClick={() => cancelWire()}
                    className="px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-300 text-[11px] font-bold hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Panel slide-over */}
            <AnimatePresence>
              {aiOpen && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="pointer-events-auto h-full">
                    <AIPanel />
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom simulation panel */}
          <AnimatePresence initial={false}>
            {bottomPanelOpen && (
              <motion.div
                key="bottom-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: BOTTOM_H, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <SimulationPanel />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom panel toggle */}
          <motion.button
            onClick={toggleBottomPanel}
            className="absolute z-20 h-5 w-14 flex items-center justify-center bg-surface-300/90 backdrop-blur border border-white/8 rounded-t-lg text-slate-500 hover:text-neon-400 hover:bg-surface-400 transition-all"
            animate={{ bottom: bottomPanelOpen ? BOTTOM_H : 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            style={{ left: '50%', transform: 'translateX(-50%)' }}
            title="Toggle console (`)"
          >
            {bottomPanelOpen ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
          </motion.button>
        </div>

        {/* Right properties panel */}
        <AnimatePresence initial={false}>
          {rightPanelOpen && (
            <motion.div
              key="right-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isMobile ? '100%' : PROPS_W, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className={`flex-shrink-0 overflow-hidden ${isMobile ? 'absolute right-0 z-30 h-full border-l border-white/10 bg-surface-100/90 backdrop-blur-md shadow-2xl' : ''}`}
            >
              <PropertiesPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right panel toggle */}
        <motion.button
          onClick={toggleRightPanel}
          className="absolute z-20 w-5 h-10 flex items-center justify-center bg-surface-300/90 backdrop-blur border border-white/8 rounded-l-lg text-slate-500 hover:text-neon-400 hover:bg-surface-400 transition-all"
          animate={{ right: rightPanelOpen ? PROPS_W : 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
          title="Toggle properties (Ctrl+P)"
        >
          {rightPanelOpen ? <PanelRightClose size={11} /> : <PanelRightOpen size={11} />}
        </motion.button>
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Shortcut overlay */}
      <ShortcutOverlay open={shortcutOpen} onClose={() => setShortcutOpen(false)} />
    </div>
  );
};

export default AppLayout;
