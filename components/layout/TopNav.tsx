import Link from "next/link";

export function TopNav() {
  return (
    <nav className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur dark:border-slate-700 dark:bg-slate-950/90">
      <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        CivicGrid AI
      </Link>
      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
        <Link href="/dashboard" className="transition hover:text-slate-900 dark:hover:text-white">
          Dashboard
        </Link>
        <Link href="/report" className="transition hover:text-slate-900 dark:hover:text-white">
          Report Issue
        </Link>
      </div>
    </nav>
  );
}
