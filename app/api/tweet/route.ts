import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Replace with actual ID of the Build In Public community
const BUILD_IN_PUBLIC_COMMUNITY_ID = "1550660791162697728";

// POST /api/tweet
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const tweetText = body.text;

  if (!tweetText || typeof tweetText !== "string") {
    return NextResponse.json({ error: "Invalid tweet text" }, { status: 400 });
  }

  // Optional: allow media, polls, etc. if provided in body
  const payload: Record<string, any> = {
    text: tweetText,
    // community_id: BUILD_IN_PUBLIC_COMMUNITY_ID,
  };

  if (body.media_ids?.length) {
    payload.media = { media_ids: body.media_ids };
  }

  if (body.poll) {
    payload.poll = body.poll;
  }

  if (body.reply) {
    payload.reply = body.reply;
  }

  try {
    console.log(session.accessToken)
    const twitterRes = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await twitterRes.json();

    if (!twitterRes.ok) {
      console.error("❌ Twitter API error:", data);
      return NextResponse.json({ error: "Twitter API failed", detail: data }, { status: 403 });
    }

    // Return tweet ID so you can track analytics later
    return NextResponse.json({
      success: true,
      tweet_id: data.data.id,
      tweet: data.data,
    });
  } catch (err) {
    console.error("❌ Error tweeting:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}