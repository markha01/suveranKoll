import { Badge } from '@/components/ui/badge';
import type { RiskLevel } from '@/types';

interface ScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel;
}

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string; arc: string }> = {
  high: {
    label: 'Hög risk',
    color: 'text-red-400',
    bg: 'bg-red-950/30 border-red-800',
    arc: '#ef4444',
  },
  moderate: {
    label: 'Måttlig risk',
    color: 'text-yellow-400',
    bg: 'bg-yellow-950/30 border-yellow-800',
    arc: '#eab308',
  },
  low: {
    label: 'Låg risk',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/30 border-emerald-800',
    arc: '#10b981',
  },
};

export function ScoreGauge({ score, riskLevel }: ScoreGaugeProps) {
  const config = RISK_CONFIG[riskLevel];

  // SVG arc gauge parameters
  const radius = 70;
  const cx = 90;
  const cy = 90;
  const startAngle = -210;
  const endAngle = 30;
  const totalAngle = endAngle - startAngle; // 240°
  const scoreAngle = startAngle + (score / 100) * totalAngle;

  function polarToCartesian(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function describeArc(start: number, end: number) {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  return (
    <div className={`rounded-xl border p-6 ${config.bg} text-center`}>
      <svg width="180" height="130" className="mx-auto mb-2">
        {/* Background arc */}
        <path
          d={describeArc(startAngle, endAngle)}
          fill="none"
          stroke="#27272a"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Score arc */}
        {score > 0 && (
          <path
            d={describeArc(startAngle, scoreAngle)}
            fill="none"
            stroke={config.arc}
            strokeWidth="12"
            strokeLinecap="round"
          />
        )}
        {/* Score text */}
        <text x={cx} y={cy + 10} textAnchor="middle" className="font-bold">
          <tspan fill="white" fontSize="32" fontWeight="700">
            {score}
          </tspan>
          <tspan fill="#71717a" fontSize="16" dy="4">
            /100
          </tspan>
        </text>
      </svg>
      <Badge
        className={`text-sm font-semibold px-3 py-1 ${
          riskLevel === 'high'
            ? 'bg-red-900 text-red-200 border border-red-700'
            : riskLevel === 'moderate'
            ? 'bg-yellow-900 text-yellow-200 border border-yellow-700'
            : 'bg-emerald-900 text-emerald-200 border border-emerald-700'
        }`}
      >
        {config.label}
      </Badge>
      {riskLevel === 'low' && (
        <p className="mt-3 text-xs text-zinc-400 italic">
          Låg risk innebär inte noll risk. Se rekommendationerna nedan.
        </p>
      )}
    </div>
  );
}
