import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft } from "lucide-react";
import { MainMenu } from "./settings/MainMenu";
import { ProfileSection } from "./settings/ProfileSection";
import { ConnectedAccounts } from "./settings/ConnectedAccounts";
import { DataManagement } from "./settings/DataManagement";
import { useProfileManager } from "./settings/ProfileManager";
import { useToast } from "@/hooks/use-toast";

export function Settings({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [view, setView] = useState<'main' | 'profile'>('main');
  const { toast } = useToast();
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
      setView('main');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-slate-900 rounded-3xl">
        {view === 'main' ? (
          <MainMenu
            firstName={firstName}
            lastName={lastName}
            email={email}
            onProfileClick={() => setView('profile')}
            onLogout={handleLogout}
          />
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex items-center p-6 border-b border-gray-100 dark:border-slate-800">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2"
                onClick={() => setView('main')}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h2 className="text-2xl font-display">Profile</h2>
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

            <div className="p-6 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
              <Button 
                className="w-full h-14 rounded-full text-lg font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                onClick={handleSave}
              >
                Save changes
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}