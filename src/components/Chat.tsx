import { ArrowLeft, Info, Mic, Phone, MessageSquare, MicOff, X } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActiveCallContext } from "../App";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

interface Message {
  text: string;
  emotions?: Array<{
    name: string;
    color: string;
  }>;
  isUser?: boolean;
}

interface ChatProps {
  personality: string;
}

export function Chat({ personality }: ChatProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const { setActiveCall } = useContext(ActiveCallContext);

  useEffect(() => {
    setActiveCall(personality);
    return () => {
      if (window.location.pathname === '/home') {
        setActiveCall(null);
      }
    };
  }, [personality, setActiveCall]);

  const handleMessageClick = () => {
    setIsListening(false);
    setShowMessages(true);
    setMessages([
      {
        text: "Hello! How can I help you today?",
        emotions: [
          { name: "WARMTH", color: "bg-orange-300" },
          { name: "OPENNESS", color: "bg-blue-300" },
        ],
        isUser: false
      }
    ]);
  };

  const handleEndCall = () => {
    setActiveCall(null);
    navigate('/home');
  };

  const handleMicToggle = () => {
    setIsMicMuted(!isMicMuted);
  };

  const getPersonalityInfo = () => {
    const info = {
      "Emotional Reflection": {
        about: "A relaxed, professorial advisor with a wealth of knowledge and calm demeanor. Bring your intellectual curiosities - his laid-back wisdom will offer enlightening new perspectives.",
        baseVoice: "Dacher",
        model: "claude-3-5-sonnet-latest"
      }
    };
    return info[personality as keyof typeof info] || {
      about: "An AI assistant ready to help you.",
      baseVoice: "Default",
      model: "Default"
    };
  };

  const personalityInfo = getPersonalityInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 py-2 text-sm text-gray-600">
        <span>4:47</span>
        <div className="flex items-center gap-1">
          <span className="h-4 w-4">📶</span>
          <span>23%</span>
        </div>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-600">
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
                onClick={() => setMessages([])}
                className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-lg mt-4"
              >
                Reset chat history
              </button>
            </div>
          </DrawerContent>
        </Drawer>
      </header>

      {/* Chat Content */}
      <div className="flex-1 px-6 space-y-6 mb-24 overflow-y-auto">
        {isListening && (
          <div className="flex flex-col items-center justify-center space-y-6 pt-20">
            <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center">
              <img src={`/${personality.toLowerCase().replace(" ", "-")}-avatar.png`} alt="AI Assistant" className="w-24 h-24" />
            </div>
            <p className="font-mono text-sm tracking-wider">LISTENING...</p>
          </div>
        )}

        {showMessages && messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] space-y-2 ${message.isUser ? "items-end" : "items-start"}`}>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                <p className="text-gray-800">{message.text}</p>
              </div>
              {message.emotions && (
                <div className="flex gap-2 flex-wrap">
                  {message.emotions.map((emotion, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${emotion.color}`} />
                      <span className="text-xs uppercase tracking-wider text-gray-600">
                        {emotion.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-transparent">
        <div className="flex justify-around items-center">
          <button 
            onClick={handleMicToggle}
            className="p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-sm relative"
          >
            {isMicMuted ? (
              <MicOff className="h-6 w-6 text-gray-600" />
            ) : (
              <Mic className="h-6 w-6 text-gray-600" />
            )}
          </button>
          <button 
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-500 shadow-sm hover:bg-red-600 transition-colors"
          >
            <Phone className="h-6 w-6 text-white" />
          </button>
          <button 
            onClick={handleMessageClick}
            className="p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
          >
            <MessageSquare className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        {/* Home Indicator */}
        <div className="mt-4 flex justify-center">
          <div className="w-32 h-1 bg-black rounded-full opacity-20" />
        </div>
      </div>
    </div>
  );
}