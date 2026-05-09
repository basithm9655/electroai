import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, User, Zap, Key, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { useCircuitStore } from '../../store/useCircuitStore';
import { sendToGemini, buildCircuitContext, isAIConfigured, type GeminiMessage } from '../../services/aiService';
import type { AIMessage } from '../../types';

const SUGGESTIONS = [
  'Generate an LED flasher circuit with a 555 timer',
  'Design a motor controller with a relay and switch',
  'Plan a home automation system with a buzzer and sensor',
  'Generate a voltage divider with 5V → 3.3V',
  'Explain the 555 timer in astable mode',
  'How to debounce a push button?',
];

/* ── API Key Setup Banner ─────────────────────────────── */
const SetupBanner: React.FC = () => (
  <div className="p-4 space-y-4">
    <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-400/8 border border-amber-400/20">
      <AlertCircle size={14} className="text-amber-400 flex-shrink-0" />
      <p className="text-[11px] text-amber-300 leading-relaxed">
        No API key set. Add your free Gemini key to enable AI.
      </p>
    </div>

    <div className="p-3 rounded-xl bg-white/4 border border-white/8 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400">1</div>
        <p className="text-[11px] text-slate-300">Get your free key from Google AI Studio</p>
      </div>
      <a
        href="https://aistudio.google.com/app/apikey"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-semibold hover:bg-blue-500/25 transition-all"
      >
        <ExternalLink size={11} /> Open Google AI Studio
      </a>

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400">2</div>
        <p className="text-[11px] text-slate-300">Edit your <code className="text-neon-400 bg-surface-300 px-1 rounded">.env</code> file:</p>
      </div>
      <div className="bg-surface-0 rounded-lg p-2.5 font-mono text-[10px] text-emerald-400 border border-white/6">
        VITE_GEMINI_API_KEY=<span className="text-neon-400">your_key_here</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400">3</div>
        <p className="text-[11px] text-slate-300">Restart the dev server, then AI is live!</p>
      </div>
    </div>

    <div className="p-2.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15">
      <p className="text-[10px] text-emerald-400 font-semibold mb-1">✓ Gemini 1.5 Flash — Free Tier</p>
      <p className="text-[10px] text-slate-500">15 requests/min · 1 million tokens/day · No credit card required</p>
    </div>
  </div>
);

/* ── Message Bubble ───────────────────────────────────── */
const MessageBubble: React.FC<{ msg: AIMessage }> = ({ msg }) => {
  const { 
    setComponents, setWires, addComponent, addWire, 
    removeComponents, removeWires, updateComponent, addLog 
  } = useCircuitStore();
  
  let content = msg.content || '';
  let parsedCircuit: any = null;
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);

  if (jsonMatch && msg.role === 'assistant') {
    content = content.replace(jsonMatch[0], '').trim();
    try {
      parsedCircuit = JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.error('Failed to parse circuit JSON', e, 'Raw:', jsonMatch[1]);
    }
  }

  const applyChanges = () => {
    if (parsedCircuit) {
      // Legacy "full replace" format
      if (Array.isArray(parsedCircuit.components) && !parsedCircuit.add) {
        setComponents(parsedCircuit.components);
        if (parsedCircuit.wires) setWires(parsedCircuit.wires);
      } 
      // Agent action format
      else {
        if (parsedCircuit.clear) {
          setComponents([]);
          setWires([]);
        }
        if (parsedCircuit.remove) {
          if (parsedCircuit.remove.components) removeComponents(parsedCircuit.remove.components);
          if (parsedCircuit.remove.wires) removeWires(parsedCircuit.remove.wires);
        }
        if (parsedCircuit.add) {
          if (parsedCircuit.add.components) parsedCircuit.add.components.forEach(addComponent);
          if (parsedCircuit.add.wires) parsedCircuit.add.wires.forEach(addWire);
        }
        if (parsedCircuit.update) {
          if (parsedCircuit.update.components) {
            parsedCircuit.update.components.forEach((c: any) => updateComponent(c.id, c));
          }
        }
      }
      addLog('success', 'AI Agent applied circuit changes', 'AI Agent');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {msg.role === 'assistant' && (
        <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={12} className="text-violet-300" />
        </div>
      )}
      <div className={`max-w-[85%] flex flex-col gap-2`}>
        {content && (
          <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
            msg.role === 'user'
              ? 'bg-neon-400/15 border border-neon-400/20 text-neon-100'
              : 'bg-white/5 border border-white/8 text-slate-300'
          }`}>
            {msg.thinking ? (
              <div className="flex gap-1 items-center py-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }} />
                ))}
                <span className="text-[10px] text-slate-600 ml-1">Gemini thinking…</span>
              </div>
            ) : content}
          </div>
        )}
        
        {parsedCircuit && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={applyChanges}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/30 transition-all shadow-lg"
          >
            <Sparkles size={12} />
            Apply Circuit Changes
          </motion.button>
        )}
      </div>
      {msg.role === 'user' && (
        <div className="w-6 h-6 rounded-full bg-neon-400/20 border border-neon-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User size={12} className="text-neon-300" />
        </div>
      )}
    </motion.div>
  );
};

/* ── Main AI Panel ────────────────────────────────────── */
export const AIPanel: React.FC = () => {
  const { aiMessages, addAIMessage, toggleAI, components, wires } = useCircuitStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const configured = isAIConfigured();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const buildHistory = (): GeminiMessage[] => {
    return aiMessages
      .filter((m) => !m.thinking && m.content)
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setError(null);
    setInput('');

    addAIMessage({ role: 'user', content: text });
    addAIMessage({ role: 'assistant', content: '', thinking: true });
    setIsLoading(true);

    try {
      const context = buildCircuitContext(
        components.length,
        wires.length,
        components.map((c) => ({ type: c.type, label: c.label, value: c.value }))
      );

      const history = buildHistory();
      history.push({ role: 'user', parts: [{ text }] });

      const reply = await sendToGemini(history, context);

      // Replace thinking bubble with real reply
      useCircuitStore.setState((s) => ({
        aiMessages: s.aiMessages.map((m, i) =>
          i === s.aiMessages.length - 1 && m.thinking
            ? { ...m, thinking: false, content: reply }
            : m
        ),
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      const friendly =
        msg === 'NO_KEY'        ? 'Add your Gemini API key to .env to use AI.' :
        msg === 'INVALID_KEY'   ? 'Invalid API key. Check your VITE_GEMINI_API_KEY in .env.' :
        msg === 'RATE_LIMIT'    ? 'Rate limit hit. Wait a moment and try again.' :
        `AI error: ${msg}`;

      setError(friendly);
      // Replace thinking bubble with error
      useCircuitStore.setState((s) => ({
        aiMessages: s.aiMessages.map((m, i) =>
          i === s.aiMessages.length - 1 && m.thinking
            ? { ...m, thinking: false, content: `⚠️ ${friendly}` }
            : m
        ),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute right-0 top-0 bottom-0 w-80 bg-surface-100/96 backdrop-blur-2xl border-l border-white/8 flex flex-col z-40 shadow-2xl"
    >
      {/* Header */}
      <div className="p-3 border-b border-white/5 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          <Sparkles size={13} className={`text-violet-300 ${configured ? 'animate-pulse' : ''}`} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-white">CircuitOS AI</h3>
          <p className="text-[10px] text-slate-600">
            {configured ? (
              <span className="text-emerald-400">● Gemini 1.5 Flash connected</span>
            ) : (
              <span className="text-amber-400">● API key not set</span>
            )}
          </p>
        </div>
        <button onClick={toggleAI} className="ml-auto p-1 rounded hover:bg-white/8 text-slate-500 hover:text-white transition-colors">
          <X size={13} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {!configured ? (
          <SetupBanner />
        ) : aiMessages.length === 0 ? (
          <div className="p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mx-auto mb-3">
              <Zap size={20} className="text-violet-300" />
            </div>
            <p className="text-xs text-slate-400 font-medium mb-1">AI Circuit Assistant</p>
            <p className="text-[11px] text-slate-600 mb-4">Powered by Gemini 1.5 Flash</p>
            <div className="space-y-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white/4 border border-white/6 text-[11px] text-slate-400 hover:bg-violet-500/10 hover:border-violet-500/25 hover:text-violet-300 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {aiMessages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden border-t border-rose-500/20">
            <div className="flex items-center gap-2 px-3 py-2 bg-rose-500/10">
              <AlertCircle size={11} className="text-rose-400 flex-shrink-0" />
              <p className="text-[10px] text-rose-300 flex-1">{error}</p>
              <button onClick={() => setError(null)} className="text-slate-500 hover:text-white">
                <X size={11} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      {configured && (
        <div className="p-3 border-t border-white/5">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Ask about circuits, components…"
              disabled={isLoading}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-400/40 disabled:opacity-50 transition-all"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 hover:bg-violet-500/30 disabled:opacity-40 transition-all"
            >
              {isLoading
                ? <RefreshCw size={12} className="animate-spin" />
                : <Send size={12} />
              }
            </motion.button>
          </div>
          <p className="text-[9px] text-slate-700 mt-1.5 text-center">
            Gemini 1.5 Flash · Free tier · {components.length}C {wires.length}W in context
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default AIPanel;
