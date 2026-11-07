import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/useAppContext';
import { Card } from '../ui/Card';
import { BottomBar } from './BottomBar';
import { TopBar } from './TopBar';

export function AppLayout() {
  const { dict, loading, errorMessage, reload } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  const isDetailPage = location.pathname.startsWith('/produk/');
  const detailSku = isDetailPage
    ? decodeURIComponent(location.pathname.replace('/produk/', ''))
    : '';

  const pageTitle = isDetailPage
    ? detailSku
    : location.pathname.startsWith('/daftar-harga')
      ? dict.priceList.title
      : location.pathname.startsWith('/stok')
        ? dict.stock.title
        : dict.summary.title;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/daftar-harga');
    }
  };

  return (
    <div className="min-h-dvh bg-slate-100 text-slate-900">
      <TopBar
        title={pageTitle}
        onBack={isDetailPage ? handleBack : undefined}
        backLabel={dict.detail.back}
      />

      <main className="w-full pb-20">
        {loading ? (
          <Card>
            <p className="text-sm text-slate-500 text-center py-8">
              {dict.common.loading}
            </p>
          </Card>
        ) : errorMessage ? (
          <div className="px-4">
            <Card variant="rounded">
              <div className="space-y-3 py-2 text-center">
                <p className="text-sm font-semibold text-rose-600">
                  {dict.common.errorTitle}
                </p>
                <p className="text-xs text-slate-500 break-words">
                  {errorMessage}
                </p>
                <button
                  type="button"
                  onClick={reload}
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {dict.common.retry}
                </button>
              </div>
            </Card>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <BottomBar />
    </div>
  );
}
