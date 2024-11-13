import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { Home } from "./components/Home";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Intro } from "./components/Intro";
import Teleprompter from "./components/Teleprompter";
import { LoadingAnimation } from "./components/LoadingAnimation";
import { createContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "framer-motion";

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

  return children;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const App = () => {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <ActiveCallContext.Provider value={{ activeCall, setActiveCall }}>
        <TooltipProvider>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Intro />
                </motion.div>
              } />
              <Route path="/login" element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Login />
                </motion.div>
              } />
              <Route path="/home" element={
                <ProtectedRoute>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Home />
                  </motion.div>
                </ProtectedRoute>
              } />
              <Route path="/chat/:personality" element={
                <ProtectedRoute>
                  <ChatWrapper />
                </ProtectedRoute>
              } />
              <Route path="/teleprompter" element={<Teleprompter />} />
            </Routes>
          </AnimatePresence>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ActiveCallContext.Provider>
    </QueryClientProvider>
  );
};

// Add a wrapper component to handle the personality parameter
const ChatWrapper = () => {
  const { personality } = useParams<{ personality: string }>();
  
  if (!personality) {
    return <Navigate to="/home" replace />;
  }

  return <Chat personality={personality} />;
};

export default App;