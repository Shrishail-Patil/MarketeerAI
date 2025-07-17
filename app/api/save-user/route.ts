import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { username, image } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Missing username' }, { status: 400 });
    }

    // Use username as the unique identifier
    const { data, error } = await supabase
      .from('xusers')
      .upsert({ 
        username, 
        image: image || "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'username' 
      })
      .select()
      .single();

    if (error) {
      console.error('[SUPABASE ERROR]', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: data, // data.id is guaranteed here
    });
  } catch (err) {
    console.error('[SAVE-USER ERROR]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}