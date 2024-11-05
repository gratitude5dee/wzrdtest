import { ArrowLeft, Info, Mic, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    navigate('/home');
  };

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
        <button className="p-2 text-gray-600">
          <Info className="h-5 w-5" />
        </button>
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
          <button className="p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
            <Mic className="h-6 w-6 text-gray-600" />
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