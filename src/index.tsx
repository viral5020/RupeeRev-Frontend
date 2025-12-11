import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { FilterProvider } from './context/FilterContext';


const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={3} autoHideDuration={4000}>
        <AuthProvider>
          <FilterProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </FilterProvider>
        </AuthProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

