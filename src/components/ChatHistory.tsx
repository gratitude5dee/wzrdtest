import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import { Button } from './ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  personality: string;
  message: string;
  emotion_name?: string;
  emotion_score?: number;
  is_user_message: boolean;
  created_at: string;
}

export function ChatHistory() {
  const navigate = useNavigate();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['chat-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ChatMessage[];
    }
  });

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      'PRIDE': 'bg-purple-500',
      'CALMNESS': 'bg-blue-300',
      'REALIZATION': 'bg-blue-600',
      // Add more emotions and colors as needed
    };
    return colors[emotion] || 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wzrd-blue via-wzrd-purple to-wzrd-pink">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home')}
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

      {/* Messages */}
      <div className="pt-16 pb-24 px-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-white/60">Loading...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages?.map((message) => (
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
                      {format(new Date(message.created_at), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}