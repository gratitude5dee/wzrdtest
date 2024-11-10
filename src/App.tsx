import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Teleprompter from "./pages/Teleprompter";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

const queryClient = new QueryClient();

const AFFIRMATIONS_TEXT = `I am worthy of love and respect.
Every day I grow stronger and more confident.
I trust in my abilities and embrace new challenges.
My potential is limitless.
I radiate positivity and attract success.
I am grateful for all that I have.
I choose to be happy and spread joy to others.
I am exactly where I need to be.
My future is bright and full of possibilities.
I deserve all the good things life has to offer.`;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark">
      <TooltipProvider>
        <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="relative min-h-screen">
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/teleprompter" element={<Teleprompter />} />
                <Route 
                  path="/affirmations" 
                  element={
                    <Teleprompter 
                      initialText={AFFIRMATIONS_TEXT}
                      fontSize={44}
                      fontFamily="inter"
                      textColor="#F8FAFC"
                    />
                  } 
                />
              </Routes>
            </BrowserRouter>
            <Footer />
          </div>
        </main>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;