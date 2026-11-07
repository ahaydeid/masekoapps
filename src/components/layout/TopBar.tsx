import { FiArrowLeft } from 'react-icons/fi';

interface TopBarProps {
  title: string;
  onBack?: () => void;
  backLabel?: string;
}

export function TopBar({ title, onBack, backLabel }: TopBarProps) {
  return (
    <header className="pt-4 pb-3 px-4 w-full flex items-center gap-2.5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className="p-2 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
        >
          <FiArrowLeft className="w-4 h-4" />
        </button>
      )}
      <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">
        {title}
      </h1>
    </header>
  );
}
