import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Teleprompter from "./Teleprompter";
import { ProtectedRoute } from "./ProtectedRoute";

const affirmationsText = `I am worthy of love and respect.
Each day brings new opportunities for growth and learning.
I trust in my journey and embrace each moment with gratitude.
My potential is limitless, and I have the power to achieve my dreams.
I radiate positivity and attract success naturally.
I am grateful for all the abundance in my life.
I choose happiness and spread joy to others.
I am exactly where I need to be right now.
My future is bright and full of possibilities.
I deserve all the good things life has to offer.
I am resilient and can overcome any challenge.
My thoughts and feelings are valid and deserving of expression.
I attract positive energy and release what no longer serves me.
Every day in every way, I am getting better and better.
I am surrounded by love and support.
My presence makes a positive difference in the world.
I embrace change as an opportunity for growth.
I am at peace with my past and excited about my future.
My creativity flows freely and inspires others.
I trust my intuition and inner wisdom to guide me.
I am confident in my abilities and trust myself completely.
I attract meaningful relationships and nurturing friendships.
My mind is clear, focused, and ready for success.
I choose to be happy and create joy in my life.
I am becoming stronger and more confident each day.`;

export const Affirmations = () => {
  const navigate = useNavigate();

  return (
    <ProtectedRoute>
      <motion.div 
        className="fixed inset-0 min-h-screen w-full bg-[#FFF8F6] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      >
        <Teleprompter 
          initialScript={affirmationsText}
          fontSize={44}
          fontFamily="cal-sans"
          textColor="#785340"
          autoStart={true}
          onExit={() => navigate('/home')}
        />
      </motion.div>
    </ProtectedRoute>
  );
};