import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";

interface EmotionsBreakdownProps {
  data: { emotion: string; value: number }[];
}

export function EmotionsBreakdown({ data }: EmotionsBreakdownProps) {
  return (
    <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 dark:border-gray-700/20">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">A breakdown of the day's top 10 emotions</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 1]} />
            <YAxis dataKey="emotion" type="category" width={100} />
            <Tooltip
              formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}