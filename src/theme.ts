import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#6366f1', // Vibrant Indigo
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ec4899', // Vibrant Pink
            light: '#f472b6',
            dark: '#db2777',
            contrastText: '#ffffff',
        },
        success: {
            main: '#10b981', // Vibrant Green
            light: '#34d399',
            dark: '#059669',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#f59e0b', // Vibrant Orange
            light: '#fbbf24',
            dark: '#d97706',
            contrastText: '#ffffff',
        },
        error: {
            main: '#ef4444', // Vibrant Red
            light: '#f87171',
            dark: '#dc2626',
            contrastText: '#ffffff',
        },
        info: {
            main: '#3b82f6', // Vibrant Blue
            light: '#60a5fa',
            dark: '#2563eb',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
        divider: '#e2e8f0',
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        h1: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.02em' },
        h3: { fontWeight: 600, fontSize: '1.75rem', letterSpacing: '-0.02em' },
        h4: { fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em' },
        h5: { fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.01em' },
        h6: { fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em' },
        subtitle1: { fontWeight: 500, fontSize: '1rem' },
        subtitle2: { fontWeight: 500, fontSize: '0.875rem' },
        body1: { fontSize: '0.9375rem', lineHeight: 1.5 },
        body2: { fontSize: '0.875rem', lineHeight: 1.5 },
        button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderRadius: 10,
                    padding: '8px 20px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    },
                },
                outlined: {
                    borderWidth: 2,
                    '&:hover': {
                        borderWidth: 2,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: 16,
                },
                elevation1: {
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    border: '1px solid #e2e8f0',
                },
            },
            defaultProps: {
                elevation: 1,
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: 16,
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '12px 16px',
                    borderBottom: '1px solid #e2e8f0',
                },
                head: {
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
                    color: '#475569',
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: '0.9375rem',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e2e8f0',
                        borderWidth: 2,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6366f1',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6366f1',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    color: '#1e293b',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                    borderBottom: '1px solid #e2e8f0',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                    color: '#ffffff',
                    borderRight: 'none',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 8,
                },
                colorSuccess: {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                },
                colorError: {
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                },
                colorWarning: {
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                },
                colorInfo: {
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                },
            },
        },
    },
});

export default theme;
