export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1';

export const DRAWER_WIDTH = 240;

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: 'Dashboard' },
  { label: 'Resources', path: '/resources', icon: 'LibraryBooks' },
  { label: 'Plans', path: '/plans', icon: 'Assignment' },
  { label: 'Study Sessions', path: '/study-sessions', icon: 'School' },
  { label: 'Certifications', path: '/certifications', icon: 'VerifiedUser' },
  { label: 'Goals', path: '/goals', icon: 'Flag' },
  { label: 'Roadmaps', path: '/roadmaps', icon: 'Map' },
  { label: 'Notes', path: '/notes', icon: 'Note' },
  { label: 'Revisions', path: '/revisions', icon: 'Refresh' },
  { label: 'Interview Prep', path: '/interview-topics', icon: 'Psychology' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart' },
  { label: 'Profile', path: '/profile', icon: 'Person' },
];