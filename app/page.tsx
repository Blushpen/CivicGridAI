"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.32em] text-sky-600">CivicGrid AI</p>
            <h1 className="text-4xl font-semibold sm:text-5xl">Hackathon MVP</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              CivicGrid AI - Smart Public Infrastructure & Complaint Resolution Platform with AI classification, duplicate detection, and gamified civic engagement.
            </p>
          </div>

          {/* Developer 2: Admin, Worker, AI & Gamification */}
          <section className="rounded-3xl border-2 border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-900/20 p-6">
            <h2 className="text-xl font-semibold text-sky-900 dark:text-sky-100 mb-4">
              Developer 2 Feature Area
            </h2>
            <p className="text-sm text-sky-800 dark:text-sky-200 mb-4">
              Admin Dashboard • Worker Dashboard • AI Classification • Duplicate Detection • Gamification Engine
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/worker"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
              >
                Worker Dashboard
              </Link>
              <Link
                href="/gamification"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
              >
                Gamification &amp; Leaderboard
              </Link>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-800">
              <h2 className="text-xl font-semibold">Key local commands</h2>
              <ul className="mt-4 space-y-3 text-slate-700 dark:text-slate-300 text-sm font-mono">
                <li>npm install</li>
                <li>cp .env.example .env</li>
                <li>npm run dev</li>
                <li>npm run build</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-800">
              <h2 className="text-xl font-semibold">MVP Architecture</h2>
              <ul className="mt-4 space-y-2 text-slate-700 dark:text-slate-300 text-sm">
                <li>✓ Citizen reporting and dashboard</li>
                <li>✓ AI classification (mock + provider-agnostic)</li>
                <li>✓ Duplicate detection</li>
                <li>✓ Admin queue and assignment</li>
                <li>✓ Worker task management</li>
                <li>✓ Gamification and leaderboard</li>
              </ul>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-xl font-semibold">Setup checklist</h2>
            <ol className="mt-4 space-y-3 text-slate-700 dark:text-slate-300 text-sm">
              <li>1. Install dependencies: <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">npm install</code></li>
              <li>2. Copy environment file: <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">cp .env.example .env</code></li>
              <li>3. Set <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">AI_PROVIDER=mock</code> for local demo</li>
              <li>4. Verify build: <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">npm run build</code></li>
              <li>5. Start development server: <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">npm run dev</code></li>
              <li>6. Navigate to <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">http://localhost:3000</code> in your browser</li>
            </ol>
          </section>
        </div>
      </div>
    </main>
  );
}
