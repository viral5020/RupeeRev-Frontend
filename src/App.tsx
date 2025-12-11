import React from 'react';
import AppRouter from './router/AppRouter';
import './App.css';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import ChatbotWidget from './components/Chatbot/ChatbotWidget';
import ReviewPromptDialog from './components/dialogs/ReviewPromptDialog';

const App: React.FC = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
        <ChatbotWidget />
        <ReviewPromptDialog />
    </ThemeProvider>
);

export default App;

