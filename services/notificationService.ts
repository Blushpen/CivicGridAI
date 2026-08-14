export enum NotificationEventType {
  ISSUE_SUBMITTED = 'issue_submitted',
  ISSUE_ASSIGNED = 'issue_assigned',
  ISSUE_IN_PROGRESS = 'issue_in_progress',
  ISSUE_RESOLVED = 'issue_resolved',
  XP_EARNED = 'xp_earned',
  BADGE_EARNED = 'badge_earned',
  MISSION_COMPLETED = 'mission_completed',
}

export interface NotificationPayload {
  id: string;
  eventType: NotificationEventType;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'error';
  inApp: boolean;
  createdAt: string;
  issueId?: string;
}

export interface CreateNotificationInput {
  eventType: NotificationEventType;
  issueId?: string;
  title?: string;
  description?: string;
  variant?: 'success' | 'info' | 'error';
}

export function createNotification(input: CreateNotificationInput): NotificationPayload {
  const title = input.title ?? defaultTitle(input.eventType);
  const description = input.description ?? defaultDescription(input.eventType);

  return {
    id: `notification-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    eventType: input.eventType,
    title,
    description,
    variant: input.variant ?? 'info',
    inApp: true,
    createdAt: new Date().toISOString(),
    issueId: input.issueId,
  };
}

function defaultTitle(eventType: NotificationEventType): string {
  switch (eventType) {
    case NotificationEventType.ISSUE_SUBMITTED:
      return 'Issue submitted successfully';
    case NotificationEventType.ISSUE_ASSIGNED:
      return 'Issue assigned to a worker';
    case NotificationEventType.ISSUE_IN_PROGRESS:
      return 'Issue is in progress';
    case NotificationEventType.ISSUE_RESOLVED:
      return 'Issue resolved';
    case NotificationEventType.XP_EARNED:
      return 'XP earned';
    case NotificationEventType.BADGE_EARNED:
      return 'Badge earned';
    case NotificationEventType.MISSION_COMPLETED:
      return 'Mission completed';
    default:
      return 'Civic update';
  }
}

function defaultDescription(eventType: NotificationEventType): string {
  switch (eventType) {
    case NotificationEventType.ISSUE_SUBMITTED:
      return 'Your issue has been recorded and will be reviewed.';
    case NotificationEventType.ISSUE_ASSIGNED:
      return 'The issue has been assigned to the relevant team.';
    case NotificationEventType.ISSUE_IN_PROGRESS:
      return 'The team is currently working on this issue.';
    case NotificationEventType.ISSUE_RESOLVED:
      return 'The issue has been marked as resolved.';
    case NotificationEventType.XP_EARNED:
      return 'You earned experience points for your civic contribution.';
    case NotificationEventType.BADGE_EARNED:
      return 'You unlocked a new civic badge.';
    case NotificationEventType.MISSION_COMPLETED:
      return 'You completed a civic mission and earned rewards.';
    default:
      return 'There is a new civic update.';
  }
}
