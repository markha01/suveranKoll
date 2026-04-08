import Anthropic from '@anthropic-ai/sdk';
import type { Assessment, AssessmentAnswer, SovereigntyReport } from '@/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateReport(
  assessment: Assessment,
  answers: AssessmentAnswer[]
): Promise<SovereigntyReport> {
  const answerMap = Object.fromEntries(answers.map((a) => [a.question_id, a.answer_label || a.answer_value]));

  const systemPrompt = `Du är Annika Dahl, it-säkerhetsredaktör på IT-Bladet. Du skriver analytiska, icke-sensationalistiska rapporter om digital suveränitet och cloud-risker för svenska organisationer. Din ton är saklig, skeptisk och direkt. Du undviker startup-jargong och tomma fraser. Varje rapport du skriver är ett verktyg för styrelserum – inte en marknadsföringsfolder.

Return your analysis ONLY as a valid JSON object matching this TypeScript interface (no markdown fences, no explanation text outside the JSON):

interface SovereigntyReport {
  executiveSummary: string;
  sovereigntyScore: number;
  riskLevel: "high" | "moderate" | "low";
  keyRisks: string[];
  breakdown: {
    gdpr: { score: number; findings: string[] };
    cloudAct: { score: number; findings: string[] };
    dataResidency: { score: number; findings: string[] };
    shadowAI: { score: number; findings: string[] };
  };
  recommendations: Array<{
    priority: "critical" | "high" | "medium";
    replace: string;
    with: string;
    rationale: string;
  }>;
  reportGeneratedAt: string;
}`;

  const userPrompt = `Analysera följande självskattningsdata för en svensk organisation och generera en suveränitetsrapport.

Organisation: ${assessment.org_name || 'Okänd organisation'}
Sektor: ${assessment.sector || 'Ej angiven'}
Storlek: ${assessment.org_size || 'Ej angiven'}
Beräknat suveränitetspoäng: ${assessment.sovereignty_score}/100

Svar på frågorna:
- Primära molnleverantörer: ${answerMap['cloud_providers'] || 'Ej angivet'}
- Datalagring: ${answerMap['data_location'] || 'Ej angivet'}
- Kritiska arbetsbelastningar på US-moln: ${answerMap['us_workload_pct'] || 'Ej angivet'}
- AI-verktyg i bruk: ${answerMap['ai_tools'] || 'Ej angivet'}
- Skugg-AI (osanktionerade AI-verktyg): ${answerMap['shadow_ai'] || 'Ej angivet'}
- Hanterar personuppgifter enligt GDPR: ${answerMap['gdpr_data'] || 'Ej angivet'}
- Amerikanska underbehandlare: ${answerMap['us_subprocessors'] || 'Ej angivet'}
- Skriftlig datalagringsgaranti: ${answerMap['data_residency_guarantee'] || 'Ej angivet'}
- Avtalsgenomgång för Cloud Act/FISA: ${answerMap['cloud_act_review'] || 'Ej angivet'}
- Migrationsstrategi från US-hyperscalers: ${answerMap['exit_strategy'] || 'Ej angivet'}

Score-breakdown:
${JSON.stringify(assessment.score_breakdown, null, 2)}

Instruksjoner:
1. executiveSummary: 2-3 meningar på svenska, styrelsenivå. Även låga risker ska ha en varning.
2. keyRisks: 3-5 konkreta risker på svenska
3. breakdown scores: använd exakta värden från score_breakdown-objektet ovan
4. recommendations: minst 3 rekommendationer med specifika alternativ (t.ex. "AWS S3" → "Hetzner Object Storage"). Prioritet baseras på riskprofil.
5. reportGeneratedAt: ISO 8601 timestamp (now)
6. Skriv findings och rationale på svenska.
7. Returnera ENBART JSON – inga markdown-tecken, inga förklaringar.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude');

  let text = content.text.trim();
  // Strip markdown fences if present
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }

  return JSON.parse(text) as SovereigntyReport;
}
