import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery, useTheme, Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import PaymentsIcon from '@mui/icons-material/PaymentsOutlined';
import SavingsIcon from '@mui/icons-material/SavingsOutlined';
import PieChartIcon from '@mui/icons-material/PieChartOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUpOutlined';
import ShowChartIcon from '@mui/icons-material/ShowChartOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

const menu = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { label: 'Transactions', icon: <PaymentsIcon />, path: '/transactions' },
    { label: 'Goals', icon: <SavingsIcon />, path: '/goals' },
    { label: 'Investments', icon: <PieChartIcon />, path: '/investments' },
    { label: 'Stocks', icon: <TrendingUpIcon />, path: '/stocks' },
    { label: 'IPOs', icon: <ShowChartIcon />, path: '/ipos' },
    { label: 'Salary Planner', icon: <AccountBalanceWalletIcon />, path: '/salary-planner' },
];

interface SidebarProps {
    drawerWidth: number;
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) {
            handleDrawerToggle();
        }
    };

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff', borderRight: '1px solid #f1f5f9' }}>
            <Toolbar sx={{
                display: 'flex',
                alignItems: 'center',
                px: 3,
                py: 2,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                    }}>
                        ₹
                    </Box>
                    <Typography variant="h6" sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.5px',
                    }}>
                        RupeeRev
                    </Typography>
                </Box>
            </Toolbar>

            <List sx={{ px: 2, py: 2 }}>
                <Typography variant="caption" sx={{ px: 2, py: 1, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Menu
                </Typography>
                {menu.map((item) => {
                    const isSelected = location.pathname === item.path;
                    return (
                        <ListItemButton
                            key={item.path}
                            selected={isSelected}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                mb: 0.5,
                                py: 1.5,
                                px: 2,
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: '#f8fafc',
                                    transform: 'translateX(4px)',
                                },
                                '&.Mui-selected': {
                                    backgroundColor: '#eff6ff',
                                    '&:hover': {
                                        backgroundColor: '#eff6ff',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{
                                minWidth: 40,
                                color: isSelected ? '#6366f1' : '#64748b',
                                transition: 'color 0.2s ease',
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        color: isSelected ? '#1e293b' : '#64748b',
                                        fontWeight: isSelected ? 600 : 500,
                                        fontSize: '0.95rem',
                                    },
                                }}
                            />
                            {isSelected && (
                                <Box sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: '#6366f1',
                                    ml: 1
                                }} />
                            )}
                        </ListItemButton>
                    );
                })}
            </List>

            <Box sx={{ mt: 'auto', p: 3 }}>
                <Box sx={{
                    p: 2,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Upgrade to Pro
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ opacity: 0.9, mb: 1.5 }}>
                        Get AI insights & more
                    </Typography>
                    <Box
                        component="button"
                        onClick={() => handleNavigation('/pricing')}
                        sx={{
                            width: '100%',
                            py: 0.8,
                            borderRadius: '8px',
                            border: 'none',
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'bgcolor 0.2s',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.3)',
                            }
                        }}
                    >
                        View Plans
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none' },
                }}
            >
                {drawerContent}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none' },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;
