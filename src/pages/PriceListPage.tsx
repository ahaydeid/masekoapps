import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import {
  FilterDropdown,
  type DropdownOption,
} from '../components/ui/FilterDropdown';
import { ProductThumb } from '../components/ui/ProductThumb';
import { SearchInput } from '../components/ui/SearchInput';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAppContext } from '../context/useAppContext';
import { formatNumber, formatRupiah } from '../utils/format';

export function PriceListPage() {
  const { products, dict } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get('q') ?? '';
  const selectedJenis = searchParams.get('jenis') || 'ALL';

  const updateParam = (key: string, value: string, defaultValue = '') => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === defaultValue) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const jenisOptions = useMemo<DropdownOption[]>(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      if (!p.jenisKabel) continue;
      map.set(p.jenisKabel, (map.get(p.jenisKabel) ?? 0) + 1);
    }
    return [
      {
        value: 'ALL',
        label: dict.priceList.allJenisKabel,
        count: products.length,
      },
      ...Array.from(map.entries()).map(([jenis, count]) => ({
        value: jenis,
        label: jenis.replace(/\s*\n\s*/g, ' '),
        count,
      })),
    ];
  }, [products, dict.priceList.allJenisKabel]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return products.filter((item) => {
      if (selectedJenis !== 'ALL' && item.jenisKabel !== selectedJenis) {
        return false;
      }
      if (!keyword) return true;
      return (
        item.noSeri.toLowerCase().includes(keyword) ||
        item.namaProduk.toLowerCase().includes(keyword) ||
        item.spesifikasiProduk.toLowerCase().includes(keyword)
      );
    });
  }, [products, search, selectedJenis]);

  return (
    <div className="space-y-3">
      <div className="px-4 space-y-2.5">
        <SearchInput
          value={search}
          onChange={(val) => updateParam('q', val)}
          placeholder={dict.priceList.searchPlaceholder}
          clearLabel={dict.common.clearSearch}
        />

        <FilterDropdown
          value={selectedJenis}
          options={jenisOptions}
          onChange={(val) => updateParam('jenis', val, 'ALL')}
        />

        <p className="text-xs font-medium text-slate-500">
          {dict.priceList.showingCount(filteredProducts.length)}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500 text-center py-6">
            {dict.priceList.emptyState}
          </p>
        </Card>
      ) : (
        <div className="space-y-1">
          {filteredProducts.map((product) => (
            <Card
              key={product.noSeri}
              padding="sm"
              onClick={() =>
                navigate(`/produk/${encodeURIComponent(product.noSeri)}`)
              }
            >
              <div className="flex items-center gap-3.5">
                <ProductThumb
                  src={product.gambar}
                  alt={product.namaProduk}
                  fallbackText={product.noSeri}
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500 truncate">
                      {product.noSeri}
                    </span>
                    <StatusBadge
                      label={product.jenisKabel.replace(/\s*\n\s*/g, ' ')}
                    />
                  </div>

                  <h2 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
                    {product.namaProduk.replace(/\s*\n+\s*/g, ' — ')}
                  </h2>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="text-sm font-bold text-slate-900">
                      {formatRupiah(product.hargaSatuan)}
                    </span>
                    <span
                      className={`text-xs ${
                        product.jumlah <= 0 ? 'text-rose-600 font-semibold' : 'text-slate-500'
                      }`}
                    >
                      {dict.fields.jumlah}: {formatNumber(product.jumlah)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

