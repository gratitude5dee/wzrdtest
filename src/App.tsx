import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useParams } from "react-router-dom";
import { Home } from "./components/Home";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Intro } from "./components/Intro";
import { QuickAnswers } from "./components/QuickAnswers";
import { Affirmations } from "./components/Affirmations";
import Teleprompter from "./components/Teleprompter";
import { EmotionalReflectionDashboard } from "./components/EmotionalReflectionDashboard";
import { createContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "@/hooks/useTheme";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./styles/animations.css";

const queryClient = new QueryClient();

export const ActiveCallContext = createContext<{
  activeCall: string | null;
  setActiveCall: (personality: string | null) => void;
}>({
  activeCall: null,
  setActiveCall: () => {},
});

function ChatWrapper() {
  const { personality } = useParams();
  return <Chat personality={personality || "Assistant"} />;
}

function App() {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ActiveCallContext.Provider value={{ activeCall, setActiveCall }}>
          <TooltipProvider>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                  >
                    <Intro />
                  </motion.div>
                } />
                <Route path="/login" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                  >
                    <Login />
                  </motion.div>
                } />
                <Route path="/home" element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: "easeInOut" }}
                    >
                      <Home />
                    </motion.div>
                  </ProtectedRoute>
                } />
                <Route path="/quick-answers" element={
                  <ProtectedRoute>
                    <QuickAnswers />
                  </ProtectedRoute>
                } />
                <Route path="/chat/:personality" element={
                  <ProtectedRoute>
                    <ChatWrapper />
                  </ProtectedRoute>
                } />
                <Route path="/emotional-reflection" element={
                  <ProtectedRoute>
                    <EmotionalReflectionDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/teleprompter" element={
                  <ProtectedRoute>
                    <Teleprompter />
                  </ProtectedRoute>
                } />
                <Route path="/affirmations" element={<Affirmations />} />
              </Routes>
            </AnimatePresence>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </ActiveCallContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;