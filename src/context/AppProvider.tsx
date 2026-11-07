import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import { fetchProducts } from '../services/productService';
import type { Language, Product } from '../types/product';
import { AppContext } from './appContextObject';

const LANG_STORAGE_KEY = 'ssi_lang';

function readInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'zh' ? 'zh' : 'id';
  } catch {
    return 'id';
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readInitialLanguage);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setLoading(true);
    setErrorMessage(null);
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'id';
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch {
      // Ignore storage errors
    }
  }, [language]);

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((items) => {
        if (!active) return;
        setProducts(items);
        setErrorMessage(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg = err instanceof Error ? err.message : 'Gagal memuat data';
        setProducts([]);
        setErrorMessage(msg);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        dict: TRANSLATIONS[language],
        products,
        loading,
        errorMessage,
        reload,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
