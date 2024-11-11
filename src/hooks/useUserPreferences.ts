import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { UserPreferencesTable } from '@/integrations/supabase/types/tables';

export type UserPreferences = {
  fontSize: number;
  fontFamily: string;
  textColor: string;
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: 44,
    fontFamily: 'inter',
    textColor: '#F8FAFC'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          fontSize: data.font_size || 44,
          fontFamily: data.font_family || 'inter',
          textColor: data.text_color || '#F8FAFC'
        });
      } else {
        // Create default preferences
        await supabase.from('user_preferences').insert({
          id: user.id,
          font_size: preferences.fontSize,
          font_family: preferences.fontFamily,
          text_color: preferences.textColor
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_preferences')
        .update({
          font_size: newPreferences.fontSize,
          font_family: newPreferences.fontFamily,
          text_color: newPreferences.textColor,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setPreferences(prev => ({ ...prev, ...newPreferences }));
      toast.success('Preferences updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  return {
    preferences,
    loading,
    updatePreferences
  };
};