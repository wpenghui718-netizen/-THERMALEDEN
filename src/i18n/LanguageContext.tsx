import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Language, getTranslation } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  showSelector: boolean;
  setShowSelector: (show: boolean) => void;
  confirmLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'thermal-eden-lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [showSelector, setShowSelector] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // On mount, check localStorage for saved preference
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'zh-CN') {
      setLangState(saved);
    } else {
      // No saved language — show the selector
      setShowSelector(true);
    }
    setInitialized(true);
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
  }, []);

  const confirmLanguage = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    setShowSelector(false);
  }, []);

  const t = useCallback((key: string): string => {
    return getTranslation(lang, key);
  }, [lang]);

  if (!initialized) {
    return null; // Prevent flash before language is determined
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, showSelector, setShowSelector, confirmLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
