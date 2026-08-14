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
import { useNotification } from "@/components/notifications/NotificationProvider";
import { validateReport } from "@/services/reportValidator";
import { LanguageService } from "@/services/languageService";
import { VoiceInputService } from "@/services/voiceService";
import { generateIssueSummary } from "@/services/issueSummaryService";
import { createNotification, NotificationEventType } from "@/services/notificationService";

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
const languageService = new LanguageService();
const voiceService = new VoiceInputService();

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
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const notification = useNotification();

  const handleVoiceInput = async () => {
    const result = await voiceService.captureVoiceInput(description);
    if (result.text) {
      setDescription((prev) => (prev ? `${prev} ${result.text}` : result.text));
      setVoiceStatus("Voice input captured and added to the report.");
    } else {
      setVoiceStatus(result.error ?? "Voice input unavailable. Please type your report.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setClassificationText(null);
    setPossibleDuplicate(null);
    setSuccess(null);

    const normalized = languageService.normalizeText(description);
    const normalizedDescription = normalized.normalizedText || description;
    const validation = validateReport({ category, description: normalizedDescription, latitude: lat, longitude: lon });
    if (!validation.valid) {
      setError(validation.errors.join(" "));
      return;
    }

    setLoading(true);

    // Call AI classifier (integration point)
    let aiResult = null;
    try {
      aiResult = await classifier.classifyIssue({ description: normalizedDescription, category, voiceText: description.trim() || undefined });
      const cat = aiResult?.category ?? "Unknown";
      const sev = aiResult?.severity ?? "Low";
      const dept = aiResult?.department ?? "Unassigned";
      const conf = aiResult?.confidence ? Math.round(aiResult.confidence * 100) : 0;
      const summary = generateIssueSummary({
        description: normalizedDescription,
        category: cat,
        severity: sev,
        department: dept,
      });
      setClassificationText(`${cat} • ${sev} • ${dept} (${conf}% confidence) • ${summary.summary}`);
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
        title: normalizedDescription.substring(0, 80),
        category,
        description: normalizedDescription,
        reporterId: "user-citizen-1",
        location: { latitude: lat, longitude: lon, description: locationDesc || "" },
        image: image ? image.name : null,
        ai: aiResult,
      });

      setSuccess(created.id);
      try {
        const inAppNotification = createNotification({
          eventType: NotificationEventType.ISSUE_SUBMITTED,
          issueId: created.id,
          title: "Issue submitted successfully",
          description: `Issue ID: ${created.id} · ${generateIssueSummary({ description: normalizedDescription, category: aiResult?.category ?? category, severity: aiResult?.severity ?? "Medium", department: aiResult?.department ?? "Unassigned" }).summary}`,
          variant: "success",
        });
        notification?.notify({ title: inAppNotification.title, description: inAppNotification.description, variant: inAppNotification.variant });
      } catch (e) {
        // ignore
      }
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
                <label htmlFor="issue-category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Issue category</label>
                <Select id="issue-category" aria-label="Issue category" value={category} onChange={(event) => setCategory(event.target.value as IssueCategory)}>
                  {categories.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="location-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Location description</label>
                <Input id="location-description" aria-label="Location description" value={locationDesc} onChange={(event) => setLocationDesc(event.target.value)} placeholder="e.g. Ward 3, Market Road" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="latitude" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Latitude</label>
                <Input id="latitude" aria-label="Latitude" type="number" step="0.0001" value={lat} onChange={(e) => setLat(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <label htmlFor="longitude" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Longitude</label>
                <Input id="longitude" aria-label="Longitude" type="number" step="0.0001" value={lon} onChange={(e) => setLon(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <label htmlFor="issue-photo" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Upload evidence</label>
                <Input id="issue-photo" aria-label="Upload issue evidence" type="file" onChange={(e) => setImage(e.target.files && e.target.files.length ? e.target.files[0] : null)} />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="issue-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <TextArea id="issue-description" aria-label="Issue description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what you saw and where." />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button type="button" variant="secondary" className="bg-slate-200 text-slate-900 hover:bg-slate-300" onClick={handleVoiceInput}>Use voice input</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit issue'}</Button>
              {success ? <Toast title="Submitted" description={`Issue created: ${success}`} variant="success" /> : null}
            </div>
            {voiceStatus ? <p className="text-sm text-slate-600 dark:text-slate-300">{voiceStatus}</p> : null}
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
