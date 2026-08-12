"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { Toast } from "@/components/ui/Toast";
import { AIClassifier, MockAIClassifierProvider } from "@/lib/aiClassifier";
import { IssueCategory } from "@/types";

const categories: IssueCategory[] = [
  "Pothole",
  "Road Damage",
  "Garbage",
  "Water Leak",
  "Drain Blockage",
  "Flooding",
  "Broken Streetlight",
  "Fallen Tree",
];

const classifier = new AIClassifier(new MockAIClassifierProvider());

export default function ReportPage() {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueCategory>("Pothole");
  const [location, setLocation] = useState("");
  const [classification, setClassification] = useState<null | string>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setClassification(null);

    if (!description.trim() || !location.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const result = await classifier.classifyIssue({ description, category });
    setClassification(`${result.category} • ${result.severity} • ${result.department} (${Math.round(result.confidence * 100)}% confidence)`);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Report issue</p>
          <h1 className="text-4xl font-semibold">Submit a civic issue</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Share the issue details and let CivicGrid AI classify the problem, severity, and department routing.
          </p>
        </header>

        <Card className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error ? <Toast title="Validation error" description={error} variant="error" /> : null}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Issue category</label>
                <Select value={category} onChange={(event) => setCategory(event.target.value as IssueCategory)}>
                  {categories.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Ward 3, Market Road" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <TextArea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what you saw and where." />
            </div>

            <Button type="submit">Classify issue</Button>
          </form>
        </Card>

        {classification ? (
          <Card className="space-y-4">
            <h2 className="text-2xl font-semibold">AI Classification</h2>
            <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{classification}</p>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
