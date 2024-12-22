import { Buffer } from 'buffer';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import { Home } from "./components/Home";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Intro } from "./components/Intro";
import { QuickAnswers } from "./components/QuickAnswers";
import { Affirmations } from "./components/Affirmations";
import { ChatHistory } from "./components/ChatHistory";
import { EmotionalReflectionDashboard } from "./components/EmotionalReflectionDashboard";
import { createContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/hooks/useTheme";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useEffect } from "react";

window.Buffer = Buffer;

const queryClient = new QueryClient();

// TODO: route through a backend server.
const crossmintEndpoint = 'https://www.crossmint.com/api/v1-alpha2';

// TODO: No API Keys on the frontend
const crossmintApiKey = import.meta.env.VITE_CROSSMINT_API_KEY || '';

// TODO: one wallet per user
const userWallet = 'yE6XZFvVaPAnN5KShY9U5AekNGyZ1YharCSSTt2Vm7v';

const storeWallet = 'HQdycpZvKJMU8Y555e7u6TffSZTGrPxMZJmgq2Zw8dqw';

export const ActiveCallContext = createContext<{
  activeCall: string | null;
  setActiveCall: (personality: string | null) => void;
}>({
  activeCall: null,
  setActiveCall: () => { },
});

export const SolanaContext = createContext<{
  balance: number;
  address: string;
  storeAddress: string;
  endpoint: string;
  apiKey: string;
  setBalance: (balance: number) => void;
}>({
  balance: 0,
  address: userWallet,
  storeAddress: storeWallet,
  apiKey: crossmintApiKey,
  endpoint: crossmintEndpoint,
  setBalance: () => { },
});

function SolanaProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`${crossmintEndpoint}/wallets/${userWallet}/balances?currencies=sol`, {
          headers: {
            'X-API-KEY': crossmintApiKey
          }
        });
        const data = await response.json();
        setBalance(parseFloat(data[0].balances["solana"]));
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    const intervalId = setInterval(fetchBalance, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <SolanaContext.Provider value={{
      balance, setBalance,
      address: userWallet,
      storeAddress: storeWallet,
      endpoint: crossmintEndpoint,
      apiKey: crossmintApiKey
    }}>
      {children}
    </SolanaContext.Provider>
  );
}

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
        <SolanaProvider>
          <ActiveCallContext.Provider value={{ activeCall, setActiveCall }}>
            <TooltipProvider>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Intro />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/home" element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } />
                  <Route path="/chat-history" element={
                    <ProtectedRoute>
                      <ChatHistory />
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
                  <Route path="/affirmations" element={
                    <ProtectedRoute>
                      <Affirmations />
                    </ProtectedRoute>
                  } />
                </Routes>
              </AnimatePresence>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </ActiveCallContext.Provider>
        </SolanaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;