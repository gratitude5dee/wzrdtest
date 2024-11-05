import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Settings as SettingsIcon, User, Cog, FileText, Shield, HelpCircle, LogOut, Apple } from "lucide-react";

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
      <DialogContent className="sm:max-w-[400px] p-0">
        {view === 'main' ? (
          <div className="flex flex-col h-full">
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold">{firstName || 'User'} {lastName}</h2>
                <p className="text-sm text-gray-500">{email}</p>
              </div>

              <div className="space-y-4">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-lg font-normal" 
                  onClick={() => setView('profile')}
                >
                  <User className="mr-3 h-5 w-5" />
                  Profile
                  <ChevronLeft className="ml-auto h-5 w-5 rotate-180" />
                </Button>
                <Button variant="ghost" className="w-full justify-start text-lg font-normal">
                  <Cog className="mr-3 h-5 w-5" />
                  Preferences
                  <ChevronLeft className="ml-auto h-5 w-5 rotate-180" />
                </Button>
                <Button variant="ghost" className="w-full justify-start text-lg font-normal">
                  <FileText className="mr-3 h-5 w-5" />
                  Terms of Use
                </Button>
                <Button variant="ghost" className="w-full justify-start text-lg font-normal">
                  <Shield className="mr-3 h-5 w-5" />
                  Privacy Policy
                </Button>
                <Button variant="ghost" className="w-full justify-start text-lg font-normal">
                  <HelpCircle className="mr-3 h-5 w-5" />
                  Support
                </Button>
              </div>
            </div>

            <div className="mt-auto p-6 space-y-4">
              <div className="text-xs text-gray-500 text-center">
                Version 0.2.7 (497)
                <br />
                © 2024 Hume AI, Inc.
              </div>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full">
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

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal details</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="rounded-2xl"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Connect accounts</h3>
                <p className="text-sm text-gray-500">You can use these accounts to log in.</p>
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center">
                  <Apple className="h-6 w-6 mr-3" />
                  <div>
                    <div>Apple</div>
                    <div className="text-sm text-gray-500">{email}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Clear local data</h3>
                <p className="text-sm text-gray-500">
                  Clear all local data stored on your device. This will affect your app theme.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full rounded-2xl"
                  onClick={handleClearLocalData}
                >
                  Clear local data
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-red-50 rounded-2xl space-y-2">
                  <h3 className="text-lg font-semibold text-red-600">Delete account</h3>
                  <p className="text-sm text-gray-600">
                    Make a request to permanently delete your Hume AI account and account data. 
                    Requests take up to 30 business days to fulfill.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
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