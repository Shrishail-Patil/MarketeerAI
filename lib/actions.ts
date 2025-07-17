import { Tweet } from "../types/tweet";

export async function postIt(tweet: Tweet) {
  try {
    const res = await fetch("/api/tweet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tweet),
    });

    if (!res.ok) {
      throw new Error("Failed to post tweet.");
    }

    const data = await res.json();
    console.log("Tweet posted:", data);
    return data;
  } catch (error) {
    console.error("Post error:", error);
  }
}