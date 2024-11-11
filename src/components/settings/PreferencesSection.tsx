import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Palette, Type, Monitor } from "lucide-react";

interface PreferencesSectionProps {
  backgroundColor: string;
  textColor: string;
  appFontFamily: string;
  onBackgroundColorChange: (value: string) => void;
  onTextColorChange: (value: string) => void;
  onAppFontFamilyChange: (value: string) => void;
}

export function PreferencesSection({
  backgroundColor,
  textColor,
  appFontFamily,
  onBackgroundColorChange,
  onTextColorChange,
  onAppFontFamilyChange,
}: PreferencesSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-12"
    >
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-3">
          <Monitor className="h-6 w-6 text-gray-400" />
          <h3 className="text-2xl font-semibold text-gray-900">Theme</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-24 rounded-2xl border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 mx-auto" />
              <div className="text-sm font-medium">Light</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-24 rounded-2xl border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-gray-900 mx-auto" />
              <div className="text-sm font-medium">Dark</div>
            </div>
          </Button>
        </div>
      </motion.div>

      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-3">
          <Palette className="h-6 w-6 text-gray-400" />
          <h3 className="text-2xl font-semibold text-gray-900">Colors</h3>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium text-gray-700">
              Page Color
            </Label>
            <div className="flex gap-4 items-center">
              <div 
                className="w-14 h-14 rounded-2xl border-2 border-gray-200 shadow-sm"
                style={{ backgroundColor }}
              />
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="h-14 w-full rounded-2xl border-2 border-gray-200 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium text-gray-700">
              Text Color
            </Label>
            <div className="flex gap-4 items-center">
              <div 
                className="w-14 h-14 rounded-2xl border-2 border-gray-200 shadow-sm"
                style={{ backgroundColor: textColor }}
              />
              <input
                type="color"
                value={textColor}
                onChange={(e) => onTextColorChange(e.target.value)}
                className="h-14 w-full rounded-2xl border-2 border-gray-200 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <Type className="h-6 w-6 text-gray-400" />
          <h3 className="text-2xl font-semibold text-gray-900">Typography</h3>
        </div>
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            Font Family
          </Label>
          <Select value={appFontFamily} onValueChange={onAppFontFamilyChange}>
            <SelectTrigger className="h-14 text-lg rounded-2xl border-gray-200">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter" className="text-lg">Inter</SelectItem>
              <SelectItem value="cal-sans" className="text-lg">Cal Sans</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>
    </motion.div>
  );
}