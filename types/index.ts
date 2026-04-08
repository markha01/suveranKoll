export type RiskLevel = 'high' | 'moderate' | 'low';
export type Priority = 'critical' | 'high' | 'medium';
export type AssessmentStatus = 'in_progress' | 'completed';

export interface Assessment {
  id: string;
  org_name: string | null;
  org_size: string | null;
  sector: string | null;
  status: AssessmentStatus;
  sovereignty_score: number | null;
  score_breakdown: ScoreBreakdown | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentAnswer {
  id: number;
  assessment_id: string;
  question_id: string;
  answer_value: string;
  answer_label: string;
  created_at: string;
}

export interface ScoreBreakdown {
  cloudInfrastructure: CategoryScore;
  gdprDataResidency: CategoryScore;
  cloudActLegal: CategoryScore;
  aiShadowIT: CategoryScore;
}

export interface CategoryScore {
  score: number;
  maxScore: number;
}

export interface SovereigntyReport {
  executiveSummary: string;
  sovereigntyScore: number;
  riskLevel: RiskLevel;
  keyRisks: string[];
  breakdown: {
    gdpr: { score: number; findings: string[] };
    cloudAct: { score: number; findings: string[] };
    dataResidency: { score: number; findings: string[] };
    shadowAI: { score: number; findings: string[] };
  };
  recommendations: Array<{
    priority: Priority;
    replace: string;
    with: string;
    rationale: string;
  }>;
  reportGeneratedAt: string;
}

export interface ReportRow {
  id: string;
  assessment_id: string;
  report_json: SovereigntyReport;
  created_at: string;
}

export interface QuestionOption {
  value: string;
  label: string;
  score?: number;
}

export type QuestionType = 'text' | 'select' | 'radio' | 'multi-select';

export interface Question {
  id: string;
  step: number;
  type: QuestionType;
  question: string;
  options?: QuestionOption[];
  required?: boolean;
  isOrgField?: boolean; // stored in assessments table directly
}

export interface AssessmentFormData {
  [questionId: string]: string | string[];
}
