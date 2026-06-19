import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, actions }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Box sx={{ mb: 4 }}>
      {/* Dynamic Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.secondary', opacity: 0.5 }} />} 
        aria-label="breadcrumb"
        sx={{ mb: 1 }}
      >
        <Link 
          component={RouterLink} 
          underline="hover" 
          color="text.secondary" 
          to="/"
          sx={{ fontSize: '0.85rem', fontWeight: 500 }}
        >
          Home
        </Link>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const formattedName = name
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          return isLast ? (
            <Typography 
              key={name} 
              color="text.primary"
              sx={{ fontSize: '0.85rem', fontWeight: 600 }}
            >
              {formattedName}
            </Typography>
          ) : (
            <Link 
              key={name}
              component={RouterLink} 
              underline="hover" 
              color="text.secondary" 
              to={routeTo}
              sx={{ fontSize: '0.85rem', fontWeight: 500 }}
            >
              {formattedName}
            </Link>
          );
        })}
      </Breadcrumbs>

      {/* Main Title & Action Row */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 800,
            color: 'text.primary',
            letterSpacing: '-0.025em',
            fontSize: { xs: '1.75rem', sm: '2.25rem' }
          }}
        >
          {title}
        </Typography>
        {actions && <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>{actions}</Box>}
      </Box>
    </Box>
  );
};

export default Header;