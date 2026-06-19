import React, { useState } from 'react';
import { Container, Typography, Paper, Grid, Box } from '@mui/material';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import ProgressChart from '../components/ProgressChart';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

const Analytics: React.FC = () => {
  const [weeklyLabels] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [weeklyData] = useState([2.5, 3.0, 1.5, 4.0, 2.0, 3.5, 1.0]);

  const [monthlyLabels] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
  const [monthlyProgress] = useState([30, 45, 55, 60, 75, 85]);

  const topicDistributionData = {
    labels: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Other'],
    datasets: [{
      data: [25, 20, 15, 18, 12, 10],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF'],
    }],
  };

  const monthlyChartData = {
    labels: monthlyLabels,
    datasets: [{
      label: 'Progress %',
      data: monthlyProgress,
      borderColor: 'rgb(63, 81, 181)',
      backgroundColor: 'rgba(63, 81, 181, 0.5)',
      tension: 0.3,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const } },
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Analytics</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Weekly Study Hours</Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={{
                  labels: weeklyLabels,
                  datasets: [{
                    label: 'Hours',
                    data: weeklyData,
                    backgroundColor: 'rgba(63, 81, 181, 0.7)',
                    borderColor: 'rgba(63, 81, 181, 1)',
                    borderWidth: 1,
                  }],
                }}
                options={chartOptions}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Topic Distribution</Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Doughnut data={topicDistributionData} options={{ ...chartOptions, maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Monthly Progress</Typography>
            <Box sx={{ height: 300 }}>
              <Line data={monthlyChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;