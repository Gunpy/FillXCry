import { useCallback } from 'react';
import { selectDensity, setDensity, type Density } from '@/entities/preferences';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';

interface DensityControl {
  density: Density;
  choose: (density: Density) => void;
}

export function useDensity(): DensityControl {
  const density = useAppSelector(selectDensity);
  const dispatch = useAppDispatch();
  const choose = useCallback((next: Density) => dispatch(setDensity(next)), [dispatch]);
  return { density, choose };
}
