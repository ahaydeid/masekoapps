import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';

export function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  const getPageTitle = () => {
    if (location.pathname.startsWith('/admin/edit')) return 'Edit Produk';
    if (location.pathname.startsWith('/admin/tambah')) return 'Tambah Produk Baru';
    return 'Produk';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex">
      {/* Sidebar Persistent Terbuka */}
      <AdminSidebar
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Area Konten Utama di Samping Kanan (Full Width) */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <AdminTopBar
          title={getPageTitle()}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 w-full px-4 md:px-6 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
