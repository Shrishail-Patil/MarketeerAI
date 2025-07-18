import { NextRequest, NextResponse } from 'next/server'
import Together from "together-ai"
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth";

const together = new Together({
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Get the session to identify the user
    const session = await getServerSession(authOptions)
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Get user ID from Xusers table using username
    const { data: userData, error: userError } = await supabase
      .from('xusers')
      .select('uid')
      .eq('username', session.user.name)
      .single()

    if (userError || !userData) {
      return NextResponse.json({
        error: 'User not found. Please sign in again.'
      }, { status: 404 })
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

    const prompt = `# Build-in-Public Tweet Generator

You are an indie hacker documenting your journey building **${productName}** on X (Twitter). Your audience is ${audienceList.join(', ')} and you communicate with a ${effectiveTone} tone.

## PRODUCT CONTEXT
- **Product:** ${productName}
- **What it does:** ${description}
- **Key features:** ${featuresText}
- **Target users:** ${audienceList.join(', ')}
${xId ? `- **Your handle:** @${xId}` : ''}

## WRITING DNA (Study These Patterns)

**Tone & Voice:**
- Raw, unfiltered thoughts: "wtf just happened 😭"
- Lowercase casual style: "day 47 of building this thing"
- ALL CAPS for emotional peaks: "HOLY SHIT IT WORKED"
- No corporate speak, no buzzwords, no "we're excited to announce"

**Content Patterns:**
- **Pain-first storytelling:** Start with the struggle, end with the solution
- **Specific fake metrics:** "made $23 today" / "lost 3 users this week" / "conversion went from 2% to 8%"
- **Honest failures:** "couldn't ship today" / "broke everything again"
- **Raw emotions:** Multiple emojis when excited (🚀🚀🚀) or frustrated (😭😭)
- **Community focus:** Ask questions, share insights, be helpful

**Structure Examples:**
- Simple bullets: "today I: - fixed the auth bug - added dark mode - cried a little"
- Problem → insight: "building in public is weird... you celebrate $5 like it's $5k"
- Personal moments: "man, seeing someone actually USE your thing hits different"

## TWEET ARCHETYPES TO FOLLOW

**1. Daily Progress (Casual Check-in)**
- Format: "day X of [activity]" or "quick update:"
- Include 2-3 bullet points of what you did
- Add a realistic metric or outcome
- Keep it conversational, not corporate

**2. Milestone Moment (Pure Excitement)**
- Lead with emotion: "YOOOO" / "wtf" / "can't believe this"
- Share the specific win with context
- Use multiple emojis to show genuine excitement
- Make it feel like telling a friend, not announcing to customers

**3. Honest Struggle (Vulnerable Moment)**
- Start with the frustration or challenge
- Be specific about what's not working
- Show the human side of building
- Often end with determination or a small lesson

**4. Insight/Hot Take (Thought Leadership)**
- Begin with "hot take:" / "unpopular opinion:" / "building X taught me:"
- Share a counterintuitive truth about your space
- Connect it back to your building experience
- Avoid being preachy, stay conversational

**5. Community Building (Genuine Engagement)**
- Ask questions that you actually want answers to
- Share something that helps others
- Start conversations about shared struggles
- Make it about the community, not about you

## CRITICAL RULES

✅ **DO:**
- Sound like a real person having real experiences
- Use specific (fake but realistic) numbers and metrics
- Show genuine emotions through text style and emojis
- Reference ${productName} naturally as part of your story
- Keep each tweet under 280 characters
- Make people curious without being salesy

❌ **DON'T:**
- Include links, CTAs, or "check out my product"
- Use corporate language or marketing speak
- Make it about promoting, make it about documenting
- Sound polished or professional
- Use hashtags or @mentions unnecessarily

## OUTPUT FORMAT
Generate 5 tweets. Return ONLY the tweet content, one per line, numbered like this:

1. [clean tweet content here]
2. [clean tweet content here]
3. [clean tweet content here]
4. [clean tweet content here]
5. [clean tweet content here]

NO markdown formatting, NO category labels, NO asterisks - just clean tweet text.

Remember: You're not selling ${productName}, you're sharing the real experience of building it. Make people care about your journey first, the product second.`

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

    // Improved parsing logic to extract clean tweets
    const parseTweets = (content: string): string[] => {
      const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0)
      const tweets: string[] = []
      
      for (const line of lines) {
        // Match lines that start with number followed by period
        const match = line.match(/^\d+\.\s*(.+)$/)
        if (match) {
          let tweet = match[1].trim()
          
          // Clean up any remaining markdown formatting
          tweet = tweet
            .replace(/\*\*\[.*?\]\*\*/g, '') // Remove **[Category]** patterns
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
            .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
            .replace(/^\[.*?\]\s*/, '')      // Remove [Category] at start
            .trim()
          
          if (tweet.length > 10) { // Only add substantial tweets
            tweets.push(tweet)
          }
        }
      }
      
      return tweets.slice(0, 5) // Ensure max 5 tweets
    }

    const tweets = parseTweets(generatedContent)

    // Fallback: if parsing didn't work well, try alternative method
    if (tweets.length < 3) {
      const fallbackTweets = generatedContent
        .split(/\n/)
        .map(line => {
          // Try to extract content after numbers and clean formatting
          let cleaned = line.replace(/^\d+\.\s*/, '').trim()
          cleaned = cleaned
            .replace(/\*\*\[.*?\]\*\*/g, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/^\[.*?\]\s*/, '')
            .trim()
          return cleaned
        })
        .filter(tweet => tweet.length > 10)
        .slice(0, 5)
      
      const finalTweets = fallbackTweets.length >= 3 ? fallbackTweets : tweets
      
      // Store tweets in Supabase
      const tweetsToStore = finalTweets.map(tweet => ({
        user_id: userData.uid,
        content: tweet,
        category: 'generated',
        tweet_id: null,
        created_at: new Date().toISOString(),
        product_name: productName
      }))

      const { data: storedTweets, error: storeError } = await supabase
        .from('user_tweets')
        .insert(tweetsToStore)
        .select()

      if (storeError) {
        console.error('Error storing tweets:', storeError)
        return NextResponse.json(
          { error: 'Failed to store tweets' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        tweets: finalTweets,
        stored: storedTweets
      })
    }

    // Store tweets in Supabase
    const tweetsToStore = tweets.map(tweet => ({
      user_id: userData.uid,
      content: tweet,
      category: 'generated',
      tweet_id: null,
      created_at: new Date().toISOString(),
      product_name: productName
    }))

    const { data: storedTweets, error: storeError } = await supabase
      .from('user_tweets')
      .insert(tweetsToStore)
      .select()

    if (storeError) {
      console.error('Error storing tweets:', storeError)
      return NextResponse.json(
        { error: 'Failed to store tweets' },
        { status: 500 }
      )
    }

    // Return tweets with storage confirmation
    return NextResponse.json({
      tweets: tweets,
      stored: storedTweets
    })

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