import React from 'react';
import { motion } from 'framer-motion';
import type { Wire, Point } from '../../types';

interface Props {
  wires: Wire[];
  wireInProgress: { points: Point[]; fromPin?: [string, string] } | null;
}

function pointsToPath(pts: Point[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const curr = pts[i];
    d += ` L ${curr.x} ${curr.y}`;
  }
  return d;
}

function orthogonalPath(pts: Point[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const midX = prev.x + (curr.x - prev.x) / 2;
    d += ` L ${midX} ${prev.y} L ${midX} ${curr.y} L ${curr.x} ${curr.y}`;
  }
  return d;
}

const WireLayer: React.FC<Props> = ({ wires, wireInProgress }) => (
  <g className="wire-layer">
    {wires.map((wire) => {
      const path = orthogonalPath(wire.points);
      return (
        <motion.g key={wire.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          {/* Glow */}
          <motion.path 
            d={path} 
            fill="none" 
            stroke="rgba(0,212,240,0.2)" 
            strokeWidth={6} 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          {/* Wire */}
          <motion.path
            d={path}
            fill="none"
            stroke={wire.selected ? '#00d4f0' : '#38bdf8'}
            strokeWidth={wire.selected ? 2.5 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={wire.animated ? 'animate-wire-flow' : ''}
            style={wire.animated ? { strokeDasharray: 8, strokeDashoffset: 0 } : {}}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          {/* Junction dots at endpoints */}
          {wire.points.length > 0 && (
            <>
              <motion.circle 
                cx={wire.points[0].x} cy={wire.points[0].y} r={3.5} fill="#38bdf8"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
              />
              <motion.circle 
                cx={wire.points[wire.points.length - 1].x} cy={wire.points[wire.points.length - 1].y} r={3.5} fill="#38bdf8"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }}
              />
            </>
          )}
        </motion.g>
      );
    })}

    {/* Wire being drawn */}
    {wireInProgress && wireInProgress.points.length > 0 && (
      <g>
        <path
          d={orthogonalPath(wireInProgress.points)}
          fill="none"
          stroke="rgba(0,212,240,0.6)"
          strokeWidth={2}
          strokeDasharray="6 4"
          strokeLinecap="round"
          className="animate-pulse"
        />
        <circle
          cx={wireInProgress.points[wireInProgress.points.length - 1].x}
          cy={wireInProgress.points[wireInProgress.points.length - 1].y}
          r={5}
          fill="rgba(0,212,240,0.4)"
          stroke="#00d4f0"
          strokeWidth={1.5}
          className="animate-ping"
          style={{ transformOrigin: `${wireInProgress.points[wireInProgress.points.length - 1].x}px ${wireInProgress.points[wireInProgress.points.length - 1].y}px` }}
        />
        <circle
          cx={wireInProgress.points[wireInProgress.points.length - 1].x}
          cy={wireInProgress.points[wireInProgress.points.length - 1].y}
          r={4}
          fill="#00d4f0"
        />
      </g>
    )}
  </g>
);

export default WireLayer;
