import { useEffect, useCallback } from 'react';
import { useCircuitStore } from '../store/useCircuitStore';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const {
    undo, redo, canUndo, canRedo,
    selectAll, clearSelection,
    selectedIds, removeComponents, duplicateComponents,
    setActiveTool, cancelWire,
    setZoom, resetView,
    canvas,
    newProject, exportJSON,
    toggleLeftPanel, toggleRightPanel, toggleBottomPanel,
    toggleAI,
    addLog,
  } = useCircuitStore();

  const shortcuts: Shortcut[] = [
    { key: 'z', ctrl: true, handler: () => canUndo() && undo(), description: 'Undo' },
    { key: 'z', ctrl: true, shift: true, handler: () => canRedo() && redo(), description: 'Redo' },
    { key: 'y', ctrl: true, handler: () => canRedo() && redo(), description: 'Redo' },
    { key: 'a', ctrl: true, handler: selectAll, description: 'Select All' },
    { key: 'd', ctrl: true, handler: () => selectedIds.length && duplicateComponents(selectedIds), description: 'Duplicate' },
    { key: 'Escape', handler: () => { cancelWire(); clearSelection(); setActiveTool('select'); }, description: 'Cancel / Deselect' },
    { key: 'Delete', handler: () => selectedIds.length && removeComponents(selectedIds), description: 'Delete selected' },
    { key: 'Backspace', handler: () => selectedIds.length && removeComponents(selectedIds), description: 'Delete selected' },
    { key: 'v', handler: () => setActiveTool('select'), description: 'Select tool' },
    { key: 'w', handler: () => setActiveTool('wire'), description: 'Wire tool' },
    { key: 'e', handler: () => setActiveTool('erase'), description: 'Erase tool' },
    { key: '=', handler: () => setZoom(canvas.transform.zoom * 1.2), description: 'Zoom In' },
    { key: '+', handler: () => setZoom(canvas.transform.zoom * 1.2), description: 'Zoom In' },
    { key: '-', handler: () => setZoom(canvas.transform.zoom * 0.8), description: 'Zoom Out' },
    { key: '0', ctrl: true, handler: resetView, description: 'Reset View' },
    { key: '1', ctrl: true, handler: () => setZoom(1), description: '100% Zoom' },
    { key: 'n', ctrl: true, handler: newProject, description: 'New Project' },
    { key: 'b', ctrl: true, handler: toggleLeftPanel, description: 'Toggle sidebar' },
    { key: 'p', ctrl: true, handler: toggleRightPanel, description: 'Toggle properties' },
    { key: '`', handler: toggleBottomPanel, description: 'Toggle console' },
    { key: 'k', ctrl: true, handler: toggleAI, description: 'Toggle AI' },
    {
      key: 's', ctrl: true,
      handler: () => {
        const json = exportJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'circuit.json';
        a.click();
        URL.revokeObjectURL(url);
        addLog('success', 'Project saved', 'IO');
      },
      description: 'Save / Export',
    },
  ];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Skip if typing in input / textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        // Only allow Escape from inputs
        if (e.key !== 'Escape') return;
      }

      for (const sc of shortcuts) {
        const keyMatch = e.key === sc.key || e.key.toLowerCase() === sc.key.toLowerCase();
        const ctrlMatch = sc.ctrl ? (e.ctrlKey || e.metaKey) : !(e.ctrlKey || e.metaKey) || !sc.ctrl;
        const shiftMatch = sc.shift ? e.shiftKey : !sc.shift || !e.shiftKey;
        const altMatch = sc.alt ? e.altKey : true;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // Don't prevent default for ctrl+shortcuts that have side effects
          if (sc.ctrl || sc.key === 'Escape' || sc.key === 'Delete' || sc.key === 'Backspace') {
            e.preventDefault();
          }
          sc.handler();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
