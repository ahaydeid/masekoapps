import { createContext } from 'react';
import type { Dictionary } from '../i18n/translations';
import type { Language, Product } from '../types/product';

export interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  dict: Dictionary;
  products: Product[];
  loading: boolean;
  errorMessage: string | null;
  reload: () => void;
}

export const AppContext = createContext<AppContextValue | null>(null);
