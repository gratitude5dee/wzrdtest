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
import { useNavigate } from "react-router-dom";

export function Settings({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [view, setView] = useState<'main' | 'profile' | 'preferences'>('main');
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    firstName,
    lastName,
    email,
    setFirstName,
    setLastName,
    loadUserProfile,
    saveProfile
  } = useProfileManager();

  useEffect(() => {
    if (open) {
      loadUserProfile();
    }
  }, [open, loadUserProfile]);

  useEffect(() => {
    if (!open) {
      setView('main');
    }
  }, [open]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onOpenChange(false);
      navigate('/login', { replace: true });
      
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
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
          <div className="h-[600px] flex flex-col bg-white">
            <div className="flex items-center p-4 border-b">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 rounded-full hover:bg-gray-100"
                onClick={() => setView('main')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-medium text-gray-900">Profile</h2>
            </div>

            <div className="flex-1 overflow-auto">
              <div className="p-4 space-y-8">
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

            <div className="p-4 border-t">
              <Button 
                className="w-full h-10 rounded-lg text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white"
                onClick={handleSave}
              >
                Save changes
              </Button>
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div className="h-full flex flex-col">
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
                <PreferencesSection />
              </div>
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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
