import { useState } from 'react';
import type { IconType } from 'react-icons';
import { FiChevronUp, FiGlobe, FiGrid, FiPackage, FiTag } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/useAppContext';
import type { Language } from '../../types/product';

interface NavRoute {
  to: string;
  end?: boolean;
  labelKey: 'summary' | 'priceList' | 'stock';
  icon: IconType;
}

const NAV_ROUTES: NavRoute[] = [
  { to: '/', end: true, labelKey: 'summary', icon: FiGrid },
  { to: '/stok', labelKey: 'stock', icon: FiPackage },
  { to: '/daftar-harga', labelKey: 'priceList', icon: FiTag },
];

export function BottomBar() {
  const { language, setLanguage, dict } = useAppContext();
  const [langOpen, setLangOpen] = useState(false);

  const handleChooseLanguage = (next: Language) => {
    setLanguage(next);
    setLangOpen(false);
  };

  return (
    <>
      {langOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/20"
          onClick={() => setLangOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        aria-label="Primary"
        className="fixed bottom-0 inset-x-0 z-40 bg-white pb-[env(safe-area-inset-bottom)]"
      >
        <div className="relative max-w-lg mx-auto px-2 grid grid-cols-4">
          {NAV_ROUTES.map(({ to, end, labelKey, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setLangOpen(false)}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                  isActive
                    ? 'text-slate-950'
                    : 'text-slate-400 hover:text-slate-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px] leading-none">
                    {dict.nav[labelKey]}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 h-0.5 w-8 bg-slate-950 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <div className="relative flex">
            {langOpen && (
              <div
                role="menu"
                className="absolute bottom-full right-2 mb-2 w-40 bg-white rounded-2xl p-1.5 flex flex-col gap-1"
              >
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={language === 'id'}
                  onClick={() => handleChooseLanguage('id')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    language === 'id'
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{dict.languageMenu.idName}</span>
                  <span className={language === 'id' ? 'text-slate-950' : 'text-slate-400'}>
                    ID
                  </span>
                </button>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={language === 'zh'}
                  onClick={() => handleChooseLanguage('zh')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    language === 'zh'
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{dict.languageMenu.zhName}</span>
                  <span className={language === 'zh' ? 'text-slate-950' : 'text-slate-400'}>
                    中文
                  </span>
                </button>
              </div>
            )}

            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((prev) => !prev)}
              className={`relative w-full flex flex-col items-center justify-center gap-1 py-2.5 transition-colors cursor-pointer ${
                langOpen
                  ? 'text-slate-950'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <FiGlobe className="w-5 h-5" />
              <span className="inline-flex items-center gap-0.5 text-[11px] leading-none">
                <span>{dict.languageMenu.label}</span>
                <FiChevronUp
                  className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
