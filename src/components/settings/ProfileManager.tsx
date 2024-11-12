import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useProfileManager() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FFF8F6");
  const [textColor, setTextColor] = useState("#000000");
  const [appFontFamily, setAppFontFamily] = useState("inter");
  const { toast } = useToast();

  const loadUserProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("Authentication error");
      }

      // First ensure profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw new Error("Failed to load profile");
      }

      if (!profile) {
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
          });

        if (createProfileError) {
          throw new Error("Failed to create profile");
        }
      }

      // Then load preferences
      const { data: preferences, error: preferencesError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('id', user.id)
        .single();

      if (preferencesError && preferencesError.code !== 'PGRST116') {
        throw new Error("Failed to load preferences");
      }

      // Set profile data
      if (profile) {
        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
        setEmail(profile.email || "");
      }

      // Set preferences or create default ones
      if (preferences) {
        setBackgroundColor(preferences.background_color || "#FFF8F6");
        setTextColor(preferences.text_color || "#000000");
        setAppFontFamily(preferences.app_font_family || "inter");
      } else {
        // Create default preferences
        const { error: createPreferencesError } = await supabase
          .from('user_preferences')
          .insert({
            id: user.id,
            background_color: backgroundColor,
            text_color: textColor,
            app_font_family: appFontFamily,
          });

        if (createPreferencesError) {
          console.error("Failed to create default preferences:", createPreferencesError);
          throw new Error("Failed to create preferences");
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const saveProfile = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("Authentication error");
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
        });

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw new Error("Failed to update profile");
      }

      // Check if preferences exist first
      const { data: existingPreferences } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('id', user.id)
        .single();

      // If preferences don't exist, create them
      if (!existingPreferences) {
        const { error: createError } = await supabase
          .from('user_preferences')
          .insert({
            id: user.id,
            background_color: backgroundColor,
            text_color: textColor,
            app_font_family: appFontFamily,
          });

        if (createError) {
          console.error("Preferences creation error:", createError);
          throw new Error("Failed to create preferences");
        }
      } else {
        // Update existing preferences
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update({
            background_color: backgroundColor,
            text_color: textColor,
            app_font_family: appFontFamily,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          console.error("Preferences update error:", updateError);
          throw new Error("Failed to update preferences");
        }
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update preferences",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    firstName,
    lastName,
    email,
    backgroundColor,
    textColor,
    appFontFamily,
    setFirstName,
    setLastName,
    setBackgroundColor,
    setTextColor,
    setAppFontFamily,
    loadUserProfile,
    saveProfile
  };
}