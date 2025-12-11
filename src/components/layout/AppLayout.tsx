import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const drawerWidth = 260;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <TopBar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
            <Sidebar drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 }, mt: 8 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default AppLayout;
