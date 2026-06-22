import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './StoreProvider';
import { QueryProvider } from './QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <QueryProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryProvider>
    </StoreProvider>
  );
}
