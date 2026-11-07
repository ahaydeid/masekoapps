import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

interface ImageModalProps {
  src: string;
  alt: string;
  closeLabel: string;
  onClose: () => void;
}

function toHighResDriveUrl(url: string): string {
  if (url.includes('drive.google.com/thumbnail?')) {
    return url.replace(/sz=w\d+/, 'sz=w1600');
  }
  return url;
}

export function ImageModal({ src, alt, closeLabel, onClose }: ImageModalProps) {
  const highResSrc = toHighResDriveUrl(src);
  const [useFallbackSrc, setUseFallbackSrc] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const activeSrc = useFallbackSrc ? src : highResSrc;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="fixed top-4 right-4 z-10 p-2.5 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors cursor-pointer"
      >
        <FiX className="w-5 h-5" />
      </button>

      <img
        src={activeSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onClick={(event) => event.stopPropagation()}
        onError={() => {
          if (!useFallbackSrc && highResSrc !== src) {
            setUseFallbackSrc(true);
          }
        }}
        className="max-w-full max-h-[88dvh] object-contain select-none"
      />
    </div>
  );
}

