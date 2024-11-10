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
      <button onClick={onBack} className="p-2 text-gray-600">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h1 className="text-xl font-medium">{personality}</h1>
      <Drawer>
        <DrawerTrigger asChild>
          <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100">
            <Info className="h-5 w-5" />
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={`/${personality.toLowerCase().replace(" ", "-")}-avatar.png`}
                    alt={personality}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-medium">{personality}</h2>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900">About</h3>
              <p className="text-gray-600 leading-relaxed">{personalityInfo.about}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-3xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Base voice</h3>
                <p className="text-gray-600">{personalityInfo.baseVoice}</p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Language model</h3>
                <p className="text-gray-600">{personalityInfo.model}</p>
              </div>
            </div>

            <div className="bg-red-50 rounded-3xl p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-red-600">Reset chat history</h3>
                <p className="text-gray-600">This will clear the chat history for this character. This action cannot be undone.</p>
                <Button 
                  onClick={onResetChat}
                  className="mt-4 w-full py-6 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium"
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