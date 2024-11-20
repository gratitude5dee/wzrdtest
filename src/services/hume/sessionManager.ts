import { supabase } from "@/integrations/supabase/client";

export class SessionManager {
  private currentSessionId: string | null = null;

  async createVoiceSession(personality: string) {
    const { data: session, error } = await supabase
      .from('voice_sessions')
      .insert({
        personality,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    this.currentSessionId = session.id;
    return session;
  }

  async storeEmotionalResponse(
    emotions: Array<{ name: string; score: number }>,
    transcript: string,
    isUser: boolean
  ) {
    if (!this.currentSessionId) return;

    const { error } = await supabase
      .from('emotional_responses')
      .insert(
        emotions.map(emotion => ({
          session_id: this.currentSessionId,
          emotion_name: emotion.name,
          emotion_score: emotion.score,
          transcript,
          is_user_message: isUser
        }))
      );

    if (error) console.error('Failed to store emotional response:', error);
  }

  async completeSession() {
    if (!this.currentSessionId) return;

    const { error } = await supabase
      .from('voice_sessions')
      .update({
        status: 'completed',
        end_time: new Date().toISOString(),
      })
      .eq('id', this.currentSessionId);

    if (error) console.error('Failed to update session status:', error);
    this.currentSessionId = null;
  }
}