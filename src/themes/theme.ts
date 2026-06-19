import { ThemeOptions } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const getThemeConfig = (mode: 'light' | 'dark'): ThemeOptions => {
  const isLight = mode === 'light';

  return {
    palette: {
      mode,
      primary: {
        main: isLight ? '#4f46e5' : '#6366f1', // Indigo
        light: isLight ? '#6366f1' : '#818cf8',
        dark: isLight ? '#3730a3' : '#4338ca',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isLight ? '#db2777' : '#ec4899', // Pink/Rose
        light: isLight ? '#f472b6' : '#f472b6',
        dark: isLight ? '#be185d' : '#db2777',
      },
      background: {
        default: isLight ? '#f8fafc' : '#090d16', // Slate 50 vs Deep Dark
        paper: isLight ? '#ffffff' : '#111827',   // White vs Gray 900
      },
      text: {
        primary: isLight ? '#0f172a' : '#f3f4f6',   // Slate 900 vs Gray 100
        secondary: isLight ? '#475569' : '#9ca3af', // Slate 600 vs Gray 400
      },
      divider: isLight ? '#e2e8f0' : '#1f2937',      // Slate 200 vs Gray 800
      success: {
        main: '#10b981', // Emerald
      },
      warning: {
        main: '#f59e0b', // Amber
      },
      error: {
        main: '#ef4444', // Red
      },
      info: {
        main: '#06b6d4', // Cyan
      },
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.025em' },
      h2: { fontWeight: 800, letterSpacing: '-0.025em' },
      h3: { fontWeight: 700, letterSpacing: '-0.025em' },
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600 },
      subtitle1: { letterSpacing: '-0.01em' },
      body1: { letterSpacing: '-0.01em' },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 18px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            background: isLight 
              ? 'linear-gradient(to right, #4f46e5, #5f55ed)' 
              : 'linear-gradient(to right, #6366f1, #7c7fed)',
            '&:hover': {
              background: isLight 
                ? 'linear-gradient(to right, #4338ca, #4f46e5)' 
                : 'linear-gradient(to right, #4f46e5, #6366f1)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: isLight ? '1px solid #e2e8f0' : '1px solid #1f2937',
            boxShadow: isLight 
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -2px rgba(0, 0, 0, 0.15)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: '12px',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? '#cbd5e1' : '#374151',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? '#94a3b8' : '#4b5563',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(17, 24, 39, 0.8)',
            color: isLight ? '#0f172a' : '#f3f4f6',
            backdropFilter: 'blur(12px)',
            borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid #1f2937',
            boxShadow: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight ? '#0f172a' : '#0d121f', // Keep sidebar dark in both for professional SaaS feel
            color: '#f3f4f6',
            borderRight: '1px solid #1f2937',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            margin: '4px 12px',
            color: '#9ca3af',
            transition: 'all 0.15s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              '& .MuiListItemIcon-root': {
                color: '#ffffff',
              },
            },
            '&.Mui-selected': {
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              '& .MuiListItemIcon-root': {
                color: '#ffffff',
              },
              '&:hover': {
                backgroundColor: '#4338ca',
              },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: '#9ca3af',
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            border: isLight ? '1px solid #e2e8f0' : '1px solid #1f2937',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: isLight ? '#f8fafc' : '#1f2937',
              borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid #1f2937',
            },
            '& .MuiDataGrid-cell': {
              borderColor: isLight ? '#e2e8f0' : '#1f2937',
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: isLight ? '#e2e8f0' : '#1f2937',
            },
          },
        },
      },
    },
  };
};

const defaultTheme = getThemeConfig('light');
export default defaultTheme;