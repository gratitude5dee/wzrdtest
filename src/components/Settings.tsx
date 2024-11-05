import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft } from "lucide-react";
import { MainMenu } from "./settings/MainMenu";
import { ProfileSection } from "./settings/ProfileSection";
import { ConnectedAccounts } from "./settings/ConnectedAccounts";
import { DataManagement } from "./settings/DataManagement";

export function Settings({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [view, setView] = useState<'main' | 'profile'>('main');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          onOpenChange(false);
          toast({
            title: "Authentication Error",
            description: "You must be logged in to access settings",
            variant: "destructive",
          });
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([{ 
                id: user.id,
                email: user.email
              }]);

            if (insertError) {
              toast({
                title: "Error",
                description: "Failed to create profile",
                variant: "destructive",
              });
            }
            setEmail(user.email || "");
          } else {
            toast({
              title: "Error",
              description: "Failed to load profile",
              variant: "destructive",
            });
          }
          return;
        }

        if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
          setEmail(profile.email || "");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      }
    };

    if (open) {
      loadUserProfile();
      setView('main');
    }
  }, [open, onOpenChange, toast]);

  const handleSave = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to update your profile",
          variant: "destructive",
        });
        onOpenChange(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
        });

      if (updateError) {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setView('main');
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
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
            <div className="flex items-center p-4 border-b">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2"
                onClick={() => setView('main')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold">Profile</h2>
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

            <div className="p-6 border-t bg-white">
              <Button 
                className="w-full rounded-2xl"
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
