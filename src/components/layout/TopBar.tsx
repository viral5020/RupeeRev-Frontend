import React from 'react';
import { AppBar, Badge, Box, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../context/AuthContext';
import NotificationDrawer from '../notifications/NotificationDrawer';

interface TopBarProps {
    drawerWidth: number;
    handleDrawerToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ drawerWidth, handleDrawerToggle }) => {
    const { data, refetch } = useNotifications();
    const unread = data?.filter((n) => !n.read).length || 0;
    const { user, logout } = useAuth();
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                ml: { xs: 0, md: `${drawerWidth}px` },
                bgcolor: 'white',
                color: 'text.primary',
                boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    RupeeRev
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {!isMobile && (
                        <Typography variant="body1" sx={{ mr: 1, fontWeight: 500 }}>
                            {user?.name}
                        </Typography>
                    )}
                    <IconButton
                        onClick={() => setOpen(true)}
                        sx={{
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        <Badge badgeContent={unread} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton
                        onClick={logout}
                        sx={{
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        <ExitToAppIcon />
                    </IconButton>
                </Box>
            </Toolbar>
            <NotificationDrawer open={open} onClose={() => setOpen(false)} notifications={data || []} onRefresh={refetch} />
        </AppBar>
    );
};

export default TopBar;

