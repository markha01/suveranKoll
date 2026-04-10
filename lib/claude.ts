import type { Assessment, AssessmentAnswer, SovereigntyReport } from '@/types';

export async function generateReport(
  assessment: Assessment,
  answers: AssessmentAnswer[]
): Promise<SovereigntyReport> {
  const a = Object.fromEntries(answers.map((ans) => [ans.question_id, ans.answer_value]));
  const breakdown = assessment.score_breakdown;

  const providers = (a['cloud_providers'] ?? '').split(',').filter(Boolean);
  const dataLoc = (a['data_location'] ?? '').split(',').filter(Boolean);
  const aiTools = (a['ai_tools'] ?? '').split(',').filter(Boolean);

  const hasUS = providers.some((p) => ['AWS', 'Azure', 'GCP'].includes(p));
  const hasEU = providers.some((p) => ['OVHcloud', 'Hetzner', 'Scaleway', 'On-premises'].includes(p));
  const usOnly = hasUS && !hasEU;
  const score = assessment.sovereignty_score ?? 0;
  const riskLevel: SovereigntyReport['riskLevel'] =
    score <= 30 ? 'high' : score <= 70 ? 'moderate' : 'low';

  // ── Executive Summary ──────────────────────────────────────────────────────
  let executiveSummary: string;
  if (riskLevel === 'high') {
    executiveSummary =
      `${assessment.org_name ?? 'This organization'} scored ${score}/100 — placing it firmly in the high-risk category for digital sovereignty. ` +
      `Critical workloads are exposed to US jurisdiction through hyperscaler dependencies, insufficient GDPR safeguards, or unreviewed Cloud Act exposure. ` +
      `Immediate action is required before this becomes a regulatory or reputational liability.`;
  } else if (riskLevel === 'moderate') {
    executiveSummary =
      `${assessment.org_name ?? 'This organization'} scored ${score}/100 — a moderate sovereignty posture with identifiable gaps that carry real legal risk. ` +
      `While some controls are in place, reliance on US-based services creates ongoing exposure to FISA 702 and the Cloud Act. ` +
      `Without concrete remediation steps, this risk profile will worsen as regulatory scrutiny increases.`;
  } else {
    executiveSummary =
      `${assessment.org_name ?? 'This organization'} scored ${score}/100 — a relatively strong sovereignty posture compared to industry peers. ` +
      `However, no organization using commercial cloud services is fully insulated from jurisdictional risk. ` +
      `The recommendations below address the remaining exposure and should be reviewed at board level.`;
  }

  // ── Key Risks ──────────────────────────────────────────────────────────────
  const keyRisks: string[] = [];

  if (usOnly) {
    keyRisks.push('All cloud infrastructure runs on US-controlled hyperscalers, making the organization subject to US law regardless of where data is physically stored.');
  } else if (hasUS) {
    keyRisks.push('US hyperscalers present in the cloud stack expose the organization to Cloud Act and FISA 702 data requests.');
  }
  if (dataLoc.includes('US')) {
    keyRisks.push('Data is confirmed to be stored in the United States — directly subject to US government access laws.');
  }
  if (a['us_subprocessors'] === 'Yes') {
    keyRisks.push('US subprocessors are used without Standard Contractual Clauses, creating a direct GDPR violation risk.');
  } else if (a['us_subprocessors'] === "Don't know") {
    keyRisks.push('US subprocessor involvement is unknown — a compliance gap that regulators will not excuse.');
  }
  if (a['cloud_act_review'] === 'No' || a['cloud_act_review'] === "Don't know") {
    keyRisks.push('Cloud Act and FISA 702 exposure has never been formally assessed by legal counsel.');
  }
  if (a['shadow_ai'] === 'Yes' || a['shadow_ai'] === 'Likely') {
    keyRisks.push('Employees are likely using unsanctioned AI tools, creating uncontrolled data flows to third-party US AI services.');
  }
  if (a['exit_strategy'] === 'No' || a['exit_strategy'] === 'Not considered') {
    keyRisks.push('No exit strategy from US hyperscalers exists — creating severe vendor lock-in and no contingency if geopolitical conditions change.');
  }
  if (a['data_residency_guarantee'] === 'No' || a['data_residency_guarantee'] === "Don't know") {
    keyRisks.push('No contractual data residency guarantees in place — storage location cannot be enforced.');
  }

  // Ensure at least 3 risks
  if (keyRisks.length < 3) {
    keyRisks.push('Continued reliance on commercial cloud services requires ongoing legal monitoring as EU-US data transfer frameworks remain legally contested.');
    if (keyRisks.length < 3) {
      keyRisks.push('Self-assessment data should be validated through a formal third-party security and compliance audit.');
    }
  }

  // ── Category Findings ──────────────────────────────────────────────────────

  // GDPR (gdprDataResidency → report.breakdown.gdpr)
  const gdprFindings: string[] = [];
  if (a['gdpr_data'] === 'Yes – extensively') {
    gdprFindings.push('Organization processes significant personal data — high GDPR compliance stakes.');
  } else if (a['gdpr_data'] === 'Yes – limited scope') {
    gdprFindings.push('Limited personal data processing — GDPR compliance still applies.');
  }
  if (a['us_subprocessors'] === 'Yes') {
    gdprFindings.push('US subprocessors used without SCCs — direct GDPR violation risk.');
  } else if (a['us_subprocessors'] === 'Yes with SCCs') {
    gdprFindings.push('US subprocessors present with SCCs, but SCCs do not fully mitigate Cloud Act exposure.');
  } else if (a['us_subprocessors'] === "Don't know") {
    gdprFindings.push('US subprocessor involvement unknown — critical compliance gap.');
  } else if (a['us_subprocessors'] === 'No') {
    gdprFindings.push('No US subprocessors identified — positive for GDPR compliance.');
  }
  if (a['data_residency_guarantee'] === 'Yes contractually') {
    gdprFindings.push('Contractual data residency guarantees in place.');
  } else if (a['data_residency_guarantee'] === 'Informal') {
    gdprFindings.push('Only informal data residency assurances — not legally enforceable.');
  } else if (a['data_residency_guarantee'] === 'No') {
    gdprFindings.push('No written data residency guarantees from cloud providers.');
  } else if (a['data_residency_guarantee'] === "Don't know") {
    gdprFindings.push('Data residency guarantee status unknown — review contracts immediately.');
  }

  // Cloud Act (cloudActLegal → report.breakdown.cloudAct)
  const cloudActFindings: string[] = [];
  if (a['cloud_act_review'] === 'Yes by legal') {
    cloudActFindings.push('Legal team has formally reviewed Cloud Act and FISA 702 exposure — best practice.');
  } else if (a['cloud_act_review'] === 'In progress') {
    cloudActFindings.push('Cloud Act review underway — ensure completion before signing new US cloud contracts.');
  } else if (a['cloud_act_review'] === 'No') {
    cloudActFindings.push('Cloud Act and FISA 702 exposure has never been assessed — a critical legal gap.');
  } else if (a['cloud_act_review'] === "Don't know") {
    cloudActFindings.push('Cloud Act review status unknown — legal team must be engaged immediately.');
  }
  if (a['exit_strategy'] === 'Yes documented') {
    cloudActFindings.push('Documented and tested migration plan from US hyperscalers exists.');
  } else if (a['exit_strategy'] === 'Informal plan') {
    cloudActFindings.push('An informal migration plan exists but is not documented or tested.');
  } else if (a['exit_strategy'] === 'No') {
    cloudActFindings.push('No exit strategy from US hyperscalers — severe vendor lock-in.');
  } else if (a['exit_strategy'] === 'Not considered') {
    cloudActFindings.push('Migration away from US hyperscalers has never been discussed — significant strategic risk.');
  }

  // Cloud Infrastructure (cloudInfrastructure → report.breakdown.dataResidency)
  const dataResidencyFindings: string[] = [];
  if (usOnly) {
    dataResidencyFindings.push('All critical infrastructure runs on US-controlled hyperscalers (AWS / Azure / GCP).');
  } else if (hasUS && hasEU) {
    dataResidencyFindings.push('Hybrid environment: both EU and US cloud providers in use.');
  } else if (hasEU) {
    dataResidencyFindings.push('Infrastructure relies on European cloud providers — positive sovereignty posture.');
  }
  if (dataLoc.includes('US')) {
    dataResidencyFindings.push('Data stored in US jurisdiction — subject to US surveillance laws.');
  }
  if (dataLoc.includes("Don't know")) {
    dataResidencyFindings.push('Data location unknown — an immediate inventory is required.');
  }
  if (a['us_workload_pct'] === '>75%') {
    dataResidencyFindings.push('Over 75% of critical workloads run on US cloud services.');
  } else if (a['us_workload_pct'] === '25-75%') {
    dataResidencyFindings.push('25–75% of critical workloads on US cloud — significant exposure.');
  } else if (a['us_workload_pct'] === '<25%') {
    dataResidencyFindings.push('Less than 25% of workloads on US cloud — manageable but still real exposure.');
  } else if (a['us_workload_pct'] === '0%') {
    dataResidencyFindings.push('No critical workloads reported on US cloud services.');
  }

  // AI & Shadow IT (aiShadowIT → report.breakdown.shadowAI)
  const shadowAIFindings: string[] = [];
  if (aiTools.includes('ChatGPT/OpenAI')) {
    shadowAIFindings.push('ChatGPT / OpenAI API in official use — data processed by a US-based AI service.');
  }
  if (aiTools.includes('Microsoft Copilot')) {
    shadowAIFindings.push('Microsoft Copilot in official use — data processed by a US-based service.');
  }
  if (aiTools.includes('Google Gemini')) {
    shadowAIFindings.push('Google Gemini in official use — data processed by a US-based AI service.');
  }
  if (aiTools.includes('Self-hosted open-source')) {
    shadowAIFindings.push('Self-hosted open-source AI models in use — data stays on-premises.');
  }
  if (aiTools.includes('None')) {
    shadowAIFindings.push('No AI tools officially deployed.');
  }
  if (a['shadow_ai'] === 'Yes' || a['shadow_ai'] === 'Likely') {
    shadowAIFindings.push('Employees are likely using unsanctioned AI tools — significant uncontrolled data flow risk.');
  } else if (a['shadow_ai'] === 'Unknown') {
    shadowAIFindings.push('Shadow AI usage unknown — no monitoring or controls in place.');
  } else if (a['shadow_ai'] === 'No') {
    shadowAIFindings.push('No known unauthorized AI tool usage reported.');
  } else if (a['shadow_ai'] === 'We have controls') {
    shadowAIFindings.push('Technical controls in place to prevent unauthorized AI tool usage.');
  }

  // Ensure no empty findings arrays
  if (gdprFindings.length === 0) gdprFindings.push('Insufficient data to assess GDPR posture — review subprocessor agreements and data residency contracts.');
  if (cloudActFindings.length === 0) cloudActFindings.push('Cloud Act exposure not assessed — legal review required.');
  if (dataResidencyFindings.length === 0) dataResidencyFindings.push('Cloud infrastructure details not fully provided — conduct an infrastructure audit.');
  if (shadowAIFindings.length === 0) shadowAIFindings.push('AI tool usage not fully disclosed — conduct an internal AI inventory.');

  // ── Recommendations ────────────────────────────────────────────────────────
  const recommendations: SovereigntyReport['recommendations'] = [];

  if (providers.includes('AWS')) {
    recommendations.push({
      priority: 'critical',
      replace: 'Amazon AWS',
      with: 'Hetzner Cloud or OVHcloud',
      rationale: 'AWS is a US company subject to the Cloud Act. Hetzner (Germany) and OVHcloud (France) are EU-based alternatives with comparable object storage, compute, and managed database offerings at lower cost.',
    });
  }
  if (providers.includes('Azure')) {
    recommendations.push({
      priority: 'critical',
      replace: 'Microsoft Azure',
      with: 'OVHcloud or Scaleway',
      rationale: 'Microsoft is subject to US jurisdiction regardless of where Azure data centres are located. OVHcloud and Scaleway offer GDPR-native infrastructure with no US parent company.',
    });
  }
  if (providers.includes('GCP')) {
    recommendations.push({
      priority: 'critical',
      replace: 'Google Cloud Platform',
      with: 'Scaleway or Hetzner',
      rationale: 'Google is a US company. Scaleway (France) and Hetzner (Germany) provide equivalent managed infrastructure without US jurisdictional exposure.',
    });
  }
  if (aiTools.includes('ChatGPT/OpenAI')) {
    recommendations.push({
      priority: 'high',
      replace: 'ChatGPT / OpenAI API',
      with: 'Self-hosted Llama 3 or Mistral via Ollama',
      rationale: 'OpenAI is a US company. Running open-source LLMs locally via Ollama ensures no data leaves your infrastructure. For managed EU options, consider Mistral AI (France).',
    });
  }
  if (aiTools.includes('Microsoft Copilot')) {
    recommendations.push({
      priority: 'high',
      replace: 'Microsoft Copilot',
      with: 'Open-source alternatives (e.g. Continue.dev with local models)',
      rationale: 'Copilot routes data through Microsoft\'s US-controlled infrastructure. Local AI coding assistants using open-source models eliminate this exposure.',
    });
  }
  if (aiTools.includes('Google Gemini')) {
    recommendations.push({
      priority: 'high',
      replace: 'Google Gemini',
      with: 'Mistral AI (EU-hosted) or self-hosted open-source model',
      rationale: 'Google Gemini processes data in US infrastructure. Mistral AI is a European company with EU-based data processing.',
    });
  }
  if (a['cloud_act_review'] !== 'Yes by legal') {
    recommendations.push({
      priority: 'critical',
      replace: 'Unreviewed cloud contracts',
      with: 'Legal audit of all cloud and SaaS agreements',
      rationale: 'Every contract with a US-based cloud provider must be reviewed for Cloud Act and FISA 702 implications. This is a board-level legal obligation, not an IT task.',
    });
  }
  if (a['exit_strategy'] === 'No' || a['exit_strategy'] === 'Not considered') {
    recommendations.push({
      priority: 'high',
      replace: 'No migration strategy',
      with: 'Documented cloud exit and migration plan',
      rationale: 'A tested exit strategy from US hyperscalers is essential risk management. Without it, the organization is entirely dependent on geopolitical goodwill.',
    });
  }
  if (a['shadow_ai'] === 'Yes' || a['shadow_ai'] === 'Likely' || a['shadow_ai'] === 'Unknown') {
    recommendations.push({
      priority: 'high',
      replace: 'Uncontrolled shadow AI usage',
      with: 'AI governance policy + approved internal tooling',
      rationale: 'Shadow AI is the fastest-growing source of uncontrolled data egress. Deploy a formal AI use policy and provide sanctioned alternatives so employees do not default to consumer tools.',
    });
  }

  // Always include a data residency recommendation if not contractually covered
  if (a['data_residency_guarantee'] !== 'Yes contractually') {
    recommendations.push({
      priority: 'medium',
      replace: 'Informal or absent data residency assurances',
      with: 'Contractually binding data residency guarantees',
      rationale: 'Verbal assurances and marketing claims from cloud providers are not enforceable. Require explicit contractual data residency terms and audit compliance annually.',
    });
  }

  return {
    executiveSummary,
    sovereigntyScore: score,
    riskLevel,
    keyRisks: keyRisks.slice(0, 5),
    breakdown: {
      gdpr: { score: breakdown?.gdprDataResidency?.score ?? 0, findings: gdprFindings },
      cloudAct: { score: breakdown?.cloudActLegal?.score ?? 0, findings: cloudActFindings },
      dataResidency: { score: breakdown?.cloudInfrastructure?.score ?? 0, findings: dataResidencyFindings },
      shadowAI: { score: breakdown?.aiShadowIT?.score ?? 0, findings: shadowAIFindings },
    },
    recommendations,
    reportGeneratedAt: new Date().toISOString(),
  };
}
