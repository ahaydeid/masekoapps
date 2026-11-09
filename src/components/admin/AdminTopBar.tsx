import { FiMenu } from 'react-icons/fi';

interface AdminTopBarProps {
  title: string;
  onOpenSidebar: () => void;
}

export function AdminTopBar({ title, onOpenSidebar }: AdminTopBarProps) {
  return (
    <header className="py-3 px-4 md:px-6 w-full flex items-center justify-between gap-3 bg-white border-b border-slate-200 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Tombol menu hamburger hanya tampil di layar HP */}
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Buka menu admin"
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer md:hidden shrink-0"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 truncate">
          {title}
        </h1>
      </div>
    </header>
  );
}
