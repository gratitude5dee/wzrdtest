import { ArrowLeft, Info } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

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
          <button className="p-2 text-gray-600">
            <Info className="h-5 w-5" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="px-6 pb-6">
          <div className="flex items-center space-x-4 mb-6 mt-8">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src={`/${personality.toLowerCase().replace(" ", "-")}-avatar.png`}
                alt={personality}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold">{personality}</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">About</h3>
              <p className="text-gray-600">{personalityInfo.about}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Base voice</h3>
              <p className="text-gray-600">{personalityInfo.baseVoice}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Language model</h3>
              <p className="text-gray-600">{personalityInfo.model}</p>
            </div>

            <button 
              onClick={onResetChat}
              className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-lg mt-4"
            >
              Reset chat history
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </header>
  );
}