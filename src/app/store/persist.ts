import type { Density, PreferencesState } from '@/entities/preferences';
import type { AppStore } from './store';

const STORAGE_KEY = 'fillxcry.preferences.v1';

const DENSITIES: readonly Density[] = ['compact', 'comfortable'];

function isPreferences(value: unknown): value is PreferencesState {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.density === 'string' &&
    DENSITIES.includes(candidate.density as Density) &&
    typeof candidate.vsCurrency === 'string'
  );
}

/** Read persisted preferences, tolerating absent / malformed storage. */
export function loadPreferences(): PreferencesState | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    return isPreferences(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/** Mirror the preferences slice to localStorage on every change. */
export function persistPreferences(store: AppStore): void {
  store.subscribe(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().preferences));
    } catch {
      // Storage unavailable (private mode / quota) — preferences just won't survive reloads.
    }
  });
}
