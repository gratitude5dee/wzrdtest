import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ChatHeaderProps {
  personality: string;
  onBack: () => void;
  onResetChat: () => void;
  personalityInfo: {
    about: string;
    baseVoice: string;
    model: string;
  };
}

export function ChatHeader({ personality, onBack, onResetChat, personalityInfo }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <button onClick={onBack} className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h1 className="text-xl font-medium">{personality}</h1>
      <Drawer>
        <DrawerTrigger asChild>
          <button 
            className="relative p-2 text-gray-600 hover:text-gray-800 transition-all duration-300
                     bg-gradient-to-br from-white to-gray-50
                     hover:from-gray-50 hover:to-gray-100
                     rounded-full shadow-lg hover:shadow-xl
                     border border-gray-200/50 hover:border-gray-300/50
                     backdrop-blur-sm
                     group"
            style={{
              background: `radial-gradient(circle at 50% 50%,
                          rgba(255, 255, 255, 0.8),
                          rgba(240, 240, 240, 0.6))`,
            }}
          >
            <div className="absolute inset-0 rounded-full bg-blue-400/10 group-hover:bg-blue-400/20 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-full animate-glow-pulse" />
            <Info className="h-5 w-5 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-6 space-y-8 bg-gradient-to-b from-white to-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-white shadow-lg">
                  <img 
                    src={`/${personality.toLowerCase().replace(" ", "-")}-avatar.png`}
                    alt={personality}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {personality}
                </h2>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900">About</h3>
              <p className="text-gray-600 leading-relaxed">{personalityInfo.about}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Base voice</h3>
                <p className="text-gray-600">{personalityInfo.baseVoice}</p>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Language model</h3>
                <p className="text-gray-600">{personalityInfo.model}</p>
              </div>
            </div>

            <div className="bg-red-50 rounded-3xl p-6 shadow-lg border border-red-100">
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-red-600">Reset chat history</h3>
                <p className="text-gray-600">This will clear the chat history for this character. This action cannot be undone.</p>
                <Button 
                  onClick={onResetChat}
                  className="mt-4 w-full py-6 bg-gradient-to-r from-red-500 to-red-600 
                           hover:from-red-600 hover:to-red-700 text-white rounded-full font-medium 
                           transition-all duration-300 shadow-lg hover:shadow-xl 
                           transform hover:-translate-y-0.5"
                >
                  Start Over
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </header>
  );
}