import React from 'react';
import AppLayout from './components/AppLayout';
import { useCircuitStore } from './store/useCircuitStore';

const App: React.FC = () => {
  const { addLog } = useCircuitStore();

  React.useEffect(() => {
    addLog('info', 'CircuitOS v1.0.0 initialized', 'System');
    addLog('info', 'Drag components from the left panel onto the canvas', 'System');
    addLog('info', 'Press W to draw wires, V to select, E to erase', 'System');
    addLog('info', 'Scroll to zoom · Alt+drag to pan', 'System');
  }, []);

  return <AppLayout />;
};

export default App;
