import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useState } from "react";
import { motion } from "framer-motion";
import { EmotionCard } from "./emotional-reflection/EmotionCard";
import { ChartSection } from "./emotional-reflection/ChartSection";

interface EmotionCard {
  id: string;
  label: string;
  value: string;
  change: string;
  color: string;
  trend: "up" | "down" | "neutral";
}

export function EmotionalReflectionDashboard() {
  const navigate = useNavigate();
  
  const [emotionCards, setEmotionCards] = useState<EmotionCard[]>([
    { id: "joy", label: "Joy", value: "28.8%", change: "+28% from yesterday", color: "bg-orange-400", trend: "up" },
    { id: "surprise", label: "Surprise", value: "19.2%", change: "-12% from yesterday", color: "bg-orange-400", trend: "down" },
    { id: "anger", label: "Anger", value: "12.1%", change: "+69% from yesterday", color: "bg-purple-500", trend: "up" },
    { id: "fear", label: "Fear", value: "5.9%", change: "-52% from yesterday", color: "bg-purple-500", trend: "down" },
  ]);

  const [chartLayout, setChartLayout] = useState([
    { id: "sentiment-time", order: 0 },
    { id: "sentiment-proportions", order: 1 },
    { id: "emotions-breakdown", order: 2 },
  ]);

  const sentimentData = [
    { date: '2024-09-4', positive: 0.32, neutral: 0.25, negative: 0.23 },
    { date: '2024-09-5', positive: 0.24, neutral: 0.14, negative: 0.22 },
    { date: '2024-09-6', positive: 0.23, neutral: 0.11, negative: 0.13 },
    { date: '2024-09-7', positive: 0.23, neutral: 0.21, negative: 0.19 },
    { date: '2024-09-8', positive: 0.14, neutral: 0.23, negative: 0.42 },
    { date: '2024-09-9', positive: 0.28, neutral: 0.20, negative: 0.22 },
    { date: '2024-09-10', positive: 0.33, neutral: 0.23, negative: 0.13 },
  ];

  const pieData = [
    { name: 'Positive', value: 0.43, color: '#10B981' },
    { name: 'Neutral', value: 0.34, color: '#94A3B8' },
    { name: 'Negative', value: 0.23, color: '#EF4444' },
  ];

  const emotionsBreakdownData = [
    { emotion: "Neutral", value: 0.94 },
    { emotion: "Curiosity", value: 0.03 },
    { emotion: "Joy", value: 0.02 },
    { emotion: "Interest", value: 0.01 },
  ];

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorder = (list: any[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    if (result.type === "EMOTION_CARD") {
      const items = reorder(
        emotionCards,
        result.source.index,
        result.destination.index
      );
      setEmotionCards(items);
    } else if (result.type === "CHART") {
      const items = reorder(
        chartLayout,
        result.source.index,
        result.destination.index
      );
      setChartLayout(items);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home')}
            className="rounded-full hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Emotional Reflection Dashboard</h1>
          <div className="w-10" />
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="emotion-cards" type="EMOTION_CARD" direction="horizontal">
            {(provided) => (
              <motion.div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {emotionCards.map((card, index) => (
                  <EmotionCard key={card.id} card={card} index={index} />
                ))}
                {provided.placeholder}
              </motion.div>
            )}
          </Droppable>

          <Droppable droppableId="charts" type="CHART">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {chartLayout.map((chart, index) => (
                  <ChartSection 
                    key={chart.id}
                    chartId={chart.id}
                    index={index}
                    sentimentData={sentimentData}
                    pieData={pieData}
                    emotionsBreakdownData={emotionsBreakdownData}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
