import { describe, it, expect } from 'vitest';
import { LanguageService } from '../services/languageService';
import { VoiceInputService } from '../services/voiceService';
import { generateIssueSummary } from '../services/issueSummaryService';
import { createNotification, NotificationEventType } from '../services/notificationService';
import { AIClassifier, TextClassifierAdapter } from '../lib/aiClassifier';

describe('advanced AI features', () => {
  it('detects english, hindi, and telugu input language', () => {
    const languageService = new LanguageService();

    expect(languageService.detectLanguage('There is a large pothole on the road.').language).toBe('en');
    expect(languageService.detectLanguage('यहाँ सड़क पर बड़ा गड्ढा है।').language).toBe('hi');
    expect(languageService.detectLanguage('ఇక్కడ పెద్ద గుంత ఉంది').language).toBe('te');
  });

  it('normalizes multilingual issue descriptions for a consistent internal format', () => {
    const languageService = new LanguageService();

    const hindi = languageService.normalizeText('यहाँ सड़क पर बड़ा गड्ढा है।');
    const telugu = languageService.normalizeText('ఇక్కడ పెద్ద గుంత ఉంది');

    expect(hindi.normalizedText.toLowerCase()).toContain('road');
    expect(hindi.normalizedText.toLowerCase()).toContain('pothole');
    expect(telugu.normalizedText.toLowerCase()).toContain('pothole');
  });

  it('falls back safely when voice input is unavailable or empty', async () => {
    const voiceService = new VoiceInputService({
      isSupported: () => false,
      start: async () => ({ transcript: '' }),
    });

    const result = await voiceService.captureVoiceInput('');

    expect(result.isFallback).toBe(true);
    expect(result.text).toBe('');
  });

  it('keeps the classifier interface compatible with AI classification output', async () => {
    const classifier = new AIClassifier(new TextClassifierAdapter());

    const result = await classifier.classifyIssue({ description: 'There is a big pothole near the bus stop' });

    expect(result).toMatchObject({
      category: 'Pothole',
      severity: expect.any(String),
      confidence: expect.any(Number),
      department: expect.any(String),
      reason: expect.any(String),
    });
  });

  it('generates explainable issue summaries without inventing facts', () => {
    const summary = generateIssueSummary({
      description: 'There is a huge pothole near the bus stop and motorcycles are struggling.',
      category: 'Pothole',
      severity: 'High',
      department: 'Roads',
    });

    expect(summary.category).toBe('Pothole');
    expect(summary.severity).toBe('High');
    expect(summary.department).toBe('Roads');
    expect(summary.summary.toLowerCase()).toContain('pothole');
    expect(summary.summary.toLowerCase()).toContain('bus stop');
  });

  it('creates in-app notifications for civic events', () => {
    const notification = createNotification({
      eventType: NotificationEventType.ISSUE_SUBMITTED,
      issueId: 'issue-42',
      title: 'Issue submitted',
      description: 'Your issue has been received.',
    });

    expect(notification.title).toContain('submitted');
    expect(notification.eventType).toBe(NotificationEventType.ISSUE_SUBMITTED);
    expect(notification.inApp).toBe(true);
  });
});
