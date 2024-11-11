import { Button } from "@/components/ui/button";
import { User, Settings2, FileText, Shield, HelpCircle, LogOut } from "lucide-react";
import { motion } from "framer-motion";

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
  const menuItems = [
    { icon: User, label: "Profile", onClick: onProfileClick },
    { icon: Settings2, label: "Preferences", onClick: onPreferencesClick },
    { icon: FileText, label: "Terms of Use" },
    { icon: Shield, label: "Privacy Policy" },
    { icon: HelpCircle, label: "Support" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col min-h-[600px] p-6"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center text-center space-y-4 mb-8"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center shadow-inner">
          <User className="w-12 h-12 text-gray-600" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900">
            {firstName ? `${firstName} ${lastName}` : 'Welcome'}
          </h2>
          <p className="text-gray-500">{email}</p>
        </div>
      </motion.div>

      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Button 
              variant="ghost" 
              className="w-full justify-between text-base font-normal hover:bg-gray-50 rounded-xl h-14 group"
              onClick={item.onClick}
            >
              <div className="flex items-center">
                <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                {item.label}
              </div>
              <div className="text-gray-400 group-hover:text-gray-600 transition-colors">→</div>
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto space-y-6">
        <div className="text-xs text-gray-400 text-center">
          Version 0.2.7 (497)
          <br />
          © 2024 wzrd.tech
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            variant="ghost"
            className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-12 transition-colors"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}