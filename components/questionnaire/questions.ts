import type { Question } from '@/types';

export const TOTAL_STEPS = 5;

export const STEP_TITLES: Record<number, string> = {
  1: 'Om er organisation',
  2: 'Molninfrastruktur',
  3: 'AI-verktyg & skugg-IT',
  4: 'GDPR & data',
  5: 'Juridik & exitstrategi',
};

export const questions: Question[] = [
  // Step 1 – Organization Context
  {
    id: 'org_name',
    step: 1,
    type: 'text',
    question: 'Vad heter er organisation?',
    required: true,
    isOrgField: true,
  },
  {
    id: 'sector',
    step: 1,
    type: 'select',
    question: 'Vilken sektor verkar ni i?',
    required: true,
    isOrgField: true,
    options: [
      { value: 'Public sector', label: 'Offentlig sektor' },
      { value: 'Healthcare', label: 'Vård och omsorg' },
      { value: 'Finance', label: 'Finans och bank' },
      { value: 'Education', label: 'Utbildning' },
      { value: 'Private sector', label: 'Privat sektor' },
    ],
  },
  {
    id: 'org_size',
    step: 1,
    type: 'select',
    question: 'Hur många anställda har organisationen?',
    required: true,
    isOrgField: true,
    options: [
      { value: '<50', label: 'Färre än 50' },
      { value: '50-250', label: '50–250' },
      { value: '250-1000', label: '250–1 000' },
      { value: '1000+', label: 'Mer än 1 000' },
    ],
  },

  // Step 2 – Cloud Infrastructure
  {
    id: 'cloud_providers',
    step: 2,
    type: 'multi-select',
    question: 'Vilka är era primära molnleverantörer?',
    required: true,
    options: [
      { value: 'AWS', label: 'Amazon AWS' },
      { value: 'Azure', label: 'Microsoft Azure' },
      { value: 'GCP', label: 'Google Cloud' },
      { value: 'OVHcloud', label: 'OVHcloud' },
      { value: 'Hetzner', label: 'Hetzner' },
      { value: 'Scaleway', label: 'Scaleway' },
      { value: 'On-premises', label: 'Egna servrar (on-premises)' },
      { value: "Don't know", label: 'Vet inte' },
    ],
  },
  {
    id: 'data_location',
    step: 2,
    type: 'multi-select',
    question: 'Var lagras er data?',
    required: true,
    options: [
      { value: 'EU only', label: 'Enbart inom EU/EES' },
      { value: 'US', label: 'I USA' },
      { value: 'Global CDN', label: 'Globalt via CDN' },
      { value: "Don't know", label: 'Vet inte' },
    ],
  },
  {
    id: 'us_workload_pct',
    step: 2,
    type: 'radio',
    question: 'Hur stor andel av era kritiska arbetsbelastningar körs på amerikanska molntjänster?',
    required: true,
    options: [
      { value: '0%', label: '0% – inga kritiska system i amerikanska moln' },
      { value: '<25%', label: 'Under 25%' },
      { value: '25-75%', label: '25–75%' },
      { value: '>75%', label: 'Mer än 75%' },
    ],
  },

  // Step 3 – AI Tools & Shadow IT
  {
    id: 'ai_tools',
    step: 3,
    type: 'multi-select',
    question: 'Vilka AI-verktyg används officiellt i er organisation?',
    required: true,
    options: [
      { value: 'ChatGPT/OpenAI', label: 'ChatGPT / OpenAI API' },
      { value: 'Microsoft Copilot', label: 'Microsoft Copilot' },
      { value: 'Google Gemini', label: 'Google Gemini' },
      { value: 'Self-hosted open-source', label: 'Självhostad öppen källkod (t.ex. Llama, Mistral)' },
      { value: 'None', label: 'Inga AI-verktyg' },
      { value: 'Other', label: 'Andra verktyg' },
    ],
  },
  {
    id: 'shadow_ai',
    step: 3,
    type: 'radio',
    question:
      'Använder anställda osanktionerade AI-verktyg – utan IT-avdelningens godkännande?',
    required: true,
    options: [
      { value: 'Yes', label: 'Ja, definitivt' },
      { value: 'Likely', label: 'Troligtvis' },
      { value: 'Unknown', label: 'Okänt – vi har ingen överblick' },
      { value: 'No', label: 'Nej' },
      { value: 'We have controls', label: 'Nej – vi har tekniska kontroller på plats' },
    ],
  },

  // Step 4 – GDPR & Data
  {
    id: 'gdpr_data',
    step: 4,
    type: 'radio',
    question: 'Hanterar er organisation personuppgifter som lyder under GDPR?',
    required: true,
    options: [
      { value: 'Yes – extensively', label: 'Ja – i stor utsträckning (t.ex. kund- eller patientdata)' },
      { value: 'Yes – limited scope', label: 'Ja – i begränsad omfattning' },
      { value: 'No', label: 'Nej' },
    ],
  },
  {
    id: 'us_subprocessors',
    step: 4,
    type: 'radio',
    question:
      'Är amerikanska underbehandlare involverade i hanteringen av er persondata?',
    required: true,
    options: [
      { value: 'Yes', label: 'Ja, utan standardavtalsklausuler (SCC)' },
      { value: 'Yes with SCCs', label: 'Ja, med SCC på plats' },
      { value: 'No', label: 'Nej' },
      { value: "Don't know", label: 'Vet inte' },
    ],
  },
  {
    id: 'data_residency_guarantee',
    step: 4,
    type: 'radio',
    question: 'Har ni skriftliga garantier om datalagring från era molnleverantörer?',
    required: true,
    options: [
      { value: 'Yes contractually', label: 'Ja – avtalsmässigt bindande garantier' },
      { value: 'Informal', label: 'Informella utfästelser, inga bindande avtal' },
      { value: 'No', label: 'Nej' },
      { value: "Don't know", label: 'Vet inte' },
    ],
  },

  // Step 5 – Legal & Exit Strategy
  {
    id: 'cloud_act_review',
    step: 5,
    type: 'radio',
    question:
      'Har ert juridiska team faktiskt granskat era molnavtal med avseende på Cloud Act- och FISA-exponering?',
    required: true,
    options: [
      { value: 'Yes by legal', label: 'Ja – granskade av juridisk kompetens' },
      { value: 'In progress', label: 'Pågår' },
      { value: 'No', label: 'Nej' },
      { value: "Don't know", label: 'Vet inte' },
    ],
  },
  {
    id: 'exit_strategy',
    step: 5,
    type: 'radio',
    question:
      'Har ni en konkret plan för att migrera bort från amerikanska hyperscalers om det skulle behövas?',
    required: true,
    options: [
      { value: 'Yes documented', label: 'Ja – dokumenterad och testad plan' },
      { value: 'Informal plan', label: 'En informell plan finns' },
      { value: 'No', label: 'Nej' },
      { value: 'Not considered', label: 'Frågan har inte diskuterats' },
    ],
  },
];

export function getStepQuestions(step: number): Question[] {
  return questions.filter((q) => q.step === step);
}
