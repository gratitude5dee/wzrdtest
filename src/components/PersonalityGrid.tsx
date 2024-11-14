import { personalities } from "@/data/personalities";
import { motion } from "framer-motion";
import { NavigateFunction } from "react-router-dom";

interface PersonalityGridProps {
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
  navigate: NavigateFunction;
}

export function PersonalityGrid({ hoveredCard, setHoveredCard, navigate }: PersonalityGridProps) {
  const handleCardClick = (id: string) => {
    if (id === "quick-answers") {
      navigate("/quick-answers");
    } else if (id === "affirmations") {
      navigate("/affirmations");
    } else {
      navigate(`/chat/${id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
      {personalities.map((personality) => (
        <motion.div
          key={personality.id}
          className={`relative p-6 rounded-xl cursor-pointer ${
            personality.gradient
          } ${personality.span || ""} transition-all duration-300`}
          onClick={() => handleCardClick(personality.id)}
          onMouseEnter={() => setHoveredCard(personality.id)}
          onMouseLeave={() => setHoveredCard(null)}
          whileHover={{ y: -5 }}
          animate={{
            scale: hoveredCard && hoveredCard !== personality.id ? 0.95 : 1,
            opacity: hoveredCard && hoveredCard !== personality.id ? 0.75 : 1,
          }}
        >
          <div className="flex items-center space-x-4">
            <img
              src={personality.icon}
              alt={personality.title}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold">{personality.title}</h3>
              <p className="text-sm text-gray-600">{personality.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}