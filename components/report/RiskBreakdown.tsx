import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SovereigntyReport } from '@/types';

interface RiskBreakdownProps {
  breakdown: SovereigntyReport['breakdown'];
  scoreBreakdown?: {
    cloudInfrastructure: { score: number; maxScore: number };
    gdprDataResidency: { score: number; maxScore: number };
    cloudActLegal: { score: number; maxScore: number };
    aiShadowIT: { score: number; maxScore: number };
  };
}

const CATEGORIES = [
  { key: 'gdpr' as const, label: 'GDPR & dataresidency', maxScore: 25, color: 'bg-blue-500' },
  { key: 'cloudAct' as const, label: 'Cloud Act / Juridisk exponering', maxScore: 25, color: 'bg-purple-500' },
  { key: 'dataResidency' as const, label: 'Molninfrastruktur', maxScore: 30, color: 'bg-orange-500' },
  { key: 'shadowAI' as const, label: 'AI & Skugg-IT', maxScore: 20, color: 'bg-pink-500' },
];

export function RiskBreakdown({ breakdown }: RiskBreakdownProps) {
  return (
    <div className="space-y-4">
      {CATEGORIES.map(({ key, label, maxScore, color }) => {
        const cat = breakdown[key];
        const pct = Math.round((cat.score / maxScore) * 100);
        return (
          <Card key={key} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-zinc-200">{label}</CardTitle>
                <span className="text-sm font-bold text-white">
                  {cat.score}
                  <span className="text-zinc-500 font-normal">/{maxScore}</span>
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-2">
                <div
                  className={`h-1.5 rounded-full ${color} transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1">
                {cat.findings.map((finding, i) => (
                  <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                    <span className="text-zinc-600 mt-0.5 shrink-0">›</span>
                    {finding}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
