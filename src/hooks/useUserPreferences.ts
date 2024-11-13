import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const { data: existingPrefs, error: fetchError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!existingPrefs) {
        // Create default preferences
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert([{
            id: user.id,
            font_size: preferences.fontSize,
            font_family: preferences.fontFamily,
            text_color: preferences.textColor,
          }]);

        if (insertError) {
          console.error('Error creating preferences:', insertError);
          throw new Error('Failed to create initial preferences');
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
      toast.error('Failed to load preferences', {
        style: {
          background: "#FFF8F6",
          border: "1px solid #E2E8F0",
          color: "#1F2937",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const updates = {
        font_size: newPreferences.fontSize ?? preferences.fontSize,
        font_family: newPreferences.fontFamily ?? preferences.fontFamily,
        text_color: newPreferences.textColor ?? preferences.textColor,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          id: user.id,
          ...updates
        });

      if (error) {
        console.error('Error updating preferences:', error);
        throw error;
      }

      setPreferences(prev => ({ ...prev, ...newPreferences }));
      return true;
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      throw error;
    }
  };

  return {
    preferences,
    loading,
    updatePreferences
  };
};