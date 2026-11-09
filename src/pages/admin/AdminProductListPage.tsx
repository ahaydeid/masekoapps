import { useState, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Card } from '../../components/ui/Card';
import { ProductThumb } from '../../components/ui/ProductThumb';
import { SearchInput } from '../../components/ui/SearchInput';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import { useAppContext } from '../../context/useAppContext';
import { saveProductApi, deleteProductApi } from '../../services/productService';
import { formatNumber, formatRupiah } from '../../utils/format';
import type { Product } from '../../types/product';

export function AdminProductListPage() {
  const { products, loading, errorMessage, reload } = useAppContext();

  const [search, setSearch] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State Modal Form (Tambah / Edit)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // State Pesan Aksi (Sukses / Gagal)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // State Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter pencarian
  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return products;
    return products.filter(
      (p) =>
        p.noSeri.toLowerCase().includes(keyword) ||
        p.namaProduk.toLowerCase().includes(keyword) ||
        p.spesifikasiProduk.toLowerCase().includes(keyword)
    );
  }, [products, search]);

  // Hitung total halaman & slice data
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, safeCurrentPage, pageSize]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleOpenAdd = () => {
    setProductToEdit(null);
    setIsFormModalOpen(true);
    setFeedback(null);
  };

  const handleOpenEdit = (product: Product) => {
    setProductToEdit(product);
    setIsFormModalOpen(true);
    setFeedback(null);
  };

  const handleSaveProduct = async (product: Product) => {
    try {
      setIsSaving(true);
      const action = productToEdit ? 'update' : 'create';
      await saveProductApi(product, action);
      setIsFormModalOpen(false);
      setFeedback({
        type: 'success',
        message: `Produk ${product.noSeri} berhasil ${action === 'create' ? 'ditambahkan' : 'diperbarui'}!`,
      });
      reload();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan produk.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      setIsDeleting(true);
      await deleteProductApi(productToDelete.noSeri);
      setProductToDelete(null);
      setFeedback({
        type: 'success',
        message: `Produk ${productToDelete.noSeri} berhasil dihapus!`,
      });
      reload();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus produk.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Banner Pesan Aksi */}
      {feedback && (
        <div
          className={`p-3 text-sm font-normal flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-100/80 text-emerald-700'
              : 'bg-rose-100/80 text-rose-700'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs underline cursor-pointer ml-3"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Baris Atas: Info Jumlah, Tombol Tambah & Kolom Pencarian */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-normal text-slate-500">
            Total {totalItems} produk
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 text-white text-xs font-normal rounded-md hover:bg-sky-700 transition-colors cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </button>
        </div>

        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Cari SKU atau nama produk..."
          clearLabel="Hapus pencarian"
        />
      </div>

      {/* State Loading / Error / Kosong */}
      {loading ? (
        <Card>
          <p className="text-sm font-normal text-slate-500 text-center py-10">
            Memuat data produk...
          </p>
        </Card>
      ) : errorMessage ? (
        <Card variant="rounded">
          <div className="space-y-3 py-4 text-center">
            <p className="text-sm font-normal text-rose-600">
              Gagal memuat data
            </p>
            <p className="text-xs font-normal text-slate-500 break-words">{errorMessage}</p>
            <button
              type="button"
              onClick={reload}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2 text-xs font-normal text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        </Card>
      ) : totalItems === 0 ? (
        <Card>
          <p className="text-sm font-normal text-slate-500 text-center py-8">
            Produk tidak ditemukan.
          </p>
        </Card>
      ) : (
        /* Kontainer Tabel Flat Full Width dengan Zebra Tipis & Tanpa Border Antar Baris */
        <div className="w-full bg-white rounded-2xl shadow-xs overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-14 font-medium">Foto</th>
                  <th className="py-3 px-4 font-medium">No Seri</th>
                  <th className="py-3 px-4 min-w-[240px] font-medium">Nama Produk</th>
                  <th className="py-3 px-4 font-medium">Jenis</th>
                  <th className="py-3 px-4 text-right font-medium">Harga</th>
                  <th className="py-3 px-4 text-right font-medium">Stok</th>
                  <th className="py-3 px-4 font-medium">Satuan</th>
                  <th className="py-3 px-4 text-center w-24 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-slate-700">
                {paginatedProducts.map((product) => (
                  <tr
                    key={product.noSeri}
                    className="even:bg-slate-50/60 hover:bg-slate-100/60 transition-colors"
                  >
                    {/* Foto */}
                    <td className="py-2.5 px-4 font-normal">
                      <div className="w-10 h-10 overflow-hidden shrink-0">
                        <ProductThumb
                          src={product.gambar}
                          alt={product.namaProduk}
                          fallbackText={product.noSeri}
                        />
                      </div>
                    </td>

                    {/* No Seri */}
                    <td className="py-2.5 px-4 font-normal text-slate-700 whitespace-nowrap">
                      {product.noSeri}
                    </td>

                    {/* Nama Produk */}
                    <td className="py-2.5 px-4 font-normal text-slate-700">
                      <p className="line-clamp-2 leading-relaxed">
                        {product.namaProduk.replace(/\s*\n+\s*/g, ' — ')}
                      </p>
                    </td>

                    {/* Jenis Kabel */}
                    <td className="py-2.5 px-4 font-normal whitespace-nowrap">
                      <StatusBadge
                        label={product.jenisKabel.replace(/\s*\n\s*/g, ' ')}
                      />
                    </td>

                    {/* Harga Satuan */}
                    <td className="py-2.5 px-4 text-right font-normal text-slate-700 whitespace-nowrap">
                      {formatRupiah(product.hargaSatuan)}
                    </td>

                    {/* Stok / Jumlah */}
                    <td className="py-2.5 px-4 text-right font-normal whitespace-nowrap">
                      <span
                        className={
                          product.jumlah <= 0 ? 'text-rose-600' : 'text-slate-700'
                        }
                      >
                        {formatNumber(product.jumlah)}
                      </span>
                    </td>

                    {/* Satuan */}
                    <td className="py-2.5 px-4 font-normal text-slate-700 whitespace-nowrap">
                      {product.satuan.replace(/\s*\n\s*/g, ' / ')}
                    </td>

                    {/* Tombol Aksi (Buka Modal Edit / Modal Hapus) */}
                    <td className="py-2.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(product)}
                          aria-label={`Edit ${product.noSeri}`}
                          className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          aria-label={`Hapus ${product.noSeri}`}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Baris Bawah: Kontrol Pagination di Kanan Bawah */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-white border-t border-slate-100">
            <div className="text-xs font-normal text-slate-500">
              Menampilkan {(safeCurrentPage - 1) * pageSize + 1} -{' '}
              {Math.min(safeCurrentPage * pageSize, totalItems)} dari {totalItems} produk
            </div>

            <div className="flex items-center gap-4 ml-auto">
              {/* Dropdown Pilihan 10, 20, 50 */}
              <div className="flex items-center gap-2 text-xs font-normal text-slate-600">
                <span>Baris:</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-normal text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Kontrol < n/n > */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Halaman sebelumnya"
                  className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs font-normal text-slate-700 px-1">
                  {safeCurrentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Halaman berikutnya"
                  className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Produk */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        initialProduct={productToEdit}
        isSaving={isSaving}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* Modal Hapus */}
      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        noSeri={productToDelete?.noSeri ?? ''}
        namaProduk={productToDelete?.namaProduk ?? ''}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
