import { Card } from "@/components/ui/card";
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, BarChart, Bar } from 'recharts';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmotionCard {
  label: string;
  value: string;
  change: string;
  color: string;
}

export function EmotionalReflectionDashboard() {
  const emotionCards: EmotionCard[] = [
    { label: "neutral", value: "0.94%", change: "0% from yesterday", color: "bg-orange-400" },
    { label: "curiosity", value: "0.03%", change: "0% from yesterday", color: "bg-orange-400" },
    { label: "null", value: "0%", change: "0% from yesterday", color: "bg-purple-500" },
    { label: "null", value: "0%", change: "0% from yesterday", color: "bg-purple-500" },
  ];

  const sentimentData = [
    { date: '2024-11-20', positive: 0, neutral: 0.8, negative: 0.2 },
  ];

  const pieData = [
    { name: 'Neutral', value: 97, color: '#D3D3D3' },
    { name: 'Positive', value: 2, color: '#4CAF50' },
    { name: 'Negative', value: 1, color: '#FF5252' },
  ];

  const barData = [
    { name: 'Emotion 1', value: 0.9 },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
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
              card.color,
              "text-white"
            )}>
              <div className="space-y-2">
                <h3 className="text-sm font-medium opacity-80">{card.label}</h3>
                <p className="text-3xl font-bold">{card.value}</p>
                <p className="text-sm opacity-80 flex items-center gap-1">
                  <span>↗</span> {card.change}
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
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4">Sentiment over time</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="positive" stroke="#4CAF50" />
                <Line type="monotone" dataKey="neutral" stroke="#9E9E9E" />
                <Line type="monotone" dataKey="negative" stroke="#FF5252" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4">Daily sentiment proportions</h2>
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-4">A breakdown of the day's top 10 emotions</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FFA726" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}