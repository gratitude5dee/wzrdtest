import { motion, AnimatePresence } from "framer-motion";

interface Message {
  text: string;
  emotions?: Array<{
    name: string;
    color: string;
  }>;
  isUser?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  isListening: boolean;
  personality: string;
}

export function ChatMessages({ messages, isListening, personality }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      <AnimatePresence>
        {isListening ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center min-h-[60vh] space-y-6"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
              <img
                src="/ai-assistant.png"
                alt="AI Assistant"
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-lg font-medium text-gray-600"
            >
              LISTENING...
            </motion.div>
          </motion.div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm
                    ${message.isUser 
                      ? 'bg-blue-500 text-white ml-12' 
                      : 'bg-white/80 backdrop-blur-sm mr-12'
                    }`}
                >
                  <p className="text-lg">{message.text}</p>
                  {message.emotions && (
                    <div className="flex gap-2 mt-2">
                      {message.emotions.map((emotion, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded-full ${emotion.color} 
                            ${message.isUser ? 'text-white/80' : 'text-gray-700'}`}
                        >
                          {emotion.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}