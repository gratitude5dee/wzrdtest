import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActiveCallContext } from "../App";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatControls } from "./chat/ChatControls";
import { EmotionalReflectionDashboard } from "./EmotionalReflectionDashboard";
import { humeService } from "@/services/humeService";
import { toast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { ArrowLeft, Info } from 'lucide-react';
import { Button } from './ui/button';

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
  const [showHistory, setShowHistory] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const { setActiveCall } = useContext(ActiveCallContext);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching chat history:', error);
        return;
      }
      
      setChatHistory(data);
    };

    fetchChatHistory();
  }, []);

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
    if (showHistory) {
      setShowHistory(false);
    } else {
      navigate('/home');
    }
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

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      'PRIDE': 'bg-purple-500',
      'CALMNESS': 'bg-blue-300',
      'REALIZATION': 'bg-blue-600',
    };
    return colors[emotion] || 'bg-gray-400';
  };

  if (showHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wzrd-blue via-wzrd-purple to-wzrd-pink">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </Button>
            <h1 className="text-lg font-medium text-white">Chat History</h1>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/10"
            >
              <Info className="h-5 w-5 text-white" />
            </Button>
          </div>
        </header>

        <div className="pt-16 pb-24 px-4">
          <div className="space-y-6">
            {chatHistory?.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  message.is_user_message ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[85%] space-y-2",
                  message.is_user_message ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "rounded-3xl px-4 py-3 shadow-sm",
                    message.is_user_message 
                      ? "bg-white/90 backdrop-blur-sm ml-auto" 
                      : "bg-white/90 backdrop-blur-sm"
                  )}>
                    <p className="text-gray-800">{message.message}</p>
                  </div>
                  {message.emotion_name && (
                    <div className="flex gap-2 px-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          getEmotionColor(message.emotion_name)
                        )} />
                        <span className="text-xs uppercase tracking-wider text-white/70 font-mono">
                          {message.emotion_name}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="px-1">
                    <span className="text-xs text-white/50">
                      {format(new Date(message.created_at || ''), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
      <ChatHeader 
        personality={personality}
        onBack={handleBack}
        onResetChat={() => setMessages([])}
        personalityInfo={personalityInfo}
        onHistoryClick={() => setShowHistory(true)}
      />
      
      {personality === "Emotional Reflection" ? (
        <EmotionalReflectionDashboard />
      ) : (
        <ChatMessages 
          messages={messages}
          isListening={isListening}
          personality={personality}
        />
      )}
      
      <ChatControls 
        isMicMuted={isMicMuted}
        onMicToggle={handleMicToggle}
        onEndCall={handleEndCall}
        onMessageClick={() => setShowHistory(true)}
      />
    </div>
  );
}