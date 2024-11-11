import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import { Home } from "./components/Home";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Teleprompter } from "./components/Teleprompter";
import { createContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

export const ActiveCallContext = createContext<{
  activeCall: string | null;
  setActiveCall: (personality: string | null) => void;
}>({
  activeCall: null,
  setActiveCall: () => {},
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function ChatWrapper() {
  const { personalityId } = useParams();
  const personalities = {
    "quick-answers": "Quick Answers",
    "emotional-reflection": "Emotional Reflection",
    "life-advice": "Life Advice",
    "storytelling": "Storytelling",
    "deeper-questions": "Deeper Questions",
    "spirituality": "Spirituality"
  };
  
  return <Chat personality={personalities[personalityId as keyof typeof personalities] || "Assistant"} />;
}

const App = () => {
  const [activeCall, setActiveCall] = useState<string | null>(null);

  const affirmationsText = "I am worthy of love and respect. Every day I grow stronger and more confident. I trust in my abilities and embrace new challenges. My potential is limitless. I radiate positivity and attract success. I am grateful for all that I have. I choose to be happy and spread joy to others. I am exactly where I need to be. My future is bright and full of possibilities. I deserve all the good things life has to offer.";

  return (
    <QueryClientProvider client={queryClient}>
      <ActiveCallContext.Provider value={{ activeCall, setActiveCall }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/chat/:personalityId" element={
                <ProtectedRoute>
                  <ChatWrapper />
                </ProtectedRoute>
              } />
              <Route path="/teleprompter" element={
                <ProtectedRoute>
                  <Teleprompter />
                </ProtectedRoute>
              } />
              <Route path="/affirmations" element={
                <ProtectedRoute>
                  <Teleprompter 
                    initialScript={affirmationsText} 
                    fontSize={44} 
                    fontFamily="inter" 
                    textColor="#785340" 
                  />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ActiveCallContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
