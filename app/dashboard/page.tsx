import { Card } from "@/components/ui/Card";
import { BadgePill } from "@/components/ui/BadgePill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { issues, users } from "@/services/mockDataService";

export default function DashboardPage() {
  const currentUser = users.find((user) => user.role === "CITIZEN") ?? users[0];
  const recentIssues = issues.slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Citizen dashboard</p>
          <h1 className="text-4xl font-semibold">Welcome back, {currentUser.name}</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
            See your active missions, recent reports, and community impact across your ward.
          </p>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
          <Card className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2 rounded-3xl bg-slate-100 p-5 dark:bg-slate-900">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">XP</p>
                <p className="text-3xl font-semibold">{currentUser.xp}</p>
              </div>
              <div className="space-y-2 rounded-3xl bg-slate-100 p-5 dark:bg-slate-900">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Reputation</p>
                <p className="text-3xl font-semibold">{currentUser.reputation}</p>
              </div>
              <div className="space-y-2 rounded-3xl bg-slate-100 p-5 dark:bg-slate-900">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">CivicCoins</p>
                <p className="text-3xl font-semibold">{currentUser.civicCoins}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Level progress</p>
              <ProgressBar value={62} max={100} label="Current progress toward next level" />
            </div>
          </Card>

          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Active mission</p>
                <h2 className="text-2xl font-semibold">Road Guardian Challenge</h2>
              </div>
              <BadgePill variant="info">In progress</BadgePill>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Complete 3 verified road-related contributions to earn 50 XP and the Road Guardian badge.
            </p>
            <ProgressBar value={1} max={3} label="Road Guardian progress" />
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Recent reports</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Your latest issue submissions and status updates.</p>
              </div>
            </div>
            <div className="space-y-4">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{issue.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{issue.category} • {issue.ward}</p>
                    </div>
                    <BadgePill variant={issue.status === "RESOLVED" ? "success" : issue.status === "IN_PROGRESS" ? "info" : "warning"}>
                      {issue.status.replace("_", " ")}
                    </BadgePill>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{issue.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">Leaderboard preview</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Top citizens by XP and reputation.</p>
            </div>
            <div className="space-y-3">
              {users.slice(0, 3).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">#{index + 1}</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{user.xp} XP</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
