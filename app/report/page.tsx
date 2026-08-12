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
import { detectDuplicateIssue } from "@/lib/duplicateDetector";
import { issues as existingIssues } from "@/services/mockDataService";
import { createIssue } from "@/services/issueService";

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
  const [lat, setLat] = useState(12.9716);
  const [lon, setLon] = useState(77.5946);
  const [locationDesc, setLocationDesc] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [classificationText, setClassificationText] = useState<string | null>(null);
  const [possibleDuplicate, setPossibleDuplicate] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setClassificationText(null);
    setPossibleDuplicate(null);
    setSuccess(null);

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    setLoading(true);

    // Call AI classifier (integration point)
    let aiResult = null;
    try {
      aiResult = await classifier.classifyIssue({ description, category });
      const cat = aiResult?.category ?? "Unknown";
      const sev = aiResult?.severity ?? "Low";
      const dept = aiResult?.department ?? "Unassigned";
      const conf = aiResult?.confidence ? Math.round(aiResult.confidence * 100) : 0;
      setClassificationText(`${cat} • ${sev} • ${dept} (${conf}% confidence)`);
    } catch (e) {
      // fallback: continue without AI
      aiResult = null;
    }

    // Run duplicate detection integration
    try {
      const candidate = detectDuplicateIssue(
        { category, location: { latitude: lat, longitude: lon, description: locationDesc }, createdAt: new Date().toISOString(), status: "REPORTED" },
        existingIssues
      );
      if (candidate.isDuplicate && candidate.duplicateIssue) {
        setPossibleDuplicate(candidate.message ?? "Possible duplicate issue nearby.");
        // allow user to continue; for MVP we continue automatically after warning
      }
    } catch (e) {
      // ignore duplicate detection failures for now
    }

    // Create the issue via the shared service
    try {
      const created = await createIssue({
        title: description.substring(0, 80),
        category,
        description,
        reporterId: "user-citizen-1",
        location: { latitude: lat, longitude: lon, description: locationDesc || "" },
        image: image ? image.name : null,
        ai: aiResult,
      });

      setSuccess(created.id);
    } catch (e) {
      setError("Failed to create issue.");
    }

    setLoading(false);
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
            {possibleDuplicate ? <Toast title="Possible duplicate" description={possibleDuplicate} variant="info" /> : null}
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Location description</label>
                <Input value={locationDesc} onChange={(event) => setLocationDesc(event.target.value)} placeholder="e.g. Ward 3, Market Road" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Input type="number" step="0.0001" value={lat} onChange={(e) => setLat(Number(e.target.value))} />
              <Input type="number" step="0.0001" value={lon} onChange={(e) => setLon(Number(e.target.value))} />
              <Input type="file" onChange={(e) => setImage(e.target.files && e.target.files.length ? e.target.files[0] : null)} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <TextArea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what you saw and where." />
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit issue'}</Button>
              {success ? <Toast title="Submitted" description={`Issue created: ${success}`} variant="success" /> : null}
            </div>
          </form>
        </Card>

        {classificationText ? (
          <Card className="space-y-4">
            <h2 className="text-2xl font-semibold">AI Classification</h2>
            <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{classificationText}</p>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
