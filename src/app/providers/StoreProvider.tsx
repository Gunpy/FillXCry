import { useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '@/app/store/store';
import { persistPreferences } from '@/app/store/persist';

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [store] = useState(() => {
    const created = createStore();
    persistPreferences(created);
    return created;
  });

  return <Provider store={store}>{children}</Provider>;
}
