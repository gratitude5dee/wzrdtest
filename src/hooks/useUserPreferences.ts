import { useState, useEffect } from 'react';
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
      if (!user) {
        throw new Error('No user found');
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
          .insert({
            id: user.id,
            font_size: preferences.fontSize,
            font_family: preferences.fontFamily,
            text_color: preferences.textColor,
          });

        if (insertError) {
          throw insertError;
        }
      } else {
        setPreferences({
          fontSize: existingPrefs.font_size || 44,
          fontFamily: existingPrefs.font_family || 'inter',
          textColor: existingPrefs.text_color || '#F8FAFC'
        });
      }
    } catch (error) {
      console.error('Error in loadPreferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No user found');
      }

      const updates: Partial<UserPreferencesTable['Update']> = {};

      if (newPreferences.fontSize !== undefined) {
        updates.font_size = newPreferences.fontSize;
      }
      if (newPreferences.fontFamily !== undefined) {
        updates.font_family = newPreferences.fontFamily;
      }
      if (newPreferences.textColor !== undefined) {
        updates.text_color = newPreferences.textColor;
      }

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) {
        throw error;
      }

      setPreferences(prev => ({ ...prev, ...newPreferences }));
      toast.success('Preferences updated successfully');
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      toast.error('Failed to update preferences');
      throw error;
    }
  };

  return {
    preferences,
    loading,
    updatePreferences
  };
};