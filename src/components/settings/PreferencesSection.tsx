import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Palette, Type, Monitor } from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { toast } from 'sonner';

export function PreferencesSection() {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleSave = async () => {
    try {
      await updatePreferences({
        textColor: preferences.textColor,
        fontFamily: preferences.fontFamily,
      });
      toast.success('Preferences updated successfully', {
        className: 'bg-wzrd-pink border-none',
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to update preferences', {
        className: 'bg-wzrd-pink border-none',
      });
    }
  };

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
            <h3 className="text-sm font-medium text-gray-900">Theme</h3>
          </div>
          <p className="text-sm text-gray-500">Choose your preferred theme settings.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-16 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            <div className="space-y-1.5">
              <div className="w-5 h-5 rounded-full bg-white border border-gray-200 mx-auto" />
              <div className="text-xs font-medium text-gray-700">Light</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-16 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            <div className="space-y-1.5">
              <div className="w-5 h-5 rounded-full bg-gray-900 mx-auto" />
              <div className="text-xs font-medium text-gray-700">Dark</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Colors Section */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Colors</h3>
          </div>
          <p className="text-sm text-gray-500">Customize your color preferences.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700">
              Text Color
            </Label>
            <div className="flex gap-2 items-center">
              <div 
                className="w-8 h-8 rounded-md border border-gray-200 shadow-sm"
                style={{ backgroundColor: preferences.textColor }}
              />
              <input
                type="color"
                value={preferences.textColor}
                onChange={(e) => updatePreferences({ textColor: e.target.value })}
                className="h-8 flex-1 rounded-md border border-gray-200 cursor-pointer"
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
            <h3 className="text-sm font-medium text-gray-900">Typography</h3>
          </div>
          <p className="text-sm text-gray-500">Choose your preferred font settings.</p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-700">
            Font Family
          </Label>
          <Select 
            value={preferences.fontFamily} 
            onValueChange={(value) => updatePreferences({ fontFamily: value })}
          >
            <SelectTrigger className="h-9 text-sm rounded-md border-gray-200">
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
          className="w-full"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </motion.div>
  );
}