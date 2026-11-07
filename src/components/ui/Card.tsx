import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  padding?: 'sm' | 'md';
  variant?: 'flat' | 'rounded';
  onClick?: () => void;
}

export function Card({
  children,
  padding = 'md',
  variant = 'flat',
  onClick,
}: CardProps) {
  const padClass = padding === 'sm' ? 'px-4 py-3' : 'px-4 py-4';
  const radiusClass = variant === 'rounded' ? 'rounded-2xl' : '';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full text-left bg-white ${padClass} ${radiusClass} cursor-pointer transition-shadow duration-150 hover:shadow-sm active:bg-slate-50 focus:outline-none`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={`bg-white ${padClass} ${radiusClass}`}>{children}</div>
  );
}
