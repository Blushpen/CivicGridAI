import { IssueEvent } from "@/types";

interface Props {
  events: IssueEvent[];
}

export function IssueTimeline({ events }: Props) {
  if (!events || events.length === 0) return <p className="text-sm text-slate-600 dark:text-slate-400">No timeline available.</p>;

  const sorted = [...events].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="space-y-4">
      {sorted.map((e) => (
        <div key={e.id} className="flex items-start gap-4">
          <div className="h-3 w-3 flex-shrink-0 rounded-full bg-sky-600 mt-2" />
          <div>
            <p className="text-sm font-semibold">{e.type.replace("_", " ")}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{e.message}</p>
            <p className="text-xs text-slate-400">{new Date(e.createdAt).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
