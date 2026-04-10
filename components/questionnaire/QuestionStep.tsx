import { useFormContext, Controller } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { Question, AssessmentFormData } from '@/types';

interface QuestionStepProps {
  question: Question;
}

export function QuestionStep({ question }: QuestionStepProps) {
  const { register, control, formState: { errors } } = useFormContext<AssessmentFormData>();
  const error = errors[question.id];

  return (
    <div className="mb-8 last:mb-0">
      <Label className="text-base font-medium text-white leading-relaxed block mb-4">
        {question.question}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {question.type === 'text' && (
        <Input
          {...register(question.id, { required: question.required ? 'Required field' : false })}
          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500"
          placeholder="Enter answer..."
        />
      )}

      {question.type === 'select' && (
        <Controller
          name={question.id}
          control={control}
          rules={{ required: question.required ? 'Required field' : false }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value as string}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white focus:border-emerald-500">
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {question.options?.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      )}

      {question.type === 'radio' && (
        <Controller
          name={question.id}
          control={control}
          rules={{ required: question.required ? 'Required field' : false }}
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value as string}
              className="space-y-2"
            >
              {question.options?.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    field.value === opt.value
                      ? 'border-emerald-500 bg-emerald-950/30'
                      : 'border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <RadioGroupItem
                    value={opt.value}
                    className="border-zinc-500 text-emerald-500 shrink-0"
                  />
                  <span className="text-zinc-200 text-sm leading-relaxed flex-1">
                    {opt.label}
                  </span>
                </label>
              ))}
            </RadioGroup>
          )}
        />
      )}

      {question.type === 'multi-select' && (
        <Controller
          name={question.id}
          control={control}
          defaultValue={[]}
          rules={{
            validate: (val) =>
              !question.required ||
              (Array.isArray(val) && val.length > 0) ||
              'Select at least one option',
          }}
          render={({ field }) => {
            const selected: string[] = Array.isArray(field.value) ? (field.value as string[]) : [];
            const toggle = (value: string) => {
              const next = selected.includes(value)
                ? selected.filter((v) => v !== value)
                : [...selected, value];
              field.onChange(next);
            };
            return (
              <div className="space-y-2">
                {question.options?.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => toggle(opt.value)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selected.includes(opt.value)
                        ? 'border-emerald-500 bg-emerald-950/30'
                        : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <span onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id={`${question.id}-${opt.value}`}
                        checked={selected.includes(opt.value)}
                        onCheckedChange={() => toggle(opt.value)}
                        className="border-zinc-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                    </span>
                    <Label
                      htmlFor={`${question.id}-${opt.value}`}
                      className="text-zinc-200 cursor-pointer text-sm leading-relaxed"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            );
          }}
        />
      )}

      {error && (
        <p className="mt-2 text-sm text-red-400">{error.message as string}</p>
      )}
    </div>
  );
}
