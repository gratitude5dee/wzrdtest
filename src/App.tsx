import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { Onboarding } from "./components/Onboarding";
import { Home } from "./components/Home";
import { Chat } from "./components/Chat";

const queryClient = new QueryClient();

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chat/:personalityId" element={<ChatWrapper />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;