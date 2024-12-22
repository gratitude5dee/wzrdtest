import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Process completed sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('voice_sessions')
      .select(`
        id,
        start_time,
        end_time,
        emotional_responses (
          emotion_name,
          emotion_score,
          is_user_message
        )
      `)
      .eq('status', 'completed')
      .is('duration_seconds', null)

    if (sessionsError) {
      throw sessionsError
    }

    // Calculate and update session durations and analytics
    for (const session of sessions) {
      if (session.start_time && session.end_time) {
        const duration = Math.floor(
          (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 1000
        )

        const { error: updateError } = await supabase
          .from('voice_sessions')
          .update({ duration_seconds: duration })
          .eq('id', session.id)

        if (updateError) {
          console.error(`Failed to update session ${session.id}:`, updateError)
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Analytics processed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing analytics:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})