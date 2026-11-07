import { FiSearch, FiX } from 'react-icons/fi';

interface SearchInputProps {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  clearLabel: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  clearLabel,
}: SearchInputProps) {
  return (
    <div className="bg-white rounded-full px-4 py-2.5 flex items-center gap-2.5">
      <FiSearch className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={clearLabel}
          className="p-0.5 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
