'use client';

import { SessionProvider } from 'next-auth/react';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from '@/lib/store/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider >
      <Provider store={store}>
        <CssBaseline />
        {children}
      </Provider>
    </SessionProvider>

  );
}