// utils/timeUtils.ts

export function getTimeAgo(timestamp: string | Date): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks}w ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths}mo ago`;
  } else {
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears}y ago`;
  }
}

export function formatAnalyticsNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';  
  }
  return num.toLocaleString();
}

export function calculateTimeRange(createdAt: string | Date): { start_time: string; end_time: string } {
  const tweetCreatedAt = new Date(createdAt);
  const now = new Date();
  
  // Ensure we don't go before the tweet was created
  const start_time = tweetCreatedAt.toISOString();
  const end_time = now.toISOString();

  return { start_time, end_time };
}

export function isValidTimeRange(startTime: string, endTime: string): boolean {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return start < end && start.getTime() > 0 && end.getTime() > 0;
}