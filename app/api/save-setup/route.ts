// app/api/save-setup/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // Get the session to identify the user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      productName,
      description,
      targetAudience,
      keyFeatures,
      tonePreference,
      customTone,
      xId
    } = await req.json();

    // Validate required fields
    if (!productName || !description || !targetAudience || !tonePreference) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Get user ID from Xusers table using username
    const { data: userData, error: userError } = await supabase
      .from('xusers')
      .select('uid')
      .eq('username', session.user.name)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ 
        error: 'User not found. Please sign in again.' 
      }, { status: 404 });
    }

    // Save or update setup data
    const { data, error } = await supabase
      .from('user_data')
      .upsert({
        user_id: userData.uid,
        product_name: productName,
        description: description,
        target_audience: targetAudience,
        key_features: keyFeatures || [],
        tone_preference: tonePreference,
        custom_tone: customTone || null,
        x_id: xId || null,
        updated_at: new Date().toISOString(),
        json_data: {
          productName,
          description,
          targetAudience,
          keyFeatures,
          tonePreference,
          customTone,
          xId
        }
      }, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      console.error('[SAVE-SETUP ERROR]', error);
      return NextResponse.json({ 
        error: 'Failed to save setup data' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: data?.[0] 
    });

  } catch (err) {
    console.error('[SAVE-SETUP ERROR]', err);
    return NextResponse.json({ 
      error: 'Server error' 
    }, { status: 500 });
  }
}

// Optional: GET route to retrieve setup data
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user setup data
    const { data, error } = await supabase
      .from('user_data')
      .select(`
        *,
        xusers!user_data_user_id_fkey (
          username,
          image
        )
      `)
      .eq('xusers.username', session.user.name)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('[GET-SETUP ERROR]', error);
      return NextResponse.json({ 
        error: 'Failed to fetch setup data' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: data || null 
    });

  } catch (err) {
    console.error('[GET-SETUP ERROR]', err);
    return NextResponse.json({ 
      error: 'Server error' 
    }, { status: 500 });
  }
}