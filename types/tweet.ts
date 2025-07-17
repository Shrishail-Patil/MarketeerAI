export interface Tweet {
  id: number;
  content: string;
  scheduledTime?: string; // optional: used in scheduled tweets
}