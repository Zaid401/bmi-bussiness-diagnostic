import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import type { ReportData } from '../../lib/reportSchema'

interface CategoryBarsProps {
  categories: ReportData['categories']
  variant?: 'bar' | 'radar'
}

export default function CategoryBars({
  categories,
  variant = 'bar',
}: CategoryBarsProps) {
  const chartData = Object.entries(categories).map(([name, score]) => ({
    name,
    score,
  }))

  if (variant === 'radar') {
    return (
      <div className="h-80 w-full sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} outerRadius="70%">
            <PolarGrid />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#4b5563' }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#4f46e5"
              fill="#4f46e5"
              fillOpacity={0.35}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="h-80 w-full sm:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={130}
            tick={{ fontSize: 11, fill: '#4b5563' }}
          />
          <Tooltip />
          <Bar dataKey="score" fill="#4f46e5" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
