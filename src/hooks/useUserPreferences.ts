import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type UserPreferences = {
  fontSize: number;
  fontFamily: string;
  textColor: string;
};

const DEFAULT_PREFERENCES = {
  fontSize: 44,
  fontFamily: 'inter',
  textColor: '#F8FAFC'
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

      if (!existingPrefs) {
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert({
            id: user.id,
            font_size: DEFAULT_PREFERENCES.fontSize,
            font_family: DEFAULT_PREFERENCES.fontFamily,
            text_color: DEFAULT_PREFERENCES.textColor,
          });

        if (insertError) {
          console.error('Error creating preferences:', insertError);
          return;
        }
      } else {
        setPreferences({
          fontSize: existingPrefs.font_size,
          fontFamily: existingPrefs.font_family,
          textColor: existingPrefs.text_color
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
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_preferences')
        .upsert(updates);

      if (error) {
        console.error('Error updating preferences:', error);
        toast.error("Failed to save preferences");
        return false;
      }

      setPreferences(prev => ({ ...prev, ...newPreferences }));
      return true;
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      toast.error("Failed to save preferences");
      return false;
    }
  };

  return {
    preferences,
    loading,
    updatePreferences
  };
};