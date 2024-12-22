import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Draggable } from "react-beautiful-dnd";

interface EmotionCard {
  id: string;
  label: string;
  value: string;
  change: string;
  color: string;
  trend: "up" | "down" | "neutral";
}

interface EmotionCardProps {
  card: EmotionCard;
  index: number;
}

export function EmotionCard({ card, index }: EmotionCardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="h-full"
        >
          <Card className={cn(
            "p-6 relative overflow-hidden group transition-all duration-300",
            "hover:shadow-lg hover:-translate-y-1",
            "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm",
            "border border-white/20 dark:border-gray-700/20",
            "cursor-grab active:cursor-grabbing",
            snapshot.isDragging && "shadow-2xl scale-105"
          )}>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.label}</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className={cn(
                "text-sm flex items-center gap-1",
                card.trend === "up" ? "text-green-600 dark:text-green-400" : 
                card.trend === "down" ? "text-red-600 dark:text-red-400" : 
                "text-gray-600 dark:text-gray-400"
              )}>
                {card.trend === "up" ? "↗" : "↘"} {card.change}
              </p>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
}