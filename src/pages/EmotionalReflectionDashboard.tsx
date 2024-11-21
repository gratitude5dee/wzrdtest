import { EmotionalReflectionDashboard } from "@/components/EmotionalReflectionDashboard";
import { motion } from "framer-motion";

export default function EmotionalReflectionPage() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <EmotionalReflectionDashboard />
    </motion.div>
  );
}