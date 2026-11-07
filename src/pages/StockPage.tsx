import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import {
  FilterDropdown,
  type DropdownOption,
} from '../components/ui/FilterDropdown';
import { SearchInput } from '../components/ui/SearchInput';
import { useAppContext } from '../context/useAppContext';
import type { StockFilter, StockSort } from '../types/product';
import { formatNumber } from '../utils/format';

const FILTER_KEYS: StockFilter[] = ['ALL', 'AVAILABLE', 'OUT'];

function isValidFilter(value: string | null): value is StockFilter {
  return value !== null && (FILTER_KEYS as readonly string[]).includes(value);
}

export function StockPage() {
  const { products, dict } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get('q') ?? '';
  const rawFilter = searchParams.get('status');
  const stockFilter: StockFilter = isValidFilter(rawFilter) ? rawFilter : 'ALL';
  const stockSort: StockSort =
    searchParams.get('urut') === 'DESC' ? 'DESC' : 'ASC';

  const updateParam = (key: string, value: string, defaultValue = '') => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === defaultValue) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const filterOptions = useMemo<DropdownOption[]>(() => {
    let available = 0;
    let out = 0;
    for (const p of products) {
      if (p.jumlah > 0) available += 1;
      else out += 1;
    }
    const counts: Record<StockFilter, number> = {
      ALL: products.length,
      AVAILABLE: available,
      OUT: out,
    };
    return FILTER_KEYS.map((key) => ({
      value: key,
      label: dict.stock.filters[key],
      count: counts[key],
    }));
  }, [products, dict.stock.filters]);

  const sortOptions = useMemo<DropdownOption[]>(
    () => [
      { value: 'ASC', label: dict.stock.sortAsc },
      { value: 'DESC', label: dict.stock.sortDesc },
    ],
    [dict.stock.sortAsc, dict.stock.sortDesc],
  );

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const matched = products.filter((item) => {
      if (stockFilter === 'AVAILABLE' && item.jumlah <= 0) return false;
      if (stockFilter === 'OUT' && item.jumlah > 0) return false;

      if (!keyword) return true;
      return (
        item.noSeri.toLowerCase().includes(keyword) ||
        item.namaProduk.toLowerCase().includes(keyword)
      );
    });

    return matched.sort((a, b) =>
      stockSort === 'ASC' ? a.jumlah - b.jumlah : b.jumlah - a.jumlah,
    );
  }, [products, search, stockFilter, stockSort]);

  return (
    <div className="space-y-3">
      <div className="px-4 space-y-2.5">
        <SearchInput
          value={search}
          onChange={(val) => updateParam('q', val)}
          placeholder={dict.stock.searchPlaceholder}
          clearLabel={dict.common.clearSearch}
        />

        <div className="grid grid-cols-2 gap-2.5">
          <FilterDropdown
            value={stockFilter}
            options={filterOptions}
            onChange={(val) => updateParam('status', val, 'ALL')}
          />
          <FilterDropdown
            value={stockSort}
            options={sortOptions}
            onChange={(val) => updateParam('urut', val, 'ASC')}
          />
        </div>

        <p className="text-xs font-medium text-slate-500">
          {dict.priceList.showingCount(filteredProducts.length)}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500 text-center py-6">
            {dict.stock.emptyState}
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
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="block text-xs font-semibold text-slate-500 truncate">
                    {product.noSeri}
                  </span>
                  <h2 className="text-sm font-semibold text-slate-900 truncate">
                    {product.namaProduk.replace(/\s*\n+\s*/g, ' — ')}
                  </h2>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`text-base font-bold ${
                      product.jumlah <= 0 ? 'text-rose-600' : 'text-slate-900'
                    }`}
                  >
                    {formatNumber(product.jumlah)}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {product.satuan.replace(/\s*\n\s*/g, ' / ')}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
