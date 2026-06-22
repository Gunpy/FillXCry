import { configureStore } from '@reduxjs/toolkit';
import { preferencesReducer } from '@/entities/preferences';
import { loadPreferences } from './persist';

export function createStore() {
  const persisted = loadPreferences();
  return configureStore({
    reducer: { preferences: preferencesReducer },
    preloadedState: persisted ? { preferences: persisted } : undefined,
  });
}

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
