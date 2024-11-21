import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActiveCallContext } from "../App";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatView } from "./chat/ChatView";
import { supabase } from "@/integrations/supabase/client";
import { humeService } from "@/services/humeService";
import { toast } from "./ui/use-toast";

interface Message {
  text: string;
  emotions?: Array<{
    name: string;
    color: string;
  }>;
  isUser?: boolean;
  isInterruption?: boolean;
  timestamp?: string;
}

interface ChatProps {
  personality: string;
}

export function Chat({ personality }: ChatProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const { setActiveCall } = useContext(ActiveCallContext);

  useEffect(() => {
    const initializeHume = async () => {
      setActiveCall(personality);
      const isHumeEnabled = ["life-advice", "storytelling", "emotional-reflection"].includes(personality);
      
      if (!isHumeEnabled) return;

      const connected = await humeService.connect((message) => {
        switch (message.type) {
          case 'user_message':
            setMessages(prev => [...prev, {
              text: message.transcript,
              isUser: true,
              emotions: message.expressions?.map((exp: any) => ({
                name: exp.name,
                color: `bg-${exp.score > 0.5 ? 'green' : 'amber'}-300`
              })),
              timestamp: new Date().toISOString()
            }]);
            break;
          case 'assistant_message':
            setMessages(prev => [...prev, {
              text: message.text,
              emotions: message.expressions?.map((exp: any) => ({
                name: exp.name,
                color: `bg-${exp.score > 0.5 ? 'blue' : 'purple'}-300`
              })),
              timestamp: new Date().toISOString()
            }]);
            break;
          case 'user_interruption':
            setMessages(prev => [...prev, {
              isInterruption: true,
              text: "USER INTERRUPTION DETECTED",
              timestamp: new Date().toISOString()
            }]);
            break;
        }
      }, personality);

      if (!connected) {
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice service. Please try again.",
          variant: "destructive"
        });
        navigate('/home');
      }
    };

    initializeHume();

    return () => {
      humeService.cleanup();
      setActiveCall(null);
    };
  }, [personality, setActiveCall, navigate]);

  const handleEndCall = () => {
    humeService.cleanup();
    setActiveCall(null);
    navigate('/home');
  };

  const handleBack = () => {
    navigate('/home');
  };

  const handleMicToggle = () => {
    setIsMicMuted(!isMicMuted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wzrd-blue via-wzrd-purple to-wzrd-pink">
      <ChatHeader 
        personality={personality}
        onBack={handleBack}
      />
      <ChatView 
        messages={messages}
        isListening={isListening}
        personality={personality}
        isMicMuted={isMicMuted}
        onMicToggle={handleMicToggle}
        onEndCall={handleEndCall}
      />
    </div>
  );
}