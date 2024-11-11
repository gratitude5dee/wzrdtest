import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActiveCallContext } from "../App";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatControls } from "./chat/ChatControls";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

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
    return () => setActiveCall(null);
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

  const handleBack = () => {
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
      <ChatHeader 
        personality={personality}
        onBack={handleBack}
        onResetChat={() => setMessages([])}
        personalityInfo={personalityInfo}
      />
      
      <ChatMessages 
        messages={messages}
        isListening={isListening}
        personality={personality}
      />
      
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4"
          >
            <Button
              onClick={handleMicToggle}
              variant="secondary"
              size="lg"
              className={`rounded-full p-6 ${
                isMicMuted ? 'bg-red-100 hover:bg-red-200' : 'bg-white/80 hover:bg-white'
              } backdrop-blur-sm shadow-lg transition-all duration-300`}
            >
              <Mic className={`h-6 w-6 ${isMicMuted ? 'text-red-600' : 'text-gray-600'}`} />
            </Button>
            
            <Button
              onClick={handleMessageClick}
              variant="secondary"
              size="lg"
              className="rounded-full p-6 bg-white/80 hover:bg-white backdrop-blur-sm shadow-lg transition-all duration-300"
            >
              <MessageSquare className="h-6 w-6 text-gray-600" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}