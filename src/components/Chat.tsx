import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActiveCallContext } from "../App";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatControls } from "./chat/ChatControls";

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
      <ChatHeader 
        personality={personality}
        onBack={() => navigate(-1)}
        onResetChat={() => setMessages([])}
        personalityInfo={personalityInfo}
      />
      
      <ChatMessages 
        messages={messages}
        isListening={isListening}
        personality={personality}
      />
      
      <ChatControls 
        isMicMuted={isMicMuted}
        onMicToggle={handleMicToggle}
        onEndCall={handleEndCall}
        onMessageClick={handleMessageClick}
      />
    </div>
  );
}