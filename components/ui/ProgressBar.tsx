interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
}

export function ProgressBar({ value, max = 100, label }: ProgressBarProps) {
  const progress = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="space-y-2">
      {label ? <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p> : null}
      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-sky-600 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{Math.round(progress)}% complete</p>
    </div>
  );
}
