import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Type, Wand2, Space, ArrowUp, ArrowDown, Palette, TextSelect } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Skeleton } from '@/components/ui/skeleton';

export const ScriptEditor = () => {
  const [script, setScript] = useState('');
  const navigate = useNavigate();
  const { preferences, loading, updatePreferences } = useUserPreferences();
  const { fontSize, fontFamily, textColor } = preferences;

  const handleStart = () => {
    if (script.trim()) {
      toast.success('Starting teleprompter...');
      navigate('/teleprompter', { 
        state: { 
          script,
          fontSize,
          fontFamily,
          textColor
        } 
      });
    }
  };

  const handleFontSizeChange = (value: number[]) => {
    updatePreferences({ fontSize: value[0] });
  };

  const handleFontFamilyChange = (value: string) => {
    updatePreferences({ fontFamily: value });
  };

  const handleTextColorChange = (value: string) => {
    updatePreferences({ textColor: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-teleprompter-bg text-teleprompter-text p-8 flex flex-col items-center">
        <div className="w-full max-w-5xl space-y-16">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-[50vh] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-teleprompter-bg flex flex-col items-center">
      <Textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Write your script here..."
        className="w-full h-[50vh] bg-gray-800 text-white border border-gray-600 rounded-lg p-4 resize-none"
      />
      <Button onClick={handleStart} className="mt-4">
        <ArrowRight className="mr-2" />
        Start Teleprompter
      </Button>

      <div className="mt-6 space-y-4">
        <div>
          <Label>Font Size</Label>
          <div className="flex items-center gap-4">
            <Slider
              defaultValue={[fontSize]}
              min={16}
              max={100}
              step={1}
              onValueChange={handleFontSizeChange}
            />
            <span className="text-sm text-muted-foreground w-12">{fontSize}px</span>
          </div>
        </div>
        <div>
          <Label>Font Family</Label>
          <Select onValueChange={handleFontFamilyChange} defaultValue={fontFamily}>
            <SelectTrigger>
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="cal-sans">Cal Sans</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Text Color</Label>
          <Select onValueChange={handleTextColorChange} defaultValue={textColor}>
            <SelectTrigger>
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="#F8FAFC">White</SelectItem>
              <SelectItem value="#FFD700">Gold</SelectItem>
              <SelectItem value="#FF4500">Orange Red</SelectItem>
              <SelectItem value="#00FF00">Green</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};