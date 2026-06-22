import { Routes, Route } from 'react-router-dom';
import { MarketPage } from '@/pages/market';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<MarketPage />} />
    </Routes>
  );
}
