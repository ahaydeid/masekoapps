import type { Product } from '../types/product';

interface RawSheetRow {
  gambar?: string;
  image_url?: string;
  no_seri?: string;
  nama_produk?: string;
  spesifikasi_produk?: string;
  spesifikasi?: string;
  jumlah?: number | string;
  stok?: number | string;
  satuan?: string;
  pcs_box?: string | number;
  pcs_per_box?: string | number;
  pcs_pack?: string | number;
  pcs_per_pack?: string | number;
  harga_satuan?: number | string;
  harga?: number | string;
  jenis_kabel?: string;
  kategori?: string;
  komentar?: string;
}

function parseNumber(val: number | string | undefined): number {
  if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^\d.-]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseText(val: string | number | undefined, fallback = '-'): string {
  if (val === undefined || val === null) return fallback;
  const text = String(val).trim();
  return text || fallback;
}

function normalizeDriveImageUrl(raw: string): string {
  const url = raw.trim();
  if (!url) return '';
  if (url.includes('drive.google.com/thumbnail?')) return url;

  const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w800`;
  }

  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (url.includes('drive.google.com') && idParamMatch) {
    return `https://drive.google.com/thumbnail?id=${idParamMatch[1]}&sz=w800`;
  }

  return url;
}

function normalizeRow(row: RawSheetRow): Product | null {
  const noSeri = parseText(row.no_seri, '');
  if (!noSeri) return null;

  return {
    gambar: normalizeDriveImageUrl(parseText(row.gambar ?? row.image_url, '')),
    noSeri,
    namaProduk: parseText(row.nama_produk, noSeri),
    spesifikasiProduk: parseText(row.spesifikasi_produk ?? row.spesifikasi),
    jumlah: parseNumber(row.jumlah ?? row.stok),
    satuan: parseText(row.satuan, 'PCS'),
    pcsBox: parseText(row.pcs_box ?? row.pcs_per_box),
    pcsPack: parseText(row.pcs_pack ?? row.pcs_per_pack),
    hargaSatuan: parseNumber(row.harga_satuan ?? row.harga),
    jenisKabel: parseText(row.jenis_kabel ?? row.kategori),
    komentar: parseText(row.komentar, ''),
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const apiUrl = import.meta.env.VITE_GAS_API_URL?.trim();
  if (!apiUrl) {
    throw new Error('VITE_GAS_API_URL belum diatur di Environment Variables.');
  }

  const response = await fetch(apiUrl, {
    method: 'GET',
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} (${response.statusText || 'Error'})`);
  }

  const payload: unknown = await response.json();
  const rows: RawSheetRow[] | null = Array.isArray(payload)
    ? (payload as RawSheetRow[])
    : Array.isArray((payload as { data?: unknown })?.data)
      ? (payload as { data: RawSheetRow[] }).data
      : null;

  if (!rows) {
    throw new Error('Format JSON dari Apps Script tidak sesuai.');
  }

  return rows
    .map(normalizeRow)
    .filter((item): item is Product => item !== null);
}
