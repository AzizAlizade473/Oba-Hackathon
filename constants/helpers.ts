// constants/helpers.ts

export const CAT_KEYS = ['All', 'Dairy', 'Meat', 'Food', 'Sweets', 'Drinks', 'Hygiene'] as const;
export type CategoryKey = typeof CAT_KEYS[number];

export const ITEMS_PER_PAGE = 20;

export function guessCategory(name: string): string {
  const n = (name || '').toLowerCase();
  if (n.includes('süd') || n.includes('yağ') || n.includes('pendir') || n.includes('xama') || n.includes('milk') || n.includes('butter')) return 'Dairy';
  if (n.includes('sosis') || n.includes('ət')) return 'Meat';
  if (n.includes('çay') || n.includes('cola') || n.includes('pepsi') || n.includes('juice') || n.includes('şirə')) return 'Drinks';
  if (n.includes('keks') || n.includes('şokolad') || n.includes('cookie') || n.includes('chips') || n.includes('cipsi') || n.includes('flakes')) return 'Sweets';
  if (n.includes('sabun') || n.includes('kağız') || n.includes('soap') || n.includes('şampun') || n.includes('toothpaste')) return 'Hygiene';
  if (n.includes('pasta') || n.includes('makaron')) return 'Food';
  return 'Food';
}

export function getRank(balance: number): string {
  if (balance >= 10) return 'Gold';
  if (balance >= 5) return 'Silver';
  return 'Bronze';
}

export function formatDay(dateString: string): number {
  return new Date(dateString).getDate();
}

export function formatMonth(dateString: string): string {
  if (!dateString) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[new Date(dateString).getMonth()];
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(dateString: string, t: Record<string, string>): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return t.today;
  if (date.toDateString() === yesterday.toDateString()) return t.yesterday;
  return date.toLocaleDateString('az-AZ', { day: '2-digit', month: 'short' });
}

export function getCategoryIcon(catKey: string): string {
  const map: Record<string, string> = {
    Dairy: '🧀',
    Drinks: '🍶',
    Food: '🌾',
    Sweets: '🍪',
    Hygiene: '🧴',
    Meat: '🍖',
  };
  return map[catKey] || '🛒';
}

export function getCategoryColors(catKey: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    Dairy: { bg: '#DBEAFE', text: '#1D4ED8' },
    Drinks: { bg: '#EDE9FE', text: '#7C3AED' },
    Food: { bg: '#FEF3C7', text: '#D97706' },
    Sweets: { bg: '#FCE7F3', text: '#DB2777' },
    Hygiene: { bg: '#CCFBF1', text: '#0F766E' },
    Meat: { bg: '#FEE2E2', text: '#DC2626' },
  };
  return map[catKey] || { bg: '#F3F4F6', text: '#374151' };
}
