import { useState } from 'react';

interface ProductThumbProps {
  src: string;
  alt: string;
  fallbackText: string;
  size?: 'sm' | 'lg';
  onClick?: () => void;
  actionLabel?: string;
}

export function ProductThumb({
  src,
  alt,
  fallbackText,
  size = 'sm',
  onClick,
  actionLabel,
}: ProductThumbProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;
  const sizeClass = size === 'lg' ? 'w-full h-48' : 'w-16 h-16';
  const baseClass = `bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 ${sizeClass}`;

  if (showImage && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={actionLabel ?? alt}
        className={`${baseClass} cursor-pointer`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(src)}
          className="w-full h-full object-contain"
        />
      </button>
    );
  }

  return (
    <div className={baseClass}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(src)}
          className="w-full h-full object-contain"
        />
      ) : (
        <span className="text-[11px] font-semibold text-slate-400 px-2 text-center truncate">
          {fallbackText}
        </span>
      )}
    </div>
  );
}
