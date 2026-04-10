import { Progress } from '@/components/ui/progress';
import { TOTAL_STEPS, STEP_TITLES } from './questions';

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const pct = Math.round(((currentStep - 1) / TOTAL_STEPS) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-400">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <span className="text-sm text-zinc-500">{STEP_TITLES[currentStep]}</span>
      </div>
      <Progress value={pct} className="h-1.5 bg-zinc-800" />
      <div className="flex justify-between mt-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`text-xs font-medium transition-colors ${
              step < currentStep
                ? 'text-emerald-500'
                : step === currentStep
                ? 'text-white'
                : 'text-zinc-600'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
