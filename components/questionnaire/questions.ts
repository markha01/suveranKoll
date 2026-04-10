import type { Question } from '@/types';

export const TOTAL_STEPS = 5;

export const STEP_TITLES: Record<number, string> = {
  1: 'About Your Organization',
  2: 'Cloud Infrastructure',
  3: 'AI Tools & Shadow IT',
  4: 'GDPR & Data',
  5: 'Legal & Exit Strategy',
};

export const questions: Question[] = [
  // Step 1 – Organization Context
  {
    id: 'org_name',
    step: 1,
    type: 'text',
    question: 'What is the name of your organization?',
    required: true,
    isOrgField: true,
  },
  {
    id: 'sector',
    step: 1,
    type: 'select',
    question: 'Which sector does your organization operate in?',
    required: true,
    isOrgField: true,
    options: [
      { value: 'Public sector', label: 'Public sector' },
      { value: 'Healthcare', label: 'Healthcare' },
      { value: 'Finance', label: 'Finance & banking' },
      { value: 'Education', label: 'Education' },
      { value: 'Private sector', label: 'Private sector' },
    ],
  },
  {
    id: 'org_size',
    step: 1,
    type: 'select',
    question: 'How many employees does your organization have?',
    required: true,
    isOrgField: true,
    options: [
      { value: '<50', label: 'Fewer than 50' },
      { value: '50-250', label: '50–250' },
      { value: '250-1000', label: '250–1,000' },
      { value: '1000+', label: 'More than 1,000' },
    ],
  },

  // Step 2 – Cloud Infrastructure
  {
    id: 'cloud_providers',
    step: 2,
    type: 'multi-select',
    question: 'Which are your primary cloud providers?',
    required: true,
    options: [
      { value: 'AWS', label: 'Amazon AWS' },
      { value: 'Azure', label: 'Microsoft Azure' },
      { value: 'GCP', label: 'Google Cloud' },
      { value: 'OVHcloud', label: 'OVHcloud' },
      { value: 'Hetzner', label: 'Hetzner' },
      { value: 'Scaleway', label: 'Scaleway' },
      { value: 'On-premises', label: 'Own servers (on-premises)' },
      { value: "Don't know", label: "Don't know" },
    ],
  },
  {
    id: 'data_location',
    step: 2,
    type: 'multi-select',
    question: 'Where is your data stored?',
    required: true,
    options: [
      { value: 'EU only', label: 'Within the EU/EEA only' },
      { value: 'US', label: 'In the United States' },
      { value: 'Global CDN', label: 'Globally via CDN' },
      { value: "Don't know", label: "Don't know" },
    ],
  },
  {
    id: 'us_workload_pct',
    step: 2,
    type: 'radio',
    question: 'What percentage of your critical workloads run on US cloud services?',
    required: true,
    options: [
      { value: '0%', label: '0% — no critical systems on US cloud' },
      { value: '<25%', label: 'Under 25%' },
      { value: '25-75%', label: '25–75%' },
      { value: '>75%', label: 'More than 75%' },
    ],
  },

  // Step 3 – AI Tools & Shadow IT
  {
    id: 'ai_tools',
    step: 3,
    type: 'multi-select',
    question: 'Which AI tools are officially used in your organization?',
    required: true,
    options: [
      { value: 'ChatGPT/OpenAI', label: 'ChatGPT / OpenAI API' },
      { value: 'Microsoft Copilot', label: 'Microsoft Copilot' },
      { value: 'Google Gemini', label: 'Google Gemini' },
      { value: 'Self-hosted open-source', label: 'Self-hosted open-source (e.g. Llama, Mistral)' },
      { value: 'None', label: 'No AI tools' },
      { value: 'Other', label: 'Other tools' },
    ],
  },
  {
    id: 'shadow_ai',
    step: 3,
    type: 'radio',
    question: 'Do employees use unsanctioned AI tools — without IT department approval?',
    required: true,
    options: [
      { value: 'Yes', label: 'Yes, definitely' },
      { value: 'Likely', label: 'Likely' },
      { value: 'Unknown', label: 'Unknown — we have no visibility' },
      { value: 'No', label: 'No' },
      { value: 'We have controls', label: 'No — we have technical controls in place' },
    ],
  },

  // Step 4 – GDPR & Data
  {
    id: 'gdpr_data',
    step: 4,
    type: 'radio',
    question: 'Does your organization process personal data subject to GDPR?',
    required: true,
    options: [
      { value: 'Yes – extensively', label: 'Yes — extensively (e.g. customer or patient data)' },
      { value: 'Yes – limited scope', label: 'Yes — limited scope' },
      { value: 'No', label: 'No' },
    ],
  },
  {
    id: 'us_subprocessors',
    step: 4,
    type: 'radio',
    question: 'Are US-based subprocessors involved in handling your personal data?',
    required: true,
    options: [
      { value: 'Yes', label: 'Yes, without Standard Contractual Clauses (SCCs)' },
      { value: 'Yes with SCCs', label: 'Yes, with SCCs in place' },
      { value: 'No', label: 'No' },
      { value: "Don't know", label: "Don't know" },
    ],
  },
  {
    id: 'data_residency_guarantee',
    step: 4,
    type: 'radio',
    question: 'Do you have written data residency guarantees from your cloud providers?',
    required: true,
    options: [
      { value: 'Yes contractually', label: 'Yes — contractually binding guarantees' },
      { value: 'Informal', label: 'Informal assurances — no binding contract' },
      { value: 'No', label: 'No' },
      { value: "Don't know", label: "Don't know" },
    ],
  },

  // Step 5 – Legal & Exit Strategy
  {
    id: 'cloud_act_review',
    step: 5,
    type: 'radio',
    question:
      'Has your legal team reviewed your cloud contracts for Cloud Act and FISA exposure?',
    required: true,
    options: [
      { value: 'Yes by legal', label: 'Yes — reviewed by qualified legal counsel' },
      { value: 'In progress', label: 'In progress' },
      { value: 'No', label: 'No' },
      { value: "Don't know", label: "Don't know" },
    ],
  },
  {
    id: 'exit_strategy',
    step: 5,
    type: 'radio',
    question:
      'Do you have a concrete plan to migrate away from US hyperscalers if required?',
    required: true,
    options: [
      { value: 'Yes documented', label: 'Yes — documented and tested plan' },
      { value: 'Informal plan', label: 'An informal plan exists' },
      { value: 'No', label: 'No' },
      { value: 'Not considered', label: 'The question has not been discussed' },
    ],
  },
];

export function getStepQuestions(step: number): Question[] {
  return questions.filter((q) => q.step === step);
}
