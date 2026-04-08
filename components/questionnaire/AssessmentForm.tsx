import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from './ProgressBar';
import { QuestionStep } from './QuestionStep';
import { getStepQuestions, TOTAL_STEPS, STEP_TITLES } from './questions';
import type { AssessmentFormData } from '@/types';

export function AssessmentForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<AssessmentFormData>({ mode: 'onBlur' });

  const stepQuestions = getStepQuestions(step);

  async function createAssessmentIfNeeded(data: AssessmentFormData): Promise<string> {
    if (assessmentId) return assessmentId;
    const res = await fetch('/api/assessment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        org_name: data['org_name'] || null,
        org_size: data['org_size'] || null,
        sector: data['sector'] || null,
      }),
    });
    if (!res.ok) throw new Error('Kunde inte skapa bedömning');
    const { id } = await res.json();
    setAssessmentId(id);
    return id;
  }

  async function saveAnswers(id: string, data: AssessmentFormData, stepNum: number) {
    const stepQs = getStepQuestions(stepNum);
    const answers = stepQs
      .filter((q) => !q.isOrgField)
      .map((q) => {
        const raw = data[q.id];
        const value = Array.isArray(raw) ? raw.join(',') : (raw as string) || '';
        const label = Array.isArray(raw)
          ? raw.map((v) => q.options?.find((o) => o.value === v)?.label ?? v).join(', ')
          : q.options?.find((o) => o.value === value)?.label ?? value;
        return { question_id: q.id, answer_value: value, answer_label: label };
      });

    if (answers.length === 0) return;

    const res = await fetch(`/api/assessment/${id}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) throw new Error('Kunde inte spara svar');
  }

  async function onNext(data: AssessmentFormData) {
    setSubmitting(true);
    setError(null);
    try {
      const id = await createAssessmentIfNeeded(data);
      await saveAnswers(id, data, step);
      if (step < TOTAL_STEPS) {
        setStep((s) => s + 1);
      } else {
        // Final step: trigger report generation and redirect
        const res = await fetch(`/api/report/${id}/generate`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Rapportgenerering misslyckades');
        }
        router.push(`/report/${id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar currentStep={step} />

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">{STEP_TITLES[step]}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onNext)} noValidate>
              {stepQuestions.map((q) => (
                <QuestionStep key={q.id} question={q} />
              ))}

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-700 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={step === 1 || submitting}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  Tillbaka
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white min-w-[140px]"
                >
                  {submitting
                    ? step === TOTAL_STEPS
                      ? 'Genererar rapport…'
                      : 'Sparar…'
                    : step === TOTAL_STEPS
                    ? 'Generera rapport'
                    : 'Nästa steg'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
