import { Button } from "@/components/ui/button";
import { User, Cog, FileText, Shield, HelpCircle, LogOut } from "lucide-react";

interface MainMenuProps {
  firstName: string;
  lastName: string;
  email: string;
  onProfileClick: () => void;
  onLogout: () => void;
}

export function MainMenu({ firstName, lastName, email, onProfileClick, onLogout }: MainMenuProps) {
  return (
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
            className="w-full justify-start text-lg font-normal hover:bg-gray-100" 
            onClick={onProfileClick}
          >
            <User className="mr-3 h-5 w-5" />
            Profile
            <div className="ml-auto">→</div>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-lg font-normal hover:bg-gray-100">
            <Cog className="mr-3 h-5 w-5" />
            Preferences
            <div className="ml-auto">→</div>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-lg font-normal hover:bg-gray-100">
            <FileText className="mr-3 h-5 w-5" />
            Terms of Use
          </Button>
          <Button variant="ghost" className="w-full justify-start text-lg font-normal hover:bg-gray-100">
            <Shield className="mr-3 h-5 w-5" />
            Privacy Policy
          </Button>
          <Button variant="ghost" className="w-full justify-start text-lg font-normal hover:bg-gray-100">
            <HelpCircle className="mr-3 h-5 w-5" />
            Support
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
          variant="destructive" 
          className="w-full"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}