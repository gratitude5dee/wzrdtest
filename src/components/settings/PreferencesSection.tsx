import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="backgroundColor" className="text-gray-600">Background Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={backgroundColor}
            onChange={(e) => onBackgroundColorChange(e.target.value)}
            className="h-14 rounded-2xl text-lg bg-gray-50 border-gray-100 w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="textColor" className="text-gray-600">Text Color</Label>
          <Input
            id="textColor"
            type="color"
            value={textColor}
            onChange={(e) => onTextColorChange(e.target.value)}
            className="h-14 rounded-2xl text-lg bg-gray-50 border-gray-100 w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="appFontFamily" className="text-gray-600">App Font</Label>
          <Select value={appFontFamily} onValueChange={onAppFontFamilyChange}>
            <SelectTrigger id="appFontFamily" className="h-14 rounded-2xl text-lg bg-gray-50 border-gray-100">
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