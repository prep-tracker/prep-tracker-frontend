import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FlagIcon from '@mui/icons-material/Flag';
import MapIcon from '@mui/icons-material/Map';
import NoteIcon from '@mui/icons-material/Note';
import RefreshIcon from '@mui/icons-material/Refresh';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import Logo from './Logo';
import { useAppSelector } from '../store';

const iconMap: Record<string, React.ReactElement> = {
  Dashboard: <DashboardIcon />,
  LibraryBooks: <LibraryBooksIcon />,
  Assignment: <AssignmentIcon />,
  School: <SchoolIcon />,
  VerifiedUser: <VerifiedUserIcon />,
  Flag: <FlagIcon />,
  Map: <MapIcon />,
  Note: <NoteIcon />,
  Refresh: <RefreshIcon />,
  Psychology: <PsychologyIcon />,
  BarChart: <BarChartIcon />,
  Person: <PersonIcon />,
  Payment: <PaymentIcon />,
};

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: 'Dashboard' },
  { label: 'Resources', path: '/resources', icon: 'LibraryBooks' },
  { label: 'Plans', path: '/plans', icon: 'Assignment' },
  { label: 'Study Sessions', path: '/study-sessions', icon: 'School' }, // Fixed `/sessions` -> `/study-sessions` route bug
  { label: 'Certifications', path: '/certifications', icon: 'VerifiedUser' },
  { label: 'Goals', path: '/goals', icon: 'Flag' },
  { label: 'Roadmaps', path: '/roadmaps', icon: 'Map' },
  { label: 'Notes', path: '/notes', icon: 'Note' },
  { label: 'Revisions', path: '/revisions', icon: 'Refresh' },
  { label: 'Interview Prep', path: '/interview-topics', icon: 'Psychology' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart' },
  { label: 'Profile', path: '/profile', icon: 'Person' },
  { label: 'Subscription', path: '/subscription', icon: 'Payment' },
];

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleItemClick = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sidebar Header with Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 64 }}>
        <Logo variant="light" size="medium" />
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Navigation List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 1 }}>
        <List sx={{ px: 0 }}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={active}
                  onClick={() => handleItemClick(item.path)}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {iconMap[item.icon]}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                      fontSize: '0.925rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Info Container at the Bottom */}
      <Box sx={{ p: 2 }}>
        <Box 
          sx={{ 
            p: 1.5, 
            borderRadius: '10px', 
            bgcolor: 'rgba(255, 255, 255, 0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: '#ffffff'
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Box>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: '#ffffff', fontSize: '0.85rem' }}>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: '#9ca3af', display: 'block', fontSize: '0.75rem' }}>
              {user?.email || 'user@example.com'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;