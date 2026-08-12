export function LoadingSpinner() {
  return (
    <div className="flex h-full w-full items-center justify-center py-12">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-slate-200 border-t-sky-600 animate-spin dark:border-slate-700 dark:border-t-sky-400" />
    </div>
  );
}
