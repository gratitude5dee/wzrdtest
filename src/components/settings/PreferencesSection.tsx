import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Palette, Type, Monitor } from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";

export function PreferencesSection() {
  const { preferences, updatePreferences, loading } = useUserPreferences();
  const { theme, setTheme } = useTheme();

  const handleSave = async () => {
    const success = await updatePreferences(preferences);
    if (success) {
      toast.success("Preferences saved successfully", {
        style: {
          background: theme === 'dark' ? "#1a1625" : "#FFF8F6",
          border: "1px solid #E2E8F0",
          color: theme === 'dark' ? "#fff" : "#1F2937",
        },
      });
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
            variant="outline"
            className={`h-16 rounded-lg border transition-all duration-200 ${
              theme === 'light' 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
            onClick={() => setTheme('light')}
          >
            <div className="space-y-1.5">
              <div className="w-5 h-5 rounded-full bg-white border border-gray-200 mx-auto" />
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Light</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className={`h-16 rounded-lg border transition-all duration-200 ${
              theme === 'dark' 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
            onClick={() => setTheme('dark')}
          >
            <div className="space-y-1.5">
              <div className="w-5 h-5 rounded-full bg-gray-900 mx-auto" />
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Dark</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Colors Section */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Colors</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customize your color preferences.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Text Color
            </Label>
            <div className="flex gap-2 items-center">
              <div 
                className="w-8 h-8 rounded-md border border-gray-200 shadow-sm dark:border-gray-700"
                style={{ backgroundColor: preferences.textColor }}
              />
              <input
                type="color"
                value={preferences.textColor}
                onChange={(e) => updatePreferences({ textColor: e.target.value })}
                className="h-8 flex-1 rounded-md border border-gray-200 cursor-pointer dark:border-gray-700"
              />
            </div>
          </div>
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
          className="w-full bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </motion.div>
  );
}