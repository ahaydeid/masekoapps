import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { AppProvider } from './context/AppProvider';
import { PriceListPage } from './pages/PriceListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { StockPage } from './pages/StockPage';
import { SummaryPage } from './pages/SummaryPage';
import { AdminProductListPage } from './pages/admin/AdminProductListPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Rute Atasan (Tidak Disentuh / Tetap Memakai AppLayout & BottomBar) */}
          <Route element={<AppLayout />}>
            <Route index element={<SummaryPage />} />
            <Route path="daftar-harga" element={<PriceListPage />} />
            <Route path="stok" element={<StockPage />} />
            <Route path="produk/:noSeri" element={<ProductDetailPage />} />
          </Route>

          {/* Rute Admin (Layout Terpisah dengan Sidebar Persistent, Form CRUD Berbasis Modal) */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminProductListPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
