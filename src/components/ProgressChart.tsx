import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProgressChartProps {
  labels: string[];
  data: number[];
  title?: string;
  height?: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  labels,
  data,
  title = '',
  height = 300,
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: 'rgba(63, 81, 181, 0.7)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: !!title, text: title },
    },
  };

  return (
    <div style={{ height, position: 'relative' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ProgressChart;