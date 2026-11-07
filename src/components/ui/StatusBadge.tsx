interface StatusBadgeProps {
  label: string;
}

export function StatusBadge({ label }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-slate-100 text-slate-600">
      {label}
    </span>
  );
}
