import { NextRequest, NextResponse } from 'next/server'
import Together from "together-ai"

const together = new Together({
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { 
      xId, 
      customTone, 
      description,
      keyFeatures, 
      productName, 
      targetAudience, 
      tonePreference 
    } = await request.json()

    if (!description || !productName) {
      return NextResponse.json(
        { error: 'Product description and name are required' },
        { status: 400 }
      )
    }

    // Determine the tone to use
    const effectiveTone = customTone?.trim() || tonePreference || 'friendly'
    
    // Parse target audience
    interface GenTweetsRequestBody {
      xId?: string
      customTone?: string
      description: string
      keyFeatures?: string[]
      productName: string
      targetAudience?: string
      tonePreference?: string
    }

    const audienceList: string[] = targetAudience?.replace(/['"]/g, '').split(',').map((a: string) => a.trim()) || ['developers']
    
    // Create features string
    const featuresText = keyFeatures?.length ? keyFeatures.join(', ') : 'innovative features'
interface Progress {
  /** e.g. 15  */
  day?: number;
  /** new users added today */
  newUsers?: number;
  /** current total users   */
  totalUsers?: number;
  /** USD revenue today     */
  revenueToday?: number;
  /** current MRR in USD    */
  mrr?: number;
  /** follower count growth */
  newFollowers?: number;
}
const progress: Progress = { /* …fill what you have… */ };

function getPrompt(): string {
  const today = new Date().toLocaleDateString('en-US', {year:'numeric',month:'short',day:'numeric'});
  const progressLines = Object.entries(progress)
    .filter(([,v]) => v !== undefined)
    .map(([k,v]) => `- ${k}: ${v}`)
    .join('\n');

  return /* prompt */ `
### System
You are an indie hacker writing from a first-person perspective while \`building in public\`.
Voice & style guidelines (learned from @pedrobuilds, @shirish_arya16, @JoschuaBuilds):
• Energetic, transparent, relatable.  
• Mix concise sentences with occasional hype (“LET’S GOOO”).  
• Use bullet lists ( -  or > ) for tasks/results.  
• Share real numbers (users, revenue, impressions, followers) where available.  
• Sprinkle tasteful emojis ❤🤔🚀 or CAPS for emphasis—but no more than one per tweet.  
• Ask rhetorical questions or behind-the-scenes thoughts (“imagine 3-5 years later?”).  
• Include #BuildInPublic or other relevant hashtags when natural.  
• Vary formats: “Day N logs”, quick insights, tiny wins, thank-yous, reflections.  
• Absolute max 280 characters per tweet.  
• Never copy the example tweets verbatim; always create new, original wording.

### User
Product details:
${JSON.stringify({ 
      xId, 
      customTone, 
      description, 
      keyFeatures, 
      productName, 
      targetAudience, 
      tonePreference 
    }, null, 2)}

${progressLines ? `\nLatest build metrics:\n${progressLines}` : ''}

### Assistant
Task:
1. Draft **${progress.day ? '5' : '3'} punchy tweets** in the style above, fit for posting **today (${today})**.
2. Output each tweet on its own line, prefixed “Tweet #1:”, “Tweet #2:”, ….
3. Make sure every tweet stands alone (no threads) and respects the 280-char limit.
4. Each tweet must reference the product or the journey in a natural way.

Begin.
`.trim();
}

const prompt = getPrompt()

// Example:
console.log(getPrompt());
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      temperature: 0.8,
      max_tokens: 1000,
      top_p: 0.9,
    })

    const generatedContent = response.choices[0]?.message?.content

    if (!generatedContent) {
      return NextResponse.json(
        { error: 'Failed to generate tweets' },
        { status: 500 }
      )
    }

    // Improved parsing logic to handle numbered tweets properly
    const parseTweets = (content: string): string[] => {
      // Split by numbered patterns (1., 2., etc.) but keep the content after
      const lines = content.split('\n')
      const tweets: string[] = []
      let currentTweet = ''
      
      for (const line of lines) {
        const trimmedLine = line.trim()
        
        // Check if line starts with a number followed by period
        const numberMatch = trimmedLine.match(/^(\d+)\.\s*(.*)$/)
        
        if (numberMatch) {
          // If we have a current tweet being built, save it
          if (currentTweet.trim()) {
            tweets.push(currentTweet.trim())
          }
          // Start new tweet with the content after the number
          currentTweet = numberMatch[2]
        } else if (trimmedLine && !trimmedLine.match(/^\d+\.?\s*$/)) {
          // Add to current tweet if it's not just a number
          if (currentTweet) {
            currentTweet += ' ' + trimmedLine
          } else {
            currentTweet = trimmedLine
          }
        }
      }
      
      // Don't forget the last tweet
      if (currentTweet.trim()) {
        tweets.push(currentTweet.trim())
      }
      
      return tweets.slice(0, 5) // Ensure max 5 tweets
    }

    const tweets = parseTweets(generatedContent)

    // Fallback: if parsing didn't work well, try alternative method
    if (tweets.length < 3) {
      const fallbackTweets = generatedContent
        .split(/(?=\d+\.)/g) // Split before numbers
        .map(tweet => tweet.replace(/^\d+\.\s*/, '').trim()) // Remove numbers
        .filter(tweet => tweet.length > 10)
        .slice(0, 5)
      
      const finalTweets = fallbackTweets.length >= 3 ? fallbackTweets : tweets
      
      // Return as simple array format
      return NextResponse.json(finalTweets)
    }

    // Return tweets as simple array
    return NextResponse.json(tweets)

  } catch (error) {
    console.error('Error generating tweets:', error)
    
    // Handle specific Together AI errors
    if (typeof error === 'object' && error !== null && 'status' in error) {
      const status = (error as { status?: number }).status;
      if (status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        )
      }
      if (status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate tweets. Please try again.' },
      { status: 500 }
    )
  }
}

// Optional: Add a GET method for health check
export async function GET() {
  return NextResponse.json({
    status: 'Tweet Writer API is running',
    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
    timestamp: new Date().toISOString(),
  })
}