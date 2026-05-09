import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{ keys: string[]; description: string }>;
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Tools',
    shortcuts: [
      { keys: ['V'], description: 'Select tool' },
      { keys: ['W'], description: 'Wire tool' },
      { keys: ['E'], description: 'Erase tool' },
      { keys: ['Esc'], description: 'Cancel / deselect' },
    ],
  },
  {
    title: 'Edit',
    shortcuts: [
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Y'], description: 'Redo' },
      { keys: ['Ctrl', 'A'], description: 'Select all' },
      { keys: ['Ctrl', 'D'], description: 'Duplicate' },
      { keys: ['Del'], description: 'Delete selected' },
    ],
  },
  {
    title: 'View',
    shortcuts: [
      { keys: ['+'], description: 'Zoom in' },
      { keys: ['-'], description: 'Zoom out' },
      { keys: ['Ctrl', '0'], description: 'Reset view' },
      { keys: ['Ctrl', '1'], description: 'Fit to 100%' },
      { keys: ['Alt', 'Drag'], description: 'Pan canvas' },
      { keys: ['Scroll'], description: 'Zoom in/out' },
    ],
  },
  {
    title: 'Panels',
    shortcuts: [
      { keys: ['Ctrl', 'B'], description: 'Toggle sidebar' },
      { keys: ['Ctrl', 'P'], description: 'Toggle properties' },
      { keys: ['`'], description: 'Toggle console' },
      { keys: ['Ctrl', 'K'], description: 'Toggle AI' },
    ],
  },
  {
    title: 'File',
    shortcuts: [
      { keys: ['Ctrl', 'S'], description: 'Save / Export JSON' },
      { keys: ['Ctrl', 'N'], description: 'New project' },
    ],
  },
];

const KeyChip: React.FC<{ label: string }> = ({ label }) => (
  <kbd className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded bg-surface-300 border border-white/12 text-[10px] font-mono text-slate-300 shadow-sm">
    {label}
  </kbd>
);

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ShortcutOverlay: React.FC<Props> = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          className="fixed inset-0 m-auto w-[640px] max-h-[80vh] rounded-2xl bg-surface-100/95 backdrop-blur-2xl border border-white/8 shadow-2xl z-50 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg bg-neon-400/15 border border-neon-400/25 flex items-center justify-center">
              <Keyboard size={15} className="text-neon-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Keyboard Shortcuts</h2>
              <p className="text-[11px] text-slate-500">CircuitOS quick reference</p>
            </div>
            <button onClick={onClose} className="ml-auto p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>

          {/* Grid */}
          <div className="overflow-y-auto p-5 grid grid-cols-2 gap-6">
            {SHORTCUT_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{group.title}</h3>
                <div className="space-y-2">
                  {group.shortcuts.map((s, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-400">{s.description}</span>
                      <div className="flex items-center gap-1">
                        {s.keys.map((k, ki) => (
                          <React.Fragment key={ki}>
                            <KeyChip label={k} />
                            {ki < s.keys.length - 1 && <span className="text-[10px] text-slate-600">+</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/5 text-center">
            <p className="text-[11px] text-slate-600">Press <KeyChip label="?" /> anytime to open this panel</p>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default ShortcutOverlay;
