// utils/twitter.ts
export async function postTweet(accessToken: string, tweetText: string) {
  const response = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: tweetText }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Twitter API error: ${errorData.title}`);
  }

  return await response.json();
}
