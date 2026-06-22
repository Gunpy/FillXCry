/** Row vertical rhythm. Maps to the design's compact (7px) / comfortable (11px) prop. */
export type Density = 'compact' | 'comfortable';

/** Client-side preferences — the only state owned by Redux, persisted to localStorage. */
export interface PreferencesState {
  density: Density;
  vsCurrency: string;
}
