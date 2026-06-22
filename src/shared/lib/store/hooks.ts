import { useDispatch, useSelector } from 'react-redux';
// Type-only import of the store's inferred types. These are erased at build time, so this
// introduces no runtime dependency on the app layer — it only lets shared expose the typed
// hooks that CLAUDE.md §5 mandates living here.
import type { AppDispatch, RootState } from '@/app/store/store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
