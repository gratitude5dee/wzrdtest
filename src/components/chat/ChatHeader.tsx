import { ArrowLeft, Info } from 'lucide-react';
import { Button } from '../ui/button';

interface ChatHeaderProps {
  personality: string;
  onBack: () => void;
}

export function ChatHeader({ personality, onBack }: ChatHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <h1 className="text-lg font-medium text-white">{personality}</h1>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/10"
        >
          <Info className="h-5 w-5 text-white" />
        </Button>
      </div>
    </header>
  );
}