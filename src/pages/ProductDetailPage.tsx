import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { ProductThumb } from '../components/ui/ProductThumb';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAppContext } from '../context/useAppContext';
import { formatNumber, formatRupiah } from '../utils/format';

export function ProductDetailPage() {
  const { noSeri } = useParams<{ noSeri: string }>();
  const { products, dict } = useAppContext();

  const decodedSku = noSeri ? decodeURIComponent(noSeri) : '';
  const product = products.find((item) => item.noSeri === decodedSku);

  if (!product) {
    return (
      <Card>
        <p className="text-sm text-slate-500 text-center py-8">
          {dict.detail.notFound}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-1">
      <Card>
        <div className="space-y-4">
          <ProductThumb
            src={product.gambar}
            alt={product.namaProduk}
            fallbackText={product.noSeri}
            size="lg"
          />

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                label={product.jenisKabel.replace(/\s*\n\s*/g, ' ')}
              />
            </div>
            <p className="text-xs font-medium text-slate-500">
              {dict.fields.namaProduk}
            </p>
            <h2 className="text-base font-semibold text-slate-900 leading-snug whitespace-pre-line">
              {product.namaProduk}
            </h2>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-1">
        <Card padding="sm">
          <p className="text-xs text-slate-500">{dict.fields.noSeri}</p>
          <p className="text-sm font-semibold text-slate-900 mt-1">
            {product.noSeri}
          </p>
        </Card>

        <Card padding="sm">
          <p className="text-xs text-slate-500">{dict.fields.hargaSatuan}</p>
          <p className="text-base font-bold text-slate-900 mt-1">
            {formatRupiah(product.hargaSatuan)}
          </p>
        </Card>

        <Card padding="sm">
          <p className="text-xs text-slate-500">{dict.fields.jumlah}</p>
          <p
            className={`text-base font-bold mt-1 ${
              product.jumlah <= 0 ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {formatNumber(product.jumlah)}
          </p>
        </Card>

        <Card padding="sm">
          <p className="text-xs text-slate-500">{dict.fields.satuan}</p>
          <p className="text-sm font-semibold text-slate-900 mt-1 whitespace-pre-line">
            {product.satuan}
          </p>
        </Card>

        <Card padding="sm">
          <p className="text-xs text-slate-500">{dict.fields.pcsPack}</p>
          <p className="text-sm font-semibold text-slate-900 mt-1">
            {product.pcsPack}
          </p>
        </Card>

        <Card padding="sm">
          <p className="text-xs text-slate-500">{dict.fields.pcsBox}</p>
          <p className="text-sm font-semibold text-slate-900 mt-1">
            {product.pcsBox}
          </p>
        </Card>
      </div>

      <Card padding="sm">
        <p className="text-xs font-medium text-slate-500">
          {dict.fields.spesifikasiProduk}
        </p>
        <p className="text-sm text-slate-800 leading-relaxed mt-1 whitespace-pre-line">
          {product.spesifikasiProduk}
        </p>
      </Card>

      <Card padding="sm">
        <p className="text-xs font-medium text-slate-500">
          {dict.fields.komentar}
        </p>
        <p className="text-sm text-slate-800 leading-relaxed mt-1 whitespace-pre-line">
          {product.komentar || '-'}
        </p>
      </Card>
    </div>
  );
}
