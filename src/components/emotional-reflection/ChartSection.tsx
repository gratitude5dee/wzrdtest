import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from "framer-motion";
import { Draggable } from "react-beautiful-dnd";
import { EmotionsBreakdown } from "../charts/EmotionsBreakdown";

interface ChartSectionProps {
  chartId: string;
  index: number;
  sentimentData?: any[];
  pieData?: any[];
  emotionsBreakdownData?: any[];
}

export function ChartSection({ chartId, index, sentimentData, pieData, emotionsBreakdownData }: ChartSectionProps) {
  return (
    <Draggable draggableId={chartId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "transition-transform duration-300",
            snapshot.isDragging && "scale-105"
          )}
        >
          {chartId === "sentiment-time" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sentiment over time</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="neutral" stroke="#94A3B8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {chartId === "sentiment-proportions" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Daily sentiment proportions</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {chartId === "emotions-breakdown" && (
            <EmotionsBreakdown data={emotionsBreakdownData} />
          )}
        </div>
      )}
    </Draggable>
  );
}