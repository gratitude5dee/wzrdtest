import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft } from "lucide-react";
import { MainMenu } from "./settings/MainMenu";
import { ProfileSection } from "./settings/ProfileSection";
import { ConnectedAccounts } from "./settings/ConnectedAccounts";
import { DataManagement } from "./settings/DataManagement";
import { PreferencesSection } from "./settings/PreferencesSection";
import { useProfileManager } from "./settings/ProfileManager";
import { useToast } from "@/hooks/use-toast";

export function Settings({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [view, setView] = useState<'main' | 'profile' | 'preferences'>('main');
  const { toast } = useToast();
  const {
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
  } = useProfileManager();

  useEffect(() => {
    if (open) {
      loadUserProfile();
      setView('main');
    }
  }, [open, loadUserProfile]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
    onOpenChange(false);
  };

  const handleClearLocalData = () => {
    localStorage.clear();
    toast({
      title: "Success",
      description: "Local data cleared successfully",
    });
  };

  const handleSave = async () => {
    const success = await saveProfile();
    if (success) {
      toast({
        title: "Success",
        description: "Changes saved successfully",
      });
      setView('main');
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'profile':
        return (
          <div className="h-full flex flex-col bg-white">
            <div className="flex items-center p-6 border-b border-gray-100">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 rounded-full"
                onClick={() => setView('main')}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h2 className="text-2xl font-medium">Profile</h2>
            </div>

            <div className="flex-1 overflow-auto">
              <div className="p-6 space-y-6">
                <ProfileSection
                  firstName={firstName}
                  lastName={lastName}
                  onFirstNameChange={setFirstName}
                  onLastNameChange={setLastName}
                />
                <ConnectedAccounts email={email} />
                <DataManagement onClearData={handleClearLocalData} />
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              <Button 
                className="w-full h-12 rounded-full text-base font-medium bg-gray-500 hover:bg-gray-600 text-white"
                onClick={handleSave}
              >
                Save changes
              </Button>
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div className="h-full flex flex-col bg-white">
            <div className="flex items-center p-6 border-b border-gray-100">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 rounded-full"
                onClick={() => setView('main')}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h2 className="text-2xl font-medium">Preferences</h2>
            </div>

            <div className="flex-1 overflow-auto">
              <div className="p-6">
                <PreferencesSection
                  backgroundColor={backgroundColor}
                  textColor={textColor}
                  appFontFamily={appFontFamily}
                  onBackgroundColorChange={setBackgroundColor}
                  onTextColorChange={setTextColor}
                  onAppFontFamilyChange={setAppFontFamily}
                />
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              <Button 
                className="w-full h-12 rounded-full text-base font-medium bg-gray-500 hover:bg-gray-600 text-white"
                onClick={handleSave}
              >
                Save changes
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <MainMenu
            firstName={firstName}
            lastName={lastName}
            email={email}
            onProfileClick={() => setView('profile')}
            onPreferencesClick={() => setView('preferences')}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}