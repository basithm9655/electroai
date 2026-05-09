import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, ChevronDown, GripVertical } from 'lucide-react';
import { COMPONENT_LIBRARY, CATEGORY_META, searchComponents } from '../../services/componentLibrary';
import type { ComponentDef, ComponentCategory } from '../../types';

const CategorySection: React.FC<{ category: ComponentCategory; components: ComponentDef[]; open: boolean; onToggle: () => void }> = ({ category, components, open, onToggle }) => {
  const meta = CATEGORY_META[category];
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
      >
        <span className="text-sm">{meta?.emoji}</span>
        <span className="flex-1 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">{meta?.label ?? category}</span>
        <span className="text-slate-500 text-xs">{components.length}</span>
        {open ? <ChevronDown size={12} className="text-slate-500" /> : <ChevronRight size={12} className="text-slate-500" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 space-y-0.5">
              {components.map((def) => (
                <ComponentItem key={def.type} def={def} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ComponentItem: React.FC<{ def: ComponentDef }> = ({ def }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('component-type', def.type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-neon-400/10 hover:border-neon-400/20 border border-transparent cursor-grab active:cursor-grabbing transition-all duration-150 group"
      title={def.description}
    >
      <GripVertical size={10} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
      <span className="text-sm w-5 text-center flex-shrink-0">{def.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-300 group-hover:text-white truncate leading-tight">{def.label}</p>
        {def.description && (
          <p className="text-[10px] text-slate-600 group-hover:text-slate-500 truncate">{def.description}</p>
        )}
      </div>
    </div>
  );
};

export const ComponentSidebar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['power', 'passive']));

  const results = useMemo(() => searchComponents(query), [query]);

  const grouped = useMemo(() => {
    const map = new Map<ComponentCategory, ComponentDef[]>();
    results.forEach((def) => {
      const list = map.get(def.category) ?? [];
      list.push(def);
      map.set(def.category, list);
    });
    return map;
  }, [results]);

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col bg-surface-100/80 backdrop-blur-xl border-r border-white/5">
      {/* Header */}
      <div className="p-3 border-b border-white/5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Components</h2>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search components..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/8 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-neon-400/40 focus:bg-white/8 transition-all"
          />
        </div>
      </div>

      {/* Component list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
        {query ? (
          <div className="space-y-0.5">
            <p className="text-[10px] text-slate-600 px-3 py-1">{results.length} results</p>
            {results.map((def) => <ComponentItem key={def.type} def={def} />)}
          </div>
        ) : (
          Array.from(grouped.entries()).map(([cat, comps]) => (
            <CategorySection
              key={cat}
              category={cat}
              components={comps}
              open={openCategories.has(cat)}
              onToggle={() => toggleCategory(cat)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <p className="text-[10px] text-slate-600 text-center">{COMPONENT_LIBRARY.length} components</p>
      </div>
    </div>
  );
};

export default ComponentSidebar;
