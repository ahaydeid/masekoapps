import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export interface DropdownOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}

export function FilterDropdown({
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  const selectedOption =
    options.find((opt) => opt.value === value) ?? options[0];

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div className="relative min-w-0">
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/15"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`relative w-full bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 flex items-center justify-between gap-2 cursor-pointer transition-shadow hover:shadow-sm focus:outline-none ${
          open ? 'z-40' : ''
        }`}
      >
        <span className="truncate">
          {selectedOption?.label ?? ''}
          {typeof selectedOption?.count === 'number'
            ? ` (${selectedOption.count})`
            : ''}
        </span>
        <FiChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
            open ? 'rotate-180 text-slate-900' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-white rounded-xl p-1 max-h-64 overflow-y-auto space-y-0.5"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                  active
                    ? 'bg-slate-100 text-slate-950'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {typeof opt.count === 'number' && (
                  <span className="text-slate-400 shrink-0">{opt.count}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
