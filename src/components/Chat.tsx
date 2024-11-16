import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActiveCallContext } from "../App";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatControls } from "./chat/ChatControls";
import { humeService } from "@/services/humeService";
import { toast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  text: string;
  emotions?: Array<{
    name: string;
    color: string;
  }>;
  isUser?: boolean;
  isInterruption?: boolean;
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
              }))
            }]);
            break;
          case 'assistant_message':
            setMessages(prev => [...prev, {
              text: message.text,
              emotions: message.expressions?.map((exp: any) => ({
                name: exp.name,
                color: `bg-${exp.score > 0.5 ? 'blue' : 'purple'}-300`
              }))
            }]);
            break;
          case 'user_interruption':
            setMessages(prev => [...prev, {
              isInterruption: true,
              text: "USER INTERRUPTION DETECTED"
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

      // Subscribe to real-time emotional responses
      const subscription = supabase
        .channel('emotional-responses')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'emotional_responses'
          },
          (payload) => {
            console.log('New emotional response:', payload);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
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
      
      <ChatControls 
        isMicMuted={isMicMuted}
        onMicToggle={handleMicToggle}
        onEndCall={handleEndCall}
        onMessageClick={() => setShowMessages(true)}
      />
    </div>
  );
}