import React from 'react';
import { Box, Typography } from '@mui/material';

interface LogoProps {
  variant?: 'light' | 'dark' | 'color';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ variant = 'color', size = 'medium', showText = true }) => {
  const getLogoSize = () => {
    switch (size) {
      case 'small': return { width: 28, height: 28, fontSize: '1.1rem' };
      case 'large': return { width: 48, height: 48, fontSize: '1.8rem' };
      default: return { width: 36, height: 36, fontSize: '1.4rem' };
    }
  };

  const dims = getLogoSize();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {/* SVG Icon */}
      <svg
        width={dims.width}
        height={dims.height}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#logo-grad)" />
        {/* Checkmark icon + progress ring */}
        <circle cx="16" cy="16" r="8" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="30 15" strokeLinecap="round" />
        <path d="M12 16L15 19L20 13" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {showText && (
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontWeight: 800,
            fontSize: dims.fontSize,
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            letterSpacing: '-0.025em',
            background: variant === 'color' 
              ? 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' 
              : 'none',
            WebkitBackgroundClip: variant === 'color' ? 'text' : 'unset',
            WebkitTextFillColor: variant === 'color' ? 'transparent' : 'unset',
            color: variant === 'light' ? '#ffffff' : (variant === 'dark' ? '#0f172a' : 'inherit'),
          }}
        >
          PrepT<span style={{ fontWeight: 400, opacity: 0.85 }}>racker</span>
        </Typography>
      )}
    </Box>
  );
};

export default Logo;
