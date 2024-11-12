import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TeleprompterLayoutProps {
  children: React.ReactNode;
  onExit: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

export const TeleprompterLayout = ({
  children,
  onExit,
  isEditing,
  onEditToggle
}: TeleprompterLayoutProps) => {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      
      <div className="fixed top-8 w-full px-8 flex justify-between items-center z-[100]">
        <Button
          variant="ghost"
          size="icon"
          onClick={onExit}
          className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all duration-300 hover:scale-105 backdrop-blur-lg border border-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onEditToggle}
          className={cn(
            "w-12 h-12 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-lg border",
            isEditing ? 
              "bg-white/90 text-black hover:bg-white border-black/10" :
              "bg-black/40 hover:bg-black/60 text-white border-white/10"
          )}
        >
          <Edit2 className="h-6 w-6" />
        </Button>
      </div>

      {children}
      
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-20" />
      <div className="fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-20" />
    </div>
  );
};