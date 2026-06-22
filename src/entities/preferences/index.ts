export {
  preferencesReducer,
  setDensity,
  toggleDensity,
  setVsCurrency,
} from './model/slice';
export { selectDensity, selectVsCurrency } from './model/selectors';
export type { Density, PreferencesState } from './model/types';
