import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { SovereigntyReport, Assessment } from '@/types';

interface PDFDocumentProps {
  report: SovereigntyReport;
  assessment: Pick<Assessment, 'org_name' | 'sector' | 'org_size'>;
}

const RISK_COLORS: Record<string, string> = {
  high: '#ef4444',
  moderate: '#eab308',
  low: '#10b981',
};

const RISK_LABELS: Record<string, string> = {
  high: 'Hög risk',
  moderate: 'Måttlig risk',
  low: 'Låg risk',
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
};

const s = StyleSheet.create({
  page: {
    backgroundColor: '#09090b',
    color: '#e4e4e7',
    fontFamily: 'Helvetica',
    padding: 48,
    fontSize: 10,
  },
  // Cover
  coverTitle: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#10b981', marginBottom: 8 },
  coverSubtitle: { fontSize: 13, color: '#a1a1aa', marginBottom: 32 },
  coverOrg: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginBottom: 4 },
  coverMeta: { fontSize: 10, color: '#71717a' },
  // Section
  section: { marginTop: 28 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#10b981',
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    paddingBottom: 6,
    marginBottom: 10,
  },
  body: { color: '#a1a1aa', lineHeight: 1.5 },
  // Score block
  scoreBlock: {
    backgroundColor: '#18181b',
    borderRadius: 8,
    padding: 16,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreBig: { fontSize: 48, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  scoreOf: { fontSize: 18, color: '#71717a' },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  // Lists
  bullet: { flexDirection: 'row', marginBottom: 4 },
  bulletDot: { color: '#10b981', marginRight: 6, fontSize: 10 },
  bulletText: { color: '#a1a1aa', flex: 1, lineHeight: 1.5 },
  // Breakdown
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#18181b',
    padding: 10,
    borderRadius: 6,
    marginBottom: 4,
  },
  catLabel: { color: '#e4e4e7', fontFamily: 'Helvetica-Bold', fontSize: 10 },
  catScore: { color: '#10b981', fontFamily: 'Helvetica-Bold', fontSize: 10 },
  catFinding: { color: '#71717a', fontSize: 9, marginTop: 2, marginLeft: 8 },
  // Rec
  recRow: {
    backgroundColor: '#18181b',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  recHeader: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  recPriorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  recReplace: { color: '#fca5a5', fontSize: 10, textDecoration: 'line-through' },
  recWith: { color: '#6ee7b7', fontSize: 10, fontFamily: 'Helvetica-Bold' },
  recArrow: { color: '#71717a', fontSize: 10 },
  recRationale: { color: '#71717a', fontSize: 9, lineHeight: 1.5, marginTop: 2 },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingTop: 8,
  },
  footerText: { color: '#52525b', fontSize: 8 },
});

export function PDFDocument({ report, assessment }: PDFDocumentProps) {
  const riskColor = RISK_COLORS[report.riskLevel] ?? '#eab308';
  const riskLabel = RISK_LABELS[report.riskLevel] ?? report.riskLevel;
  const date = new Date(report.reportGeneratedAt).toLocaleDateString('sv-SE');

  const BREAKDOWN_CATS = [
    { key: 'gdpr' as const, label: 'GDPR & Dataresidency', max: 25 },
    { key: 'cloudAct' as const, label: 'Cloud Act / Juridisk exponering', max: 25 },
    { key: 'dataResidency' as const, label: 'Molninfrastruktur', max: 30 },
    { key: 'shadowAI' as const, label: 'AI & Skugg-IT', max: 20 },
  ];

  return (
    <Document>
      {/* Page 1: Cover + Executive Summary + Score */}
      <Page size="A4" style={s.page}>
        <Text style={s.coverTitle}>SuveranKoll</Text>
        <Text style={s.coverSubtitle}>Digital suveränitetsanalys | IT-Bladet</Text>
        <Text style={s.coverOrg}>{assessment.org_name ?? 'Organisation'}</Text>
        <Text style={s.coverMeta}>
          {assessment.sector ?? ''} · {assessment.org_size ?? ''} anställda · {date}
        </Text>

        {/* Executive Summary */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Sammanfattning</Text>
          <Text style={s.body}>{report.executiveSummary}</Text>
        </View>

        {/* Score */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Suveränitetspoäng</Text>
          <View style={s.scoreBlock}>
            <Text style={s.scoreBig}>{report.sovereigntyScore}</Text>
            <Text style={s.scoreOf}>/100</Text>
            <View>
              <Text
                style={[
                  s.riskBadge,
                  { backgroundColor: riskColor + '33', color: riskColor },
                ]}
              >
                {riskLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* Key Risks */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Identifierade risker</Text>
          {report.keyRisks.map((risk, i) => (
            <View key={i} style={s.bullet}>
              <Text style={s.bulletDot}>›</Text>
              <Text style={s.bulletText}>{risk}</Text>
            </View>
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>SuveranKoll | IT-Bladet investigative tool</Text>
          <Text style={s.footerText}>{date}</Text>
        </View>
      </Page>

      {/* Page 2: Breakdown + Recommendations */}
      <Page size="A4" style={s.page}>
        <View style={s.section}>
          <Text style={s.sectionTitle}>Riskanalys per kategori</Text>
          {BREAKDOWN_CATS.map(({ key, label, max }) => {
            const cat = report.breakdown[key];
            return (
              <View key={key} style={s.catRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.catLabel}>{label}</Text>
                  {cat.findings.map((f, i) => (
                    <Text key={i} style={s.catFinding}>
                      · {f}
                    </Text>
                  ))}
                </View>
                <Text style={s.catScore}>
                  {cat.score}/{max}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Recommendations */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Rekommendationer</Text>
          {report.recommendations.map((rec, i) => (
            <View key={i} style={s.recRow}>
              <View style={s.recHeader}>
                <Text
                  style={[
                    s.recPriorityBadge,
                    { backgroundColor: PRIORITY_COLORS[rec.priority] ?? '#71717a' },
                  ]}
                >
                  {rec.priority.toUpperCase()}
                </Text>
                <Text style={s.recReplace}>{rec.replace}</Text>
                <Text style={s.recArrow}>→</Text>
                <Text style={s.recWith}>{rec.with}</Text>
              </View>
              <Text style={s.recRationale}>{rec.rationale}</Text>
            </View>
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>SuveranKoll | IT-Bladet investigative tool</Text>
          <Text style={s.footerText}>
            Rapport genererad {date} · ID: {report.reportGeneratedAt.slice(0, 10)}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
