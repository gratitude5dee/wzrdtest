import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Emotion {
  name: string;
  color: string;
}

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  emotions?: Emotion[];
  timestamp?: string;
  isInterruption?: boolean;
}

export function ChatMessage({ message, isUser, emotions, timestamp, isInterruption }: ChatMessageProps) {
  if (isInterruption) {
    return (
      <div className="flex justify-center w-full my-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono text-gray-600 bg-gray-100/80 backdrop-blur-sm rounded-full">
          <span className="w-4 h-4">⏱</span>
          USER INTERRUPTION DETECTED
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[85%] space-y-2", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "rounded-3xl px-4 py-3 shadow-sm",
          isUser ? "bg-white/90 backdrop-blur-sm ml-auto" : "bg-white/90 backdrop-blur-sm"
        )}>
          <p className="text-gray-800">{message}</p>
        </div>
        {emotions && emotions.length > 0 && (
          <div className="flex gap-2 px-1">
            {emotions.map((emotion, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", emotion.color)} />
                <span className="text-xs uppercase tracking-wider text-white/70 font-mono">
                  {emotion.name}
                </span>
              </div>
            ))}
          </div>
        )}
        {timestamp && (
          <div className="px-1">
            <span className="text-xs text-white/50">
              {format(new Date(timestamp), 'MMM d, h:mm a')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}