import React, { ReactElement, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from 'recharts';

type Props = {
  playerAnswers: string[];
  options: string[];
};

const barColors = ['#ef4444', '#3b82f6', '#facc15', '#22c55e'];

export default function PlayerAnswersGraph({ playerAnswers, options }: Props): ReactElement {
  const data = useMemo(() => {
    if (options) {
      const counts: Record<string, number> = {};
      options.forEach((option) => (counts[option] = 0));
      playerAnswers.forEach((answer) => {
        if (counts.hasOwnProperty(answer)) {
          counts[answer]++;
        }
      });
      return options.map((option) => ({
        option,
        count: counts[option],
      }));
    }
  }, [playerAnswers, options]);

  return (
    <ResponsiveContainer width='100%' height={options.length * 80}>
      <BarChart
        layout='vertical' // ✅ Vertical layout for better label space
        data={data}
        margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis type='number' allowDecimals={false} />
        <YAxis
          type='category'
          dataKey='option'
          tick={({ x, y, payload }) => {
            const lines = payload.value.split(' ').map((word, i) => (
              <tspan key={i} x={x} dy={i === 0 ? 0 : 14}>
                {word}
              </tspan>
            ));
            return (
              <text x={x} y={y} dy={4} textAnchor='end' fill='#666'>
                {lines}
              </text>
            );
          }}
        />
        <Tooltip />
        <Bar dataKey='count' barSize={30}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={barColors[index] || '#8884d8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
