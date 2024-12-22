import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface AffirmationsHeaderProps {
  isEditing: boolean;
  onEditToggle: () => void;
}

export const AffirmationsHeader = ({ isEditing, onEditToggle }: AffirmationsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed top-8 w-full px-8 flex justify-between items-center z-[100]">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/home')}
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
  );
};