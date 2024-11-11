import { Button } from "@/components/ui/button";
import { User, Settings2, FileText, Shield, HelpCircle, LogOut } from "lucide-react";

interface MainMenuProps {
  firstName: string;
  lastName: string;
  email: string;
  onProfileClick: () => void;
  onPreferencesClick: () => void;
  onLogout: () => void;
}

export function MainMenu({ 
  firstName, 
  lastName, 
  email, 
  onProfileClick,
  onPreferencesClick,
  onLogout 
}: MainMenuProps) {
  return (
    <div className="flex flex-col min-h-[600px]">
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 bg-[#FFE5E5] rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-medium">User</h2>
          <p className="text-sm text-gray-500">{email}</p>
        </div>

        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-between text-base font-normal hover:bg-gray-100 rounded-lg h-12" 
            onClick={onProfileClick}
          >
            <div className="flex items-center">
              <User className="mr-3 h-5 w-5" />
              Profile
            </div>
            <div>→</div>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-between text-base font-normal hover:bg-gray-100 rounded-lg h-12"
            onClick={onPreferencesClick}
          >
            <div className="flex items-center">
              <Settings2 className="mr-3 h-5 w-5" />
              Preferences
            </div>
            <div>→</div>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-between text-base font-normal hover:bg-gray-100 rounded-lg h-12"
          >
            <div className="flex items-center">
              <FileText className="mr-3 h-5 w-5" />
              Terms of Use
            </div>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-between text-base font-normal hover:bg-gray-100 rounded-lg h-12"
          >
            <div className="flex items-center">
              <Shield className="mr-3 h-5 w-5" />
              Privacy Policy
            </div>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-between text-base font-normal hover:bg-gray-100 rounded-lg h-12"
          >
            <div className="flex items-center">
              <HelpCircle className="mr-3 h-5 w-5" />
              Support
            </div>
          </Button>
        </div>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="text-xs text-gray-500 text-center">
          Version 0.2.7 (497)
          <br />
          © 2024 wzrd.tech
        </div>
        <Button 
          variant="ghost"
          className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}