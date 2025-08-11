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

// PROPS TYPE DEFINITIONS
type Props = {
  playerAnswers: string[];
  options: string[];
};

// COLOR MAPPING FOR EACH BAR
const barColors = ['#ef4444', '#3b82f6', '#facc15', '#22c55e'];

export default function PlayerAnswerGraph({
  playerAnswers,
  options,
}: Props): ReactElement | undefined {
  // BUILD THE DATA ARRAY BASED ON PLAYER ANSWERS
  const data = useMemo(() => {
    // PLAYER ANSWERS IS UNDEFINED
    const counts: Record<string, number> = {};
    options.forEach((option) => (counts[option] = 0));
    playerAnswers.forEach((answer) => {
      if (counts.hasOwnProperty(answer)) {
        counts[answer] += 1;
      }
    });
    return options.map((option) => ({
      option,
      count: counts[option],
    }));
  }, [playerAnswers, options]);

  // RENDER COMPONENT
  return (
    // RESPONSIVE CONTAINER WITH DYNAMIC HEIGHT BASED ON OPTION COUNT
    <ResponsiveContainer width='100%' height={options.length * 80}>
      <BarChart
        layout='vertical' // MAKE BARS GO HORIZONTALLY
        data={data}
        margin={{ top: 20, right: 130, left: 130, bottom: 20 }}
      >
        {/* GRID BEHIND THE BARS */}
        <CartesianGrid stroke='white' strokeDasharray='3 3' />

        {/* X AXIS FOR NUMERIC COUNTS */}
        <XAxis
          type='number'
          allowDecimals={false}
          stroke='white' // AXIS LINE AND TICKS
          tick={{ fill: 'black', fontSize: 18 }} // TICK LABELS
        />

        {/* Y AXIS FOR OPTION LABELS WITH WORD WRAPPING */}
        <YAxis
          type='category'
          dataKey='option'
          width={200}
          tick={{
            fill: 'white',
            fontSize: 18,
            textAnchor: 'end',
          }}
        />

        {/* HOVER TOOLTIP */}
        <Tooltip />

        {/* BAR ELEMENTS WITH COLOR MAPPING */}
        <Bar dataKey='count' barSize={30}>
          {data!.map((_, index) => (
            <Cell key={`cell-${index}`} fill={barColors[index] || '#FFFFFFFF'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
