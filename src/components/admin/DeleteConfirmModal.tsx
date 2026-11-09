import { useState, useEffect, useCallback } from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  noSeri: string;
  namaProduk: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  noSeri,
  namaProduk,
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <DeleteConfirmModalContent
      noSeri={noSeri}
      namaProduk={namaProduk}
      isDeleting={isDeleting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

function DeleteConfirmModalContent({
  noSeri,
  namaProduk,
  isDeleting,
  onConfirm,
  onCancel,
}: {
  noSeri: string;
  namaProduk: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClose = useCallback(() => {
    if (isDeleting) return;
    setVisible(false);
    setTimeout(onCancel, 150);
  }, [isDeleting, onCancel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Lembut & Transisi Fade Tanpa Blur */}
      <div
        className={`fixed inset-0 bg-slate-900/25 transition-opacity duration-150 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal Box dengan Transisi Zoom In / Zoom Out */}
      <div
        className={`relative w-full max-w-sm bg-white rounded-lg p-5 shadow-xl z-10 space-y-4 transform transition-all duration-150 ease-out ${
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div>
          <h3 className="text-base font-normal text-slate-800">
            Hapus Produk?
          </h3>
          <p className="text-xs font-normal text-slate-500 mt-1 leading-relaxed">
            Apakah Anda yakin ingin menghapus produk ini?
          </p>
        </div>

        <div className="bg-slate-50 p-3 rounded">
          <p className="text-xs font-normal text-slate-500">{noSeri}</p>
          <p className="text-sm font-normal text-slate-700 line-clamp-2 mt-0.5">
            {namaProduk.replace(/\s*\n+\s*/g, ' — ')}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleClose}
            className="flex-1 py-2 px-4 text-xs font-normal text-slate-800 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="flex-1 py-2 px-4 text-xs font-normal text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
