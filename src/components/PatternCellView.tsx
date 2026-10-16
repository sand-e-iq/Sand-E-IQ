import React from 'react';
import { PatternCell, ShapeType } from '../types/game';

interface Props {
  cell: PatternCell | null;
  size?: number;
  isSelected?: boolean;
  isCorrect?: boolean | null;
  className?: string;
  onClick?: () => void;
}

export const PatternCellView: React.FC<Props> = ({
  cell,
  size = 110,
  isSelected = false,
  isCorrect = null,
  className = '',
  onClick,
}) => {
  if (!cell) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className={`w-full aspect-square rounded-xl bg-slate-900/80 border-2 border-dashed border-cyan-500/40 flex items-center justify-center transition-all ${className}`}
      >
        <span className="text-2xl font-bold font-mono text-cyan-400/90 animate-pulse">?</span>
      </button>
    );
  }

  const colorThemes = {
    cyan: {
      stroke: '#06b6d4',
      fill: '#0891b2',
      glow: 'rgba(6, 182, 212, 0.25)',
      dot: '#22d3ee',
    },
    emerald: {
      stroke: '#10b981',
      fill: '#059669',
      glow: 'rgba(16, 185, 129, 0.25)',
      dot: '#34d399',
    },
    amber: {
      stroke: '#f59e0b',
      fill: '#d97706',
      glow: 'rgba(245, 158, 11, 0.25)',
      dot: '#fbbf24',
    },
    purple: {
      stroke: '#a855f7',
      fill: '#9333ea',
      glow: 'rgba(168, 85, 247, 0.25)',
      dot: '#c084fc',
    },
    slate: {
      stroke: '#cbd5e1',
      fill: '#64748b',
      glow: 'rgba(203, 213, 225, 0.2)',
      dot: '#e2e8f0',
    },
  };

  const theme = colorThemes[cell.colorTheme || 'cyan'];

  const getShapePath = (shape: ShapeType, scale = 1): string => {
    const s = 30 * scale;
    switch (shape) {
      case 'circle':
        return `M 0, -${s} A ${s} ${s} 0 1 1 0, ${s} A ${s} ${s} 0 1 1 0, -${s} Z`;
      case 'square':
        return `M -${s}, -${s} L ${s}, -${s} L ${s}, ${s} L -${s}, ${s} Z`;
      case 'triangle':
        return `M 0, -${s * 1.15} L ${s * 1.1}, ${s * 0.8} L -${s * 1.1}, ${s * 0.8} Z`;
      case 'diamond':
        return `M 0, -${s * 1.25} L ${s * 1.1}, 0 L 0, ${s * 1.25} L -${s * 1.1}, 0 Z`;
      case 'cross':
        const w = s * 0.35;
        const l = s * 1.1;
        return `M -${w}, -${l} L ${w}, -${l} L ${w}, -${w} L ${l}, -${w} L ${l}, ${w} L ${w}, ${w} L ${w}, ${l} L -${w}, ${l} L -${w}, ${w} L -${l}, ${w} L -${l}, -${w} L -${w}, -${w} Z`;
      case 'star':
        return `M 0, -${s * 1.2} L ${s * 0.35}, -${s * 0.35} L ${s * 1.2}, -${s * 0.35} L ${s * 0.55}, ${s * 0.25} L ${s * 0.75}, ${s * 1.1} L 0, ${s * 0.6} L -${s * 0.75}, ${s * 1.1} L -${s * 0.55}, ${s * 0.25} L -${s * 1.2}, -${s * 0.35} L -${s * 0.35}, -${s * 0.35} Z`;
      case 'hexagon':
        const r = s * 1.1;
        const pts = [];
        for (let i = 0; i < 6; i++) {
          const a = (i * 60 * Math.PI) / 180;
          pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
        }
        return `M ${pts.join(' L ')} Z`;
      case 'line':
        return `M 0, -${s * 1.2} L 0, ${s * 1.2}`;
      default:
        return `M -${s}, -${s} L ${s}, -${s} L ${s}, ${s} L -${s}, ${s} Z`;
    }
  };

  const patternId = `hatch-${cell.colorTheme || 'cyan'}-${cell.shading || 'empty'}`;

  let borderColor = 'border-slate-800 hover:border-slate-700';
  if (isSelected) {
    borderColor = 'border-cyan-400 ring-2 ring-cyan-400/30';
  }
  if (isCorrect === true) {
    borderColor = 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-950/20';
  } else if (isCorrect === false) {
    borderColor = 'border-rose-500 ring-2 ring-rose-500/40 bg-rose-950/20';
  }

  // Calculate satellite dots
  const satelliteDots = [];
  if (cell.dotsCount && cell.dotsCount > 0) {
    const dotRadius = 40;
    for (let i = 0; i < cell.dotsCount; i++) {
      const angle = (i * (360 / cell.dotsCount) * Math.PI) / 180;
      satelliteDots.push({
        cx: Math.cos(angle) * dotRadius,
        cy: Math.sin(angle) * dotRadius,
      });
    }
  }

  return (
    <div
      onClick={onClick}
      className={`relative w-full aspect-square rounded-xl bg-slate-900/90 border transition-all flex items-center justify-center p-2 cursor-pointer select-none overflow-hidden ${borderColor} ${className}`}
    >
      <svg
        viewBox="-55 -55 110 110"
        className="w-full h-full max-w-[95%] max-h-[95%]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id={patternId}
            width="8"
            height="8"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="8" stroke={theme.stroke} strokeWidth="2.5" />
          </pattern>
        </defs>

        {/* Satellite dots */}
        {satelliteDots.map((dot, idx) => (
          <circle
            key={idx}
            cx={dot.cx}
            cy={dot.cy}
            r="3.5"
            fill={theme.dot}
            className="filter drop-shadow"
          />
        ))}

        {/* Primary Shape */}
        {cell.shape && (
          <g transform={`rotate(${cell.rotation || 0})`}>
            <path
              d={getShapePath(cell.shape, 1)}
              fill={
                cell.shading === 'solid'
                  ? theme.fill
                  : cell.shading === 'hatched'
                  ? `url(#${patternId})`
                  : 'none'
              }
              stroke={theme.stroke}
              strokeWidth={cell.shape === 'line' ? '5' : '2.5'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Secondary Inner Shape */}
        {cell.secondaryShape && (
          <g transform={`rotate(${(cell.rotation || 0) + 180})`}>
            <path
              d={getShapePath(cell.secondaryShape, 0.45)}
              fill={
                cell.shading === 'solid'
                  ? '#090d16'
                  : cell.shading === 'empty'
                  ? theme.fill
                  : 'none'
              }
              stroke={theme.stroke}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
