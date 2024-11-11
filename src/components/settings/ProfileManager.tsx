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

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, user_preferences(*)')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        throw new Error("Failed to load profile");
      }

      if (!profile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id,
            email: user.email,
            first_name: "",
            last_name: ""
          }]);

        if (insertError) {
          throw new Error("Failed to create profile");
        }
        
        setEmail(user.email || "");
        return;
      }

      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setEmail(profile.email || "");
      
      if (profile.user_preferences) {
        setBackgroundColor(profile.user_preferences.background_color || "#FFF8F6");
        setTextColor(profile.user_preferences.text_color || "#000000");
        setAppFontFamily(profile.user_preferences.app_font_family || "inter");
      }
    } catch (error) {
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

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
        });

      if (updateProfileError) {
        throw new Error("Failed to update profile");
      }

      const { error: updatePreferencesError } = await supabase
        .from('user_preferences')
        .upsert({
          id: user.id,
          background_color: backgroundColor,
          text_color: textColor,
          app_font_family: appFontFamily,
        });

      if (updatePreferencesError) {
        throw new Error("Failed to update preferences");
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
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