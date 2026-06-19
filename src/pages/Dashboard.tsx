import React, { useEffect } from 'react';
import { Container, Grid, Typography, Paper, List, ListItem, ListItemText, Box, Chip, ListItemIcon } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchDashboardStats } from '../store/dashboardSlice';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { stats } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const mockStats = {
    totalStudyHours: 42,
    activePlans: 5,
    upcomingCerts: 3,
    currentStreak: 7,
  };

  const mockRecentActivity = [
    { id: 1, action: 'Study Session', description: 'Completed React Advanced Patterns', timestamp: new Date().toISOString() },
    { id: 2, action: 'Goal Achieved', description: 'Completed AWS Solutions Architect prep', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, action: 'Plan Created', description: 'New plan: Kubernetes Certification', timestamp: new Date(Date.now() - 172800000).toISOString() },
  ];

  const mockUpcomingDeadlines = [
    { id: 1, title: 'AWS Solutions Architect Exam', dueDate: new Date(Date.now() + 604800000).toISOString(), type: 'certification' },
    { id: 2, title: 'Complete Docker Course', dueDate: new Date(Date.now() + 1209600000).toISOString(), type: 'goal' },
  ];

  const displayStats = stats
    ? {
        totalStudyHours: stats.totalStudyHoursWeek,
        activePlans: stats.activePlansCount,
        upcomingCerts: stats.upcomingCertifications.length,
        currentStreak: stats.learningStreak,
      }
    : mockStats;

  const displayActivity = stats?.recentStudySessions?.length
    ? stats.recentStudySessions.map((session) => ({
        id: session.id,
        action: 'Study Session',
        description: `Studied: ${session.topicCovered} (${session.durationMinutes} mins)`,
      }))
    : mockRecentActivity;

  const displayDeadlines = stats?.upcomingCertifications?.length
    ? stats.upcomingCertifications.map((cert) => ({
        id: cert.id,
        title: cert.name,
        dueDate: cert.targetDate || cert.examDate || new Date().toISOString(),
        type: 'certification',
      }))
    : mockUpcomingDeadlines;

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Dynamic Breadcrumbs & Title */}
      <Header title="Dashboard" />

      {/* Welcome Message */}
      <Box sx={{ mb: 4, mt: -1 }}>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <AutoAwesomeIcon sx={{ color: 'warning.main', fontSize: '1.25rem' }} />
          Welcome back, {user?.fullName || user?.username || 'Learner'}! Here's your study progress today.
        </Typography>
      </Box>

      {/* Grid container for Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Study Hours"
            value={`${displayStats.totalStudyHours}h`}
            icon={<AccessTimeIcon fontSize="medium" />}
            color="#6366f1" // Indigo
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Plans"
            value={displayStats.activePlans}
            icon={<AssignmentTurnedInIcon fontSize="medium" />}
            color="#10b981" // Emerald/Green
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Upcoming Certs"
            value={displayStats.upcomingCerts}
            icon={<SchoolIcon fontSize="medium" />}
            color="#06b6d4" // Cyan/Blue
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Day Streak"
            value={`${displayStats.currentStreak} days`}
            icon={<WhatshotIcon fontSize="medium" />}
            color="#f43f5e" // Rose/Red
          />
        </Grid>
      </Grid>

      {/* Bottom panels: Activity and Deadlines */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              Recent Activity
            </Typography>
            <List>
              {displayActivity.map((activity, idx) => (
                <ListItem 
                  key={activity.id} 
                  divider={idx < displayActivity.length - 1}
                  sx={{ px: 0, py: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <AccessTimeIcon sx={{ color: 'primary.main', opacity: 0.8 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.action}
                    secondary={activity.description}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.925rem' }}
                    secondaryTypographyProps={{ fontSize: '0.85rem' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              Upcoming Deadlines
            </Typography>
            <List>
              {displayDeadlines.map((deadline, idx) => (
                <ListItem 
                  key={deadline.id} 
                  divider={idx < displayDeadlines.length - 1}
                  sx={{ px: 0, py: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CalendarMonthIcon sx={{ color: 'secondary.main', opacity: 0.8 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={deadline.title}
                    secondary={`Due: ${new Date(deadline.dueDate).toLocaleDateString()}`}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.925rem' }}
                    secondaryTypographyProps={{ fontSize: '0.85rem' }}
                  />
                  <Chip 
                    label={deadline.type} 
                    size="small" 
                    sx={{ 
                      fontWeight: 600, 
                      textTransform: 'uppercase',
                      fontSize: '0.7rem',
                      borderRadius: '6px',
                      color: 'primary.contrastText',
                      bgcolor: 'primary.light'
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;