import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AppProvider } from './context/AppProvider';
import { PriceListPage } from './pages/PriceListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { StockPage } from './pages/StockPage';
import { SummaryPage } from './pages/SummaryPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<SummaryPage />} />
            <Route path="daftar-harga" element={<PriceListPage />} />
            <Route path="stok" element={<StockPage />} />
            <Route path="produk/:noSeri" element={<ProductDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
