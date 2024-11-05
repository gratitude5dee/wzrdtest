import { ArrowLeft, Info, Mic, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "I hope everyone else in particular speaks clearly on one. Sure. It's alright.",
      emotions: [
        { name: "PRIDE", color: "bg-purple-500" },
        { name: "CALMNESS", color: "bg-blue-300" },
      ],
      isUser: true
    },
    {
      text: "And it's low.",
      emotions: [
        { name: "CALMNESS", color: "bg-blue-300" },
        { name: "CONFIDENCE", color: "bg-orange-400" },
      ],
      isUser: true
    },
    {
      text: "I apologize, but your message seems a bit fragmented and unclear.",
      emotions: [
        { name: "REALIZATION", color: "bg-blue-500" },
        { name: "EMPATHY", color: "bg-purple-400" },
      ],
      isUser: false
    }
  ]);
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 py-2 text-sm text-gray-600">
        <span>5:05</span>
        <div className="flex items-center gap-1">
          <span className="h-4 w-4">📶</span>
          <span>20%</span>
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
        {isListening ? (
          <div className="flex flex-col items-center justify-center space-y-6 pt-20">
            <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center">
              <img src="/quick-answers-avatar.png" alt="AI Assistant" className="w-24 h-24" />
            </div>
            <p className="font-mono text-sm tracking-wider">LISTENING...</p>
          </div>
        ) : (
          messages.map((message, index) => (
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
          ))
        )}

        {/* System Messages */}
        <div className="flex justify-center">
          <span className="text-xs text-gray-500 bg-white/50 px-3 py-1 rounded-full">
            USER INTERRUPTION DETECTED
          </span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-transparent">
        <div className="flex justify-around items-center">
          <button className="p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
            <Mic className="h-6 w-6 text-gray-600" />
          </button>
          <button className="p-4 rounded-full bg-red-500 shadow-sm">
            <Phone className="h-6 w-6 text-white" />
          </button>
          <button className="p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
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