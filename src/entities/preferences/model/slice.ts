import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_VS_CURRENCY } from '@/shared/config/api';
import type { Density, PreferencesState } from './types';

const initialState: PreferencesState = {
  density: 'compact',
  vsCurrency: DEFAULT_VS_CURRENCY,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setDensity(state, action: PayloadAction<Density>) {
      state.density = action.payload;
    },
    toggleDensity(state) {
      state.density = state.density === 'compact' ? 'comfortable' : 'compact';
    },
    setVsCurrency(state, action: PayloadAction<string>) {
      state.vsCurrency = action.payload;
    },
  },
});

export const { setDensity, toggleDensity, setVsCurrency } = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
