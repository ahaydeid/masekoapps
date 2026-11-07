export type Language = 'id' | 'zh';

export type StockFilter = 'ALL' | 'AVAILABLE' | 'OUT';

export type StockSort = 'ASC' | 'DESC';

export interface Product {
  gambar: string;
  noSeri: string;
  namaProduk: string;
  spesifikasiProduk: string;
  jumlah: number;
  satuan: string;
  pcsBox: string;
  pcsPack: string;
  hargaSatuan: number;
  jenisKabel: string;
  komentar: string;
}
