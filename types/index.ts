export type Tweet = {
  id: number;
  content: string;
  status: "ai-generated" | "scheduled" | "posted";
  timestamp: string;
  tweet_id?: string;
  engagement: {
    likes: number;
    replies: number;
    retweets: number;
  };
  product_name?: string;
};

export interface MoreMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean; // ✅ Add this line to support danger flag
}