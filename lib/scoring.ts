import type { AssessmentAnswer, ScoreBreakdown, RiskLevel } from '@/types';

export interface ScoringResult {
  total: number;
  breakdown: ScoreBreakdown;
  riskLevel: RiskLevel;
}

export class ScoringEngine {
  private answers: Map<string, string>;

  constructor(answers: AssessmentAnswer[]) {
    this.answers = new Map(answers.map((a) => [a.question_id, a.answer_value]));
  }

  calculate(): ScoringResult {
    const cloudInfrastructure = this.scoreCloudInfrastructure();
    const gdprDataResidency = this.scoreGDPR();
    const cloudActLegal = this.scoreCloudAct();
    const aiShadowIT = this.scoreAI();

    const total =
      cloudInfrastructure.score +
      gdprDataResidency.score +
      cloudActLegal.score +
      aiShadowIT.score;

    return {
      total,
      breakdown: { cloudInfrastructure, gdprDataResidency, cloudActLegal, aiShadowIT },
      riskLevel: this.getRiskLevel(total),
    };
  }

  private scoreCloudInfrastructure(): { score: number; maxScore: number } {
    let score = 0;

    // Q4: cloud_providers (20 pts)
    const providers = this.answers.get('cloud_providers') ?? '';
    const providerList = providers.split(',').filter(Boolean);
    const euProviders = ['OVHcloud', 'Hetzner', 'Scaleway', 'On-premises'];
    const usProviders = ['AWS', 'Azure', 'GCP'];

    const hasEU = providerList.some((p) => euProviders.includes(p));
    const hasUS = providerList.some((p) => usProviders.includes(p));
    const hasDontKnow = providerList.includes("Don't know");

    if (hasDontKnow) {
      score += 0;
    } else if (hasEU && !hasUS) {
      score += 20; // EU-only
    } else if (hasEU && hasUS) {
      // hybrid — determine primary
      const euCount = providerList.filter((p) => euProviders.includes(p)).length;
      const usCount = providerList.filter((p) => usProviders.includes(p)).length;
      score += euCount >= usCount ? 13 : 6;
    } else if (hasUS && !hasEU) {
      score += 0; // US-only
    }

    // Q6: us_workload_pct (10 pts)
    const workload = this.answers.get('us_workload_pct') ?? '';
    if (workload === '0%') score += 10;
    else if (workload === '<25%') score += 7;
    else if (workload === '25-75%') score += 3;
    else if (workload === '>75%') score += 0;

    return { score, maxScore: 30 };
  }

  private scoreGDPR(): { score: number; maxScore: number } {
    let score = 0;

    // Q10: us_subprocessors (15 pts)
    const subproc = this.answers.get('us_subprocessors') ?? '';
    if (subproc === 'No') score += 15;
    else if (subproc === 'Yes with SCCs') score += 8;
    else if (subproc === "Don't know") score += 3;
    else if (subproc === 'Yes') score += 0;

    // Q11: data_residency_guarantee (10 pts)
    const residency = this.answers.get('data_residency_guarantee') ?? '';
    if (residency === 'Yes contractually') score += 10;
    else if (residency === 'Informal') score += 5;
    else if (residency === "Don't know") score += 2;
    else if (residency === 'No') score += 0;

    return { score, maxScore: 25 };
  }

  private scoreCloudAct(): { score: number; maxScore: number } {
    let score = 0;

    // Q12: cloud_act_review (15 pts)
    const review = this.answers.get('cloud_act_review') ?? '';
    if (review === 'Yes by legal') score += 15;
    else if (review === 'In progress') score += 8;
    else if (review === "Don't know") score += 2;
    else if (review === 'No') score += 0;

    // Q13: exit_strategy (10 pts)
    const exit = this.answers.get('exit_strategy') ?? '';
    if (exit === 'Yes documented') score += 10;
    else if (exit === 'Informal plan') score += 6;
    else if (exit === 'No') score += 0;
    else if (exit === 'Not considered') score += 0;

    return { score, maxScore: 25 };
  }

  private scoreAI(): { score: number; maxScore: number } {
    let score = 0;

    // Q7: ai_tools (12 pts)
    const tools = this.answers.get('ai_tools') ?? '';
    const toolList = tools.split(',').filter(Boolean);
    const highRisk = ['ChatGPT/OpenAI', 'Microsoft Copilot'];
    const medRisk = ['Google Gemini'];
    const selfHosted = ['Self-hosted open-source', 'None'];

    const hasSelfHosted = toolList.some((t) => selfHosted.includes(t));
    const hasHighRisk = toolList.some((t) => highRisk.includes(t));
    const hasMedRisk = toolList.some((t) => medRisk.includes(t));

    if (hasSelfHosted && !hasHighRisk && !hasMedRisk) {
      score += 12;
    } else if (!hasHighRisk && !hasMedRisk) {
      score += 9; // EU tools or 'Other' only
    } else if (!hasHighRisk && hasMedRisk) {
      score += 5;
    } else {
      score += 0; // ChatGPT or Copilot present
    }

    // Q8: shadow_ai (8 pts)
    const shadow = this.answers.get('shadow_ai') ?? '';
    if (shadow === 'We have controls') score += 8;
    else if (shadow === 'No') score += 5;
    else if (shadow === 'Unknown') score += 2;
    else if (shadow === 'Likely' || shadow === 'Yes') score += 0;

    return { score, maxScore: 20 };
  }

  private getRiskLevel(score: number): RiskLevel {
    if (score <= 30) return 'high';
    if (score <= 70) return 'moderate';
    return 'low';
  }
}
