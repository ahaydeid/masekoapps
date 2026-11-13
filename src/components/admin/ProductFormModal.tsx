import { useState, useEffect, useCallback } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import type { Product } from '../../types/product';

const EMPTY_FORM_DATA: Product = {
  gambar: '',
  noSeri: '',
  namaProduk: '',
  spesifikasiProduk: '',
  jumlah: 0,
  satuan: '',
  pcsBox: '',
  pcsPack: '',
  hargaSatuan: 0,
  jenisKabel: '',
  komentar: '',
};

interface ProductFormModalProps {
  isOpen: boolean;
  initialProduct?: Product | null;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

function compressImage(file: File, maxDim = 800, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ProductFormModal({
  isOpen,
  initialProduct,
  isSaving = false,
  onClose,
  onSave,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  return (
    <ProductFormModalContent
      initialProduct={initialProduct}
      isSaving={isSaving}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function ProductFormModalContent({
  initialProduct,
  isSaving,
  onClose,
  onSave,
}: {
  initialProduct?: Product | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const isEdit = Boolean(initialProduct);

  const [formData, setFormData] = useState<Product>(() => initialProduct ?? EMPTY_FORM_DATA);
  const [imagePreview, setImagePreview] = useState<string>(() => initialProduct?.gambar ?? '');
  const [isCompressing, setIsCompressing] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 150);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedBase64 = await compressImage(file, 800, 0.8);
      setImagePreview(compressedBase64);
      setFormData((prev) => ({ ...prev, gambar: compressedBase64 }));
    } catch {
      // Fallback: baca langsung jika kompresi gagal
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = (reader.result as string) || '';
        setImagePreview(res);
        setFormData((prev) => ({ ...prev, gambar: res }));
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.noSeri.trim()) {
      alert('No Seri wajib diisi.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Lembut & Transisi Fade Tanpa Blur */}
      <div
        className={`fixed inset-0 bg-slate-900/25 transition-opacity duration-150 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Box dengan Transisi Zoom In / Zoom Out */}
      <div
        className={`relative w-full max-w-2xl bg-white rounded-lg shadow-xl z-10 flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-150 ease-out ${
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-base font-normal text-slate-800">
            {isEdit ? `Edit Produk: ${initialProduct?.noSeri}` : 'Tambah Produk Baru'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup form"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Upload Foto Sederhana */}
          <div>
            <label className="block text-xs font-normal text-slate-600 mb-1">
              Foto Produk
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSaving || isCompressing}
                className="block w-full text-xs font-normal text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-normal file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer disabled:opacity-50"
              />
              {isCompressing && (
                <p className="text-xs text-sky-600 animate-pulse">Mengoptimalkan ukuran foto...</p>
              )}
              {imagePreview && !isCompressing && (
                <div className="w-30 h-30 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* No Seri & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-normal text-slate-600 mb-1">
                No Seri (SKU) *
              </label>
              <input
                type="text"
                name="noSeri"
                required
                disabled={isEdit}
                value={formData.noSeri}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm font-normal text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-slate-600 mb-1">
                Jenis Kabel / Kategori
              </label>
              <input
                type="text"
                name="jenisKabel"
                value={formData.jenisKabel}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm font-normal text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Nama Produk */}
          <div>
            <label className="block text-xs font-normal text-slate-600 mb-1">
              Nama Produk *
            </label>
            <textarea
              name="namaProduk"
              required
              rows={2}
              value={formData.namaProduk}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm font-normal text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Jumlah & Harga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-normal text-slate-600 mb-1">
                Jumlah / Stok
              </label>
              <input
                type="number"
                name="jumlah"
                value={formData.jumlah}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm font-normal text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-slate-600 mb-1">
                Harga Satuan (Rp)
              </label>
              <input
                type="number"
                name="hargaSatuan"
                value={formData.hargaSatuan}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm font-normal text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Satuan, Pcs/Pack, Pcs/Box */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-normal text-slate-600 mb-1">
                Satuan
              </label>
              <input
                type="text"
                name="satuan"
                value={formData.satuan}
                onChange={handleChange}
                className="w-full px-2.5 py-2 text-xs font-normal text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-slate-600 mb-1">
                Pcs/Pack
              </label>
              <input
                type="text"
                name="pcsPack"
                value={formData.pcsPack}
                onChange={handleChange}
                className="w-full px-2.5 py-2 text-xs font-normal text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-slate-600 mb-1">
                Pcs/Box
              </label>
              <input
                type="text"
                name="pcsBox"
                value={formData.pcsBox}
                onChange={handleChange}
                className="w-full px-2.5 py-2 text-xs font-normal text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Spesifikasi */}
          <div>
            <label className="block text-xs font-normal text-slate-600 mb-1">
              Spesifikasi Produk
            </label>
            <textarea
              name="spesifikasiProduk"
              rows={5}
              value={formData.spesifikasiProduk}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm font-normal text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 resize-y"
            />
          </div>

          {/* Komentar */}
          <div>
            <label className="block text-xs font-normal text-slate-600 mb-1">
              Komentar / Catatan
            </label>
            <input
              type="text"
              name="komentar"
              value={formData.komentar}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm font-normal text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Footer Tombol Aksi */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              disabled={isSaving || isCompressing}
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 text-xs font-normal text-slate-800 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving || isCompressing}
              className="flex-1 py-2.5 px-4 text-xs font-normal text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <FiUpload className="w-3.5 h-3.5" />
              <span>
                {isCompressing
                  ? 'Memproses foto...'
                  : isSaving
                    ? 'Menyimpan...'
                    : isEdit
                      ? 'Simpan Perubahan'
                      : 'Tambahkan Produk'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
