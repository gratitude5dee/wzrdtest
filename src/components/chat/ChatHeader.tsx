import { ArrowLeft, Info, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
      <Dialog>
        <DialogTrigger asChild>
          <button className="p-2 text-gray-600">
            <Info className="h-5 w-5" />
          </button>
        </DialogTrigger>
        <DialogContent className="fixed bottom-0 left-0 right-0 top-auto rounded-t-[32px] p-0 border-0 max-w-none translate-y-0 !duration-300">
          <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={`/${personality.toLowerCase().replace(" ", "-")}-avatar.png`}
                    alt={personality}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-medium">{personality}</h2>
              </div>
              <DialogTrigger asChild>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </DialogTrigger>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-medium">About</h3>
              <p className="text-gray-600 leading-relaxed">{personalityInfo.about}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-3xl p-6">
                <h3 className="text-lg font-medium mb-2">Base voice</h3>
                <p className="text-gray-600">{personalityInfo.baseVoice}</p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6">
                <h3 className="text-lg font-medium mb-2">Language model</h3>
                <p className="text-gray-600">{personalityInfo.model}</p>
              </div>
            </div>

            <div className="bg-red-50 rounded-3xl p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-red-600">Reset chat history</h3>
                <p className="text-gray-600">This will clear the chat history for this character. This action cannot be undone.</p>
                <button 
                  onClick={onResetChat}
                  className="mt-4 w-full py-4 px-6 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}