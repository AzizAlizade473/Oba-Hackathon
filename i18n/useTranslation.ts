// i18n/useTranslation.ts

import { useMemo } from 'react';
import { translations } from './translations';
import type { Lang } from '../types';
export type TranslationDict = Record<string, unknown>;

export interface UseTranslationReturn {
  t: TranslationDict;
  getText: (key: string) => string;
  getExactMonth: (key: string) => string;
  getCategoryLabel: (key: string) => string;
}

export function useTranslation(lang: Lang): UseTranslationReturn {
  const t = useMemo(() => translations[lang] as TranslationDict, [lang]);

  function getText(key: string): string {
    return (t[key] as string) || key;
  }

  function getExactMonth(key: string): string {
    const months = t.months as Record<string, string> | undefined;
    return months?.[key] || key;
  }

  function getCategoryLabel(key: string): string {
    if (key === 'All') return getText('all');
    const categories = t.categories as Record<string, string> | undefined;
    return categories?.[key] || key;
  }

  return { t, getText, getExactMonth, getCategoryLabel };
}
