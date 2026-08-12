"use client";

import { useEffect, useState } from "react";
import { getIssueById } from "@/services/issueService";
import { issueEvents, issues as mockIssues } from "@/services/mockDataService";
import { Issue } from "@/types";
import { Card } from "@/components/ui/Card";
import { IssueTimeline } from "@/components/IssueTimeline";
import { useParams } from "next/navigation";

export default function IssueDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [issue, setIssue] = useState<Issue | null>(null);

  useEffect(() => {
    if (!id) return;
    getIssueById(id).then((res) => setIssue(res ?? null));
  }, [id]);

  if (!issue) {
    return (
      <main className="min-h-screen px-6 py-10">
        <p>Issue not found.</p>
      </main>
    );
  }

  const events = issueEvents.filter((e) => e.issueId === issue.id);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-semibold">{issue.title}</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <p className="text-sm text-slate-500">Category</p>
            <p className="font-semibold">{issue.category}</p>
            <p className="mt-4 text-sm text-slate-500">Description</p>
            <p className="mt-1 text-sm">{issue.description}</p>
            <p className="mt-4 text-sm text-slate-500">Location</p>
            <p className="mt-1 text-sm">{issue.location.description} ({issue.location.latitude.toFixed(4)},{issue.location.longitude.toFixed(4)})</p>
            <p className="mt-4 text-sm text-slate-500">Status</p>
            <p className="mt-1 font-semibold">{issue.status}</p>
          </Card>

          <Card>
            <p className="text-sm text-slate-500">AI Classification</p>
            <p className="font-semibold">{issue.category} • {issue.severity}</p>
            <p className="mt-2 text-sm text-slate-600">Confidence: {issue.confidence ? Math.round(issue.confidence * 100) + '%' : 'N/A'}</p>
            <p className="mt-4 text-sm text-slate-500">Department</p>
            <p className="mt-1 font-semibold">{issue.departmentId || 'Unassigned'}</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold">Issue Timeline</h2>
          <div className="mt-4">
            <IssueTimeline events={events} />
          </div>
        </Card>
      </div>
    </main>
  );
}
