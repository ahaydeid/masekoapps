import { FiPackage, FiArrowLeft, FiX } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

interface AdminSidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({ isOpenMobile, onCloseMobile }: AdminSidebarProps) {
  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Header Sidebar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Admin</h2>
        </div>
        {/* Tombol tutup khusus tampilan mobile */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Tutup menu"
          className="p-1.5 text-slate-400 hover:text-slate-700 md:hidden rounded-lg transition-colors cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Navigasi Utama: Hanya Kelola Produk */}
      <nav className="flex-1 pr-3 py-4 space-y-1 overflow-y-auto">
        <NavLink
          to="/admin"
          end
          onClick={onCloseMobile}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-r-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`
          }
        >
          <FiPackage className="w-4 h-4 shrink-0" />
          <span>Kelola Produk</span>
        </NavLink>
      </nav>

      {/* Footer Sidebar: Link Balik ke Mode Atasan */}
      <div className="p-3 border-t border-slate-100">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4 shrink-0" />
          <span>Mode Monitoring</span>
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop/Tablet Sidebar (Default Terbuka & Persistent) */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 min-h-screen sticky top-0 h-screen z-20">
        {navContent}
      </aside>

      {/* 2. Mobile Drawer (Hanya jika dibuka di layar kecil HP) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative flex flex-col w-64 max-w-[80vw] h-full shadow-2xl z-10">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
