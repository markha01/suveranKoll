import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { SovereigntyReport, Priority } from '@/types';

interface RecommendationsProps {
  recommendations: SovereigntyReport['recommendations'];
}

const PRIORITY_CONFIG: Record<Priority, { label: string; className: string }> = {
  critical: { label: 'Kritisk', className: 'bg-red-900 text-red-200 border-red-700' },
  high: { label: 'Hög', className: 'bg-orange-900 text-orange-200 border-orange-700' },
  medium: { label: 'Medium', className: 'bg-yellow-900 text-yellow-200 border-yellow-700' },
};

export function Recommendations({ recommendations }: RecommendationsProps) {
  const sorted = [...recommendations].sort((a, b) => {
    const order: Priority[] = ['critical', 'high', 'medium'];
    return order.indexOf(a.priority) - order.indexOf(b.priority);
  });

  return (
    <div className="space-y-3">
      {sorted.map((rec, i) => {
        const pConfig = PRIORITY_CONFIG[rec.priority];
        return (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Badge className={`text-xs shrink-0 mt-0.5 border ${pConfig.className}`}>
                  {pConfig.label}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-sm font-medium text-red-300 line-through decoration-red-500">
                      {rec.replace}
                    </span>
                    <span className="text-zinc-500 text-xs">→</span>
                    <span className="text-sm font-medium text-emerald-300">{rec.with}</span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{rec.rationale}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
