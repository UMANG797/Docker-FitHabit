import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function StreakChart({ habits }) {
  // show bestStreak per habit for a simple chart
  const labels = habits.map(h => h.title);
  const data = {
    labels,
    datasets: [{
      label: 'Best Streak (days)',
      data: habits.map(h => h.bestStreak || 0),
      tension: 0.3,
      borderWidth: 2
    }]
  };
  return (
    <div style={{marginTop:20, maxWidth:700}}>
      <Line data={data} />
    </div>
  );
}
