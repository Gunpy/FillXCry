import type { Density, PreferencesState } from './types';

// Selectors stay slice-local: they accept only the shape they read, never the app-composed
// RootState. RootState is structurally assignable to this, so useAppSelector(selectDensity)
// still type-checks — without an entities → app upward import or an app↔entities cycle.
interface WithPreferences {
  preferences: PreferencesState;
}

export const selectDensity = (state: WithPreferences): Density => state.preferences.density;

export const selectVsCurrency = (state: WithPreferences): string =>
  state.preferences.vsCurrency;
