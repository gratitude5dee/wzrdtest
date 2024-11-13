import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate, useLocation } from "react-router-dom";
import { Home } from "./components/Home";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Intro } from "./components/Intro";
import Teleprompter from "./components/Teleprompter";
import { LoadingAnimation } from "./components/LoadingAnimation";
import { createContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import "./styles/animations.css";

const queryClient = new QueryClient();

export const ActiveCallContext = createContext<{
  activeCall: string | null;
  setActiveCall: (personality: string | null) => void;
}>({
  activeCall: null,
  setActiveCall: () => {},
});

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingAnimation onComplete={() => setIsLoading(false)} />;
  }

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.645, 0.045, 0.355, 1.000] }}
    >
      {children}
    </motion.div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showInitialLoading, setShowInitialLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session);
      if (event === 'SIGNED_IN') {
        setShowInitialLoading(true);
        setTimeout(() => setShowInitialLoading(false), 5000);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (showInitialLoading) {
    return <LoadingAnimation onComplete={() => setShowInitialLoading(false)} />;
  }

  return <PageTransition>{children}</PageTransition>;
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
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <ActiveCallContext.Provider value={{ activeCall, setActiveCall }}>
        <TooltipProvider>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Intro />} />
              <Route path="/login" element={
                <PageTransition>
                  <Login />
                </PageTransition>
              } />
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
                  <motion.div 
                    className="fixed inset-0 min-h-screen w-full bg-[#FFF8F6] overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Teleprompter 
                      initialScript={affirmationsText} 
                      fontSize={44} 
                      fontFamily="cal-sans" 
                      textColor="#785340"
                      autoStart={true}
                    />
                  </motion.div>
                </ProtectedRoute>
              } />
            </Routes>
          </AnimatePresence>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ActiveCallContext.Provider>
    </QueryClientProvider>
  );
};

export default App;