import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color = '#6366f1' }) => {
  return (
    <Card
      sx={{
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.palette.mode === 'light'
            ? `0 12px 20px -10px ${alpha(color, 0.15)}, 0 4px 20px 0 rgba(0, 0, 0, 0.05)`
            : `0 12px 20px -10px ${alpha(color, 0.3)}, 0 4px 20px 0 rgba(0, 0, 0, 0.15)`,
          borderColor: color,
        },
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography 
              color="text.secondary" 
              gutterBottom 
              variant="overline"
              sx={{ 
                fontWeight: 700, 
                letterSpacing: '0.075em',
                fontSize: '0.725rem',
                display: 'block',
                textTransform: 'uppercase'
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                mt: 0.5
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              color: color,
              bgcolor: alpha(color, 0.1),
              borderRadius: '12px',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;