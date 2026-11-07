import type { Language, StockFilter } from '../types/product';

export interface Dictionary {
  nav: {
    summary: string;
    priceList: string;
    stock: string;
  };
  languageMenu: {
    label: string;
    idName: string;
    zhName: string;
  };
  fields: {
    noSeri: string;
    namaProduk: string;
    spesifikasiProduk: string;
    jumlah: string;
    satuan: string;
    pcsBox: string;
    pcsPack: string;
    hargaSatuan: string;
    jenisKabel: string;
    komentar: string;
  };
  summary: {
    title: string;
    totalProduk: string;
    totalJumlah: string;
    tersedia: string;
    habis: string;
  };
  priceList: {
    title: string;
    searchPlaceholder: string;
    allJenisKabel: string;
    showingCount: (count: number) => string;
    emptyState: string;
  };
  stock: {
    title: string;
    searchPlaceholder: string;
    filters: Record<StockFilter, string>;
    sortAsc: string;
    sortDesc: string;
    emptyState: string;
  };
  detail: {
    back: string;
    notFound: string;
    zoomImage: string;
    closeModal: string;
  };
  common: {
    clearSearch: string;
    loading: string;
    errorTitle: string;
    retry: string;
  };
}

export const TRANSLATIONS: Record<Language, Dictionary> = {
  id: {
    nav: {
      summary: 'Ringkasan',
      priceList: 'Daftar Harga',
      stock: 'Stok',
    },
    languageMenu: {
      label: 'ID',
      idName: 'Indonesia',
      zhName: '中文 (Mandarin)',
    },
    fields: {
      noSeri: 'No Seri',
      namaProduk: 'Nama Produk',
      spesifikasiProduk: 'Spesifikasi Produk',
      jumlah: 'Jumlah',
      satuan: 'Satuan',
      pcsBox: 'Pcs/Box',
      pcsPack: 'Pcs/Pack',
      hargaSatuan: 'Harga Satuan',
      jenisKabel: 'Jenis Kabel',
      komentar: 'Komentar',
    },
    summary: {
      title: 'Ringkasan',
      totalProduk: 'Total Produk',
      totalJumlah: 'Total Jumlah',
      tersedia: 'Jumlah > 0',
      habis: 'Jumlah 0',
    },
    priceList: {
      title: 'Daftar Harga',
      searchPlaceholder: 'Cari No Seri atau Nama Produk...',
      allJenisKabel: 'Semua Jenis Kabel',
      showingCount: (count) => `${count} produk`,
      emptyState: 'Data tidak ditemukan',
    },
    stock: {
      title: 'Stok',
      searchPlaceholder: 'Cari No Seri atau Nama Produk...',
      filters: {
        ALL: 'Semua',
        AVAILABLE: 'Jumlah > 0',
        OUT: 'Jumlah 0',
      },
      sortAsc: 'Jumlah: Terendah',
      sortDesc: 'Jumlah: Tertinggi',
      emptyState: 'Data tidak ditemukan',
    },
    detail: {
      back: 'Kembali',
      notFound: 'Data tidak ditemukan',
      zoomImage: 'Perbesar gambar',
      closeModal: 'Tutup',
    },
    common: {
      clearSearch: 'Hapus pencarian',
      loading: 'Memuat data...',
      errorTitle: 'Gagal memuat data dari Google Sheets',
      retry: 'Coba Lagi',
    },
  },
  zh: {
    nav: {
      summary: '总览',
      priceList: '价格表',
      stock: '成品库',
    },
    languageMenu: {
      label: '中文',
      idName: 'Indonesia',
      zhName: '中文 (普通话)',
    },
    fields: {
      noSeri: '编号',
      namaProduk: '品名',
      spesifikasiProduk: '产品规格',
      jumlah: '数量',
      satuan: '单位',
      pcsBox: '件/箱',
      pcsPack: '每包装数量',
      hargaSatuan: '单价',
      jenisKabel: '电缆类型',
      komentar: '备注',
    },
    summary: {
      title: '总览',
      totalProduk: '产品总数',
      totalJumlah: '总数量',
      tersedia: '数量 > 0',
      habis: '数量 0',
    },
    priceList: {
      title: '价格表',
      searchPlaceholder: '搜索编号或品名...',
      allJenisKabel: '全部电缆类型',
      showingCount: (count) => `共 ${count} 款`,
      emptyState: '未找到匹配数据',
    },
    stock: {
      title: '成品库',
      searchPlaceholder: '搜索编号或品名...',
      filters: {
        ALL: '全部',
        AVAILABLE: '数量 > 0',
        OUT: '数量 0',
      },
      sortAsc: '数量：由少到多',
      sortDesc: '数量：由多到少',
      emptyState: '未找到匹配数据',
    },
    detail: {
      back: '返回',
      notFound: '未找到该产品',
      zoomImage: '放大图片',
      closeModal: '关闭',
    },
    common: {
      clearSearch: '清除搜索',
      loading: '正在加载数据...',
      errorTitle: '无法从 Google 表格加载数据',
      retry: '重试',
    },
  },
};
