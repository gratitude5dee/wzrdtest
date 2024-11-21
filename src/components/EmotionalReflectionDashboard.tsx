import { Card } from "@/components/ui/card";
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, BarChart, Bar } from 'recharts';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface EmotionCard {
  label: string;
  value: string;
  change: string;
  color: string;
  trend: "up" | "down" | "neutral";
}

export function EmotionalReflectionDashboard() {
  const navigate = useNavigate();
  
  const emotionCards: EmotionCard[] = [
    { label: "Joy", value: "28.8%", change: "+28% from yesterday", color: "bg-orange-400", trend: "up" },
    { label: "Surprise", value: "19.2%", change: "-12% from yesterday", color: "bg-orange-400", trend: "down" },
    { label: "Anger", value: "12.1%", change: "+69% from yesterday", color: "bg-purple-500", trend: "up" },
    { label: "Fear", value: "5.9%", change: "-52% from yesterday", color: "bg-purple-500", trend: "down" },
  ];

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
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {emotionCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "p-6 relative overflow-hidden group transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1",
                "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm",
                "border border-white/20 dark:border-gray-700/20"
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
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    {pieData.map((entry, index) => (
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
        </div>
      </div>
    </div>
  );
}