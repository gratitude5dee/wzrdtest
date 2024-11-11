import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronUp } from "lucide-react";

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
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-medium text-gray-900">Theme</h3>
        <Button
          variant="outline"
          className="w-full justify-between py-6 text-lg font-normal bg-gray-50 hover:bg-gray-100 border-gray-200"
        >
          <span>Light</span>
          <ChevronUp className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-medium text-gray-900">Colors</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backgroundColor" className="text-base text-gray-600">
              Page Color
            </Label>
            <div className="flex gap-3 items-center">
              <div 
                className="w-10 h-10 rounded-lg border border-gray-200"
                style={{ backgroundColor }}
              />
              <input
                id="backgroundColor"
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="sr-only"
              />
              <Button
                variant="outline"
                className="flex-1 justify-start text-base font-normal"
                onClick={() => document.getElementById('backgroundColor')?.click()}
              >
                Choose color
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="textColor" className="text-base text-gray-600">
              Text Color
            </Label>
            <div className="flex gap-3 items-center">
              <div 
                className="w-10 h-10 rounded-lg border border-gray-200"
                style={{ backgroundColor: textColor }}
              />
              <input
                id="textColor"
                type="color"
                value={textColor}
                onChange={(e) => onTextColorChange(e.target.value)}
                className="sr-only"
              />
              <Button
                variant="outline"
                className="flex-1 justify-start text-base font-normal"
                onClick={() => document.getElementById('textColor')?.click()}
              >
                Choose color
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-medium text-gray-900">Typography</h3>
        <div className="space-y-2">
          <Label htmlFor="appFontFamily" className="text-base text-gray-600">
            Font
          </Label>
          <Select value={appFontFamily} onValueChange={onAppFontFamilyChange}>
            <SelectTrigger id="appFontFamily" className="h-12 text-base font-normal">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="cal-sans">Cal Sans</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}