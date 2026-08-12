export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.32em] text-sky-600">CivicGrid AI</p>
            <h1 className="text-4xl font-semibold sm:text-5xl">Hackathon MVP setup</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              CivicGrid AI is ready for local development. Use the checklist below to finish the workspace setup, then run the demo.
            </p>
          </div>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-800">
              <h2 className="text-xl font-semibold">Key local commands</h2>
              <ul className="mt-4 space-y-3 text-slate-700 dark:text-slate-300">
                <li>npm install</li>
                <li>copy .env.example to .env</li>
                <li>npm run dev</li>
                <li>npm run build</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-800">
              <h2 className="text-xl font-semibold">Demo focus</h2>
              <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">
                The MVP demo should cover issue reporting, AI classification, duplicate detection, route assignment, worker resolution, and gamified reputation updates.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-xl font-semibold">Setup checklist</h2>
            <ol className="mt-4 space-y-3 text-slate-700 dark:text-slate-300">
              <li>Install dependencies: <code>npm install</code></li>
              <li>Copy environment file: <code>cp .env.example .env</code></li>
              <li>Set AI_PROVIDER to <code>mock</code> for local demo</li>
              <li>Verify build: <code>npm run build</code></li>
              <li>Start development server: <code>npm run dev</code></li>
            </ol>
          </section>
        </div>
      </div>
    </main>
  );
}
