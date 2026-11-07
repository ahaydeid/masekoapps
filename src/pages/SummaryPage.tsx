import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { useAppContext } from '../context/useAppContext';
import { formatNumber } from '../utils/format';

interface JenisKabelStat {
  jenisKabel: string;
  produkCount: number;
  totalJumlah: number;
}

export function SummaryPage() {
  const { products, dict } = useAppContext();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    let totalJumlah = 0;
    let tersediaCount = 0;
    let habisCount = 0;
    const jenisMap = new Map<string, JenisKabelStat>();

    for (const item of products) {
      totalJumlah += item.jumlah;
      if (item.jumlah > 0) {
        tersediaCount += 1;
      } else {
        habisCount += 1;
      }

      const existing = jenisMap.get(item.jenisKabel);
      if (existing) {
        existing.produkCount += 1;
        existing.totalJumlah += item.jumlah;
      } else {
        jenisMap.set(item.jenisKabel, {
          jenisKabel: item.jenisKabel,
          produkCount: 1,
          totalJumlah: item.jumlah,
        });
      }
    }

    const jenisList = Array.from(jenisMap.values()).sort(
      (a, b) => b.totalJumlah - a.totalJumlah,
    );

    return {
      totalProduk: products.length,
      totalJumlah,
      tersediaCount,
      habisCount,
      jenisList,
    };
  }, [products]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 px-4">
        <Card variant="rounded">
          <p className="text-xs text-slate-500">{dict.summary.totalProduk}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {formatNumber(stats.totalProduk)}
          </p>
        </Card>

        <Card variant="rounded">
          <p className="text-xs text-slate-500">{dict.summary.totalJumlah}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {formatNumber(stats.totalJumlah)}
          </p>
        </Card>

        <Card
          variant="rounded"
          onClick={() => navigate('/stok?status=AVAILABLE')}
        >
          <p className="text-xs text-slate-500">{dict.summary.tersedia}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {formatNumber(stats.tersediaCount)}
          </p>
        </Card>

        <Card variant="rounded" onClick={() => navigate('/stok?status=OUT')}>
          <p className="text-xs text-slate-500">{dict.summary.habis}</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {formatNumber(stats.habisCount)}
          </p>
        </Card>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-slate-900 px-4 pb-2">
          {dict.fields.jenisKabel}
        </h2>
        <div className="space-y-1">
          {stats.jenisList.map((item) => (
            <Card
              key={item.jenisKabel}
              padding="sm"
              onClick={() =>
                navigate(
                  `/daftar-harga?jenis=${encodeURIComponent(item.jenisKabel)}`,
                )
              }
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {item.jenisKabel.replace(/\s*\n\s*/g, ' ')}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {dict.priceList.showingCount(item.produkCount)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">
                    {formatNumber(item.totalJumlah)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
