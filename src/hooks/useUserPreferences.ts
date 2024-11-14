import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type UserPreferences = {
  fontSize: number;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
};

const DEFAULT_PREFERENCES = {
  fontSize: 44,
  fontFamily: 'inter',
  textColor: '#1F2937',
  backgroundColor: '#FFF8F6'
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: existingPrefs, error: fetchError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching preferences:', fetchError);
        return;
      }

      if (existingPrefs) {
        setPreferences({
          fontSize: existingPrefs.font_size,
          fontFamily: existingPrefs.font_family,
          textColor: existingPrefs.text_color,
          backgroundColor: existingPrefs.background_color
        });
      }
    } catch (error) {
      console.error('Error in loadPreferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to save preferences");
        return false;
      }

      const updates = {
        id: user.id,
        font_size: newPreferences.fontSize ?? preferences.fontSize,
        font_family: newPreferences.fontFamily ?? preferences.fontFamily,
        text_color: newPreferences.textColor ?? preferences.textColor,
        background_color: newPreferences.backgroundColor ?? preferences.backgroundColor,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_preferences')
        .upsert(updates);

      if (error) {
        console.error('Error updating preferences:', error);
        return false;
      }

      setPreferences(prev => ({ ...prev, ...newPreferences }));
      return true;
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      return false;
    }
  };

  return {
    preferences,
    loading,
    updatePreferences
  };
};