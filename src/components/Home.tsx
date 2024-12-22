import { Clipboard, Settings as SettingsIcon, History } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ActiveCallContext, SolanaContext } from "../App";
import { Settings } from "./Settings";
import { cn } from "@/lib/utils";
import { CallBar } from "./CallBar";
import { PersonalityGrid } from "./PersonalityGrid";
import { GradientShader } from "./GradientShader";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LAMPORT_COUNT } from "@/services/solanaService";

export function Home() {
  const navigate = useNavigate();

  const { balance, address } = useContext(SolanaContext);

  const { activeCall, setActiveCall } = useContext(ActiveCallContext);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleMicToggle = () => setIsMicMuted(!isMicMuted);
  const handleEndCall = () => setActiveCall(null);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
        <GradientShader />
      </div>

      <div className="absolute inset-0 backdrop-blur-[100px] bg-white/10" />

      <div className="relative z-10 min-h-screen p-6 pb-32">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8">
              <img src="/wzrd-logo.png" alt="WZRD" className="w-full h-full" />
            </div>
            <span className="text-2xl font-semibold text-white text-glow-strong">WZRD.tech</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-white rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-lg border border-white/20"
              onClick={() => setBalanceModalOpen(true)}
            >
              <span className="text-lg font-medium">Balance:</span>
              <span className="text-xl font-semibold">{balance / LAMPORT_COUNT} SOL</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/chat-history')}
              className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-lg border border-white/20"
            >
              <History className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-lg border border-white/20"
              onClick={() => setSettingsOpen(true)}
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <PersonalityGrid
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          navigate={navigate}
        />

        <CallBar
          activeCall={activeCall}
          isMicMuted={isMicMuted}
          callDuration={callDuration}
          onMicToggle={handleMicToggle}
          onEndCall={handleEndCall}
          setCallDuration={setCallDuration}
        />

        <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
        <Dialog open={balanceModalOpen} onOpenChange={setBalanceModalOpen}>
          <DialogContent className="bg-white max-w-2xl">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add to your balance</h2>
              <p className="mb-4">You can add to your balance by sending SOL to the following address:</p>
              <div className="flex items-center mb-4">
                <p className="font-mono bg-gray-100 p-2 rounded">{address}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={handleCopyAddress}
                >
                  <Clipboard className="h-5 w-5" />
                </Button>
              </div>
              {copied && <p className="text-green-500">Copied!</p>}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}