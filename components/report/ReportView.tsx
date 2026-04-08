import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScoreGauge } from './ScoreGauge';
import { RiskBreakdown } from './RiskBreakdown';
import { Recommendations } from './Recommendations';
import type { SovereigntyReport, Assessment } from '@/types';

interface ReportViewProps {
  report: SovereigntyReport;
  assessment: Assessment;
  assessmentId: string;
}

export function ReportView({ report, assessment, assessmentId }: ReportViewProps) {
  const [downloading, setDownloading] = useState(false);

  async function downloadPDF() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/report/${assessmentId}/pdf`);
      if (!res.ok) throw new Error('PDF-generering misslyckades');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `suverankoll-${(assessment.org_name ?? 'rapport').replace(/\s+/g, '-').toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-emerald-500 font-semibold tracking-widest uppercase mb-1">
            SuveranKoll · IT-Bladet
          </p>
          <h1 className="text-2xl font-bold text-white">
            {assessment.org_name ?? 'Din organisation'}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {assessment.sector} · {assessment.org_size} anställda ·{' '}
            {new Date(report.reportGeneratedAt).toLocaleDateString('sv-SE')}
          </p>
        </div>
        <Button
          onClick={downloadPDF}
          disabled={downloading}
          className="shrink-0 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
        >
          {downloading ? 'Genererar…' : 'Ladda ned PDF'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Gauge */}
        <div className="md:col-span-1">
          <ScoreGauge score={report.sovereigntyScore} riskLevel={report.riskLevel} />
        </div>
        {/* Executive Summary */}
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
            Sammanfattning
          </p>
          <p className="text-zinc-200 text-sm leading-relaxed mb-4">
            {report.executiveSummary}
          </p>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
            Identifierade risker
          </p>
          <ul className="space-y-1">
            {report.keyRisks.map((risk, i) => (
              <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                <span className="text-red-500 mt-0.5 shrink-0">›</span>
                {risk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Risk Breakdown */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Riskanalys per kategori</h2>
        <RiskBreakdown breakdown={report.breakdown} />
      </section>

      {/* Recommendations */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Rekommendationer</h2>
        <Recommendations recommendations={report.recommendations} />
      </section>

      {/* Footer note */}
      <div className="mt-8 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
        <p className="text-xs text-zinc-500 text-center">
          Rapport genererad av SuveranKoll – ett verktyg från IT-Bladet. Analysen baseras på
          självskattningsdata och bör kompletteras med en professionell säkerhetsgranskning.
        </p>
      </div>
    </div>
  );
}
