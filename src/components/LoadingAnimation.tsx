import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export function LoadingAnimation({ onComplete, duration = 5000 }: LoadingAnimationProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[#FFF8F6]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <Spline scene="https://prod.spline.design/ezcEw0FCO3xW-Mep/scene.splinecode" />
    </motion.div>
  );
}