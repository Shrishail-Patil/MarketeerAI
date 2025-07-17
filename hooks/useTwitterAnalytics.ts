// hooks/useTwitterAnalytics.ts
import { useState, useEffect, useCallback } from 'react';

interface AnalyticsMetrics {
  impressions: number;
  likes: number;
  replies: number;
  retweets: number;
  quote_tweets: number;
  engagements: number;
  media_views?: number;
  link_clicks?: number;
  profile_visits?: number;
  detail_expands?: number;
}

interface AnalyticsData {
  id: string;
  timestamped_metrics: Array<{
    metrics: AnalyticsMetrics;
    timestamp: string;
  }>;
}

interface AnalyticsResponse {
  success: boolean;
  analytics: {
    data: AnalyticsData;
    errors?: Array<{
      detail: string;
      status: number;
      title: string;
      type: string;
    }>;
  };
  metadata: {
    tweetCount: number;
    timeRange: {
      start_time: string;
      end_time: string;
    };
    granularity: string;
    fields: string[];
  };
}

interface UseTwitterAnalyticsOptions {
  tweetId?: string;
  createdAt?: string; // When the tweet was created
  granularity?: 'hourly' | 'daily' | 'weekly' | 'total';
  fields?: string[];
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseTwitterAnalyticsReturn {
  analytics: AnalyticsMetrics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

const DEFAULT_FIELDS = [
  'impressions',
  'likes', 
  'replies',
  'retweets',
  'quote_tweets',
  'engagements',
  'media_views',
  'link_clicks'
];

export function useTwitterAnalytics({
  tweetId,
  createdAt,
  granularity = 'total',
  fields = DEFAULT_FIELDS,
  autoRefresh = false,
  refreshInterval = 300000 // 5 minutes
}: UseTwitterAnalyticsOptions): UseTwitterAnalyticsReturn {
  const [analytics, setAnalytics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const calculateTimeRange = useCallback(() => {
    if (!createdAt) {
      // Default to last 7 days if no creation date
      const end = new Date();
      const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      return {
        start_time: start.toISOString(),
        end_time: end.toISOString()
      };
    }

    const tweetCreatedAt = new Date(createdAt);
    const now = new Date();
    
    // Ensure we don't go before the tweet was created
    const start_time = tweetCreatedAt.toISOString();
    const end_time = now.toISOString();

    return { start_time, end_time };
  }, [createdAt]);

  const fetchAnalytics = useCallback(async () => {
    if (!tweetId) {
      setError('Tweet ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { start_time, end_time } = calculateTimeRange();

      const response = await fetch('/api/post-analytic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tweetIds: [tweetId],
          start_time,
          end_time,
          granularity,
          fields
        })
      });

      const data: AnalyticsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.analytics?.errors?.[0]?.detail || 'Failed to fetch analytics');
      }

      if (data.success && data.analytics.data) {
        // Get the latest metrics (for 'total' granularity, there's usually one entry)
        const latestMetrics = data.analytics.data.timestamped_metrics?.[0]?.metrics;
        if (latestMetrics) {
          setAnalytics(latestMetrics);
          setLastUpdated(new Date());
        } else {
          setError('No analytics data available');
        }
      } else {
        setError('No analytics data returned');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [tweetId, granularity, fields, calculateTimeRange]);

  // Initial fetch
  useEffect(() => {
    if (tweetId) {
      fetchAnalytics();
    }
  }, [tweetId, fetchAnalytics]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !tweetId) return;

    const interval = setInterval(() => {
      fetchAnalytics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, tweetId, fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
    lastUpdated
  };
}