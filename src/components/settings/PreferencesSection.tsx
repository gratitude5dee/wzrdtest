import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Palette, Type, Monitor } from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export function PreferencesSection() {
  const { preferences, updatePreferences, loading } = useUserPreferences();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleSave = async () => {
    try {
      const success = await updatePreferences({
        ...preferences,
        textColor: theme === 'dark' ? '#F8FAFC' : '#1F2937',
        backgroundColor: theme === 'dark' ? '#0F172A' : '#FFF8F6'
      });
      
      if (success) {
        toast.success("Preferences saved successfully");
      }
    } catch (error) {
      toast.error("Failed to save preferences");
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading preferences...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Theme Section */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <Monitor className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Theme</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme settings.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={theme === 'light' ? "default" : "outline"}
            className={`h-16 rounded-lg transition-all duration-200 ${
              theme === 'light' 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setTheme('light')}
          >
            <div className="space-y-1.5">
              <div className="w-5 h-5 rounded-full bg-white border border-gray-200 mx-auto" />
              <div className="text-xs font-medium">Light</div>
            </div>
          </Button>
          <Button
            variant={theme === 'dark' ? "default" : "outline"}
            className={`h-16 rounded-lg transition-all duration-200 ${
              theme === 'dark'
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setTheme('dark')}
          >
            <div className="space-y-1.5">
              <div className="w-5 h-5 rounded-full bg-gray-900 mx-auto" />
              <div className="text-xs font-medium">Dark</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Typography Section */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <Type className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Typography</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred font settings.</p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Font Family
          </Label>
          <Select 
            value={preferences.fontFamily}
            onValueChange={(value) => updatePreferences({ fontFamily: value })}
          >
            <SelectTrigger className="h-9 text-sm rounded-md border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter" className="text-sm">Inter</SelectItem>
              <SelectItem value="cal-sans" className="text-sm">Cal Sans</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          className="w-full bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </motion.div>
  );
}