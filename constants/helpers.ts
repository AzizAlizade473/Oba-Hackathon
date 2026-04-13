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

/**
 * Returns a granular FontAwesome 5 Free Solid icon name based on product name keywords.
 * Checked in priority order to avoid conflicts (e.g. "kərə yağı" before "yağ").
 */
export function getProductIcon(name: string): string {
  const n = (name || '').toLowerCase();

  // ── Energy Drinks (check first — unique keywords) ──
  if (n.includes('energetik') || n.includes('enerji') || n.includes('monster') || n.includes('redbull') || n.includes('red bull') || n.includes('burn') || n.includes('energy')) return 'bolt';

  // ── Hygiene — specific before general ──
  if (n.includes('diş pastas') || n.includes('diş fırça') || n.includes('toothpaste') || n.includes('toothbrush') || n.includes('mouthwash') || n.includes('oral-b') || n.includes('colgate')) return 'tooth';
  if (n.includes('şampun') || n.includes('shampoo') || n.includes('conditioner') || n.includes('saç')) return 'pump-soap';
  if (n.includes('sabun') || n.includes('soap') || n.includes('duş gel') || n.includes('body wash') || n.includes('shower')) return 'hands-wash';
  if (n.includes('tualet kağız') || n.includes('salfet') || n.includes('peçetə') || n.includes('toilet paper') || n.includes('tissue') || n.includes('napkin')) return 'toilet-paper';
  if (n.includes('yuyucu') || n.includes('toz') || n.includes('ağardıcı') || n.includes('dezinfeksiya') || n.includes('detergent') || n.includes('cleaner') || n.includes('bleach')) return 'pump-soap';

  // ── Coffee (before tea — more specific) ──
  if (n.includes('qəhvə') || n.includes('kofe') || n.includes('nescafe') || n.includes('coffee') || n.includes('cappuccino') || n.includes('espresso') || n.includes('latte') || n.includes('jacobs')) return 'coffee';

  // ── Tea ──
  if (n.includes('çay') || n.includes('tea') || n.includes('azerçay') || n.includes('azercay') || n.includes('lipton')) return 'mug-hot';

  // ── Soda / Carbonated ──
  if (n.includes('cola') || n.includes('pepsi') || n.includes('fanta') || n.includes('sprite') || n.includes('7up') || n.includes('gazlı') || n.includes('soda') || n.includes('schweppes') || n.includes('coca')) return 'glass-whiskey';

  // ── Juice (check BEFORE water — "meyvə suyu" contains "su") ──
  if (n.includes('şirə') || n.includes('meyvə suyu') || n.includes('nektar') || n.includes('juice') || n.includes('nectar') || n.includes('kompot')) return 'glass-whiskey';

  // ── Water ──
  if (n.includes('su') || n.includes('water') || n.includes('mineral')) return 'tint';

  // ── Dairy — butter/cream before generic yağ ──
  if (n.includes('kərə yağ') || n.includes('margarin') || n.includes('butter') || n.includes('margarine')) return 'cookie';
  if (n.includes('süd') || n.includes('milk')) return 'glass-whiskey';
  if (n.includes('pendir') || n.includes('cheese') || n.includes('mozzarella') || n.includes('cheddar') || n.includes('feta')) return 'cheese';
  if (n.includes('qatıq') || n.includes('yoğurt') || n.includes('yogurt') || n.includes('kefir') || n.includes('ayran')) return 'ice-cream';
  if (n.includes('xama') || n.includes('qaymaq') || n.includes('cream') || n.includes('sour cream')) return 'glass-whiskey';
  if (n.includes('yumurta') || n.includes('egg')) return 'egg';

  // ── Meat & Seafood ──
  if (n.includes('balıq') || n.includes('fish') || n.includes('salmon') || n.includes('tuna') || n.includes('hering') || n.includes('krevet') || n.includes('shrimp') || n.includes('seafood')) return 'fish';
  if (n.includes('sosis') || n.includes('kolbasa') || n.includes('sardelka') || n.includes('sausage') || n.includes('salami') || n.includes('ham') || n.includes('bologna')) return 'hotdog';
  if (n.includes('toyuq') || n.includes('quş') || n.includes('hind') || n.includes('chicken') || n.includes('turkey') || n.includes('poultry')) return 'drumstick-bite';
  if (n.includes('ət') || n.includes('quzu') || n.includes('mal əti') || n.includes('beef') || n.includes('lamb') || n.includes('meat') || n.includes('veal')) return 'drumstick-bite';

  // ── Sweets & Snacks ──
  if (n.includes('şokolad') || n.includes('chocolate') || n.includes('kakao') || n.includes('cocoa') || n.includes('nutella')) return 'cookie-bite';
  if (n.includes('dondurma') || n.includes('ice cream') || n.includes('gelato') || n.includes('popsicle')) return 'ice-cream';
  if (n.includes('keks') || n.includes('peçenye') || n.includes('biskvit') || n.includes('vafli') || n.includes('tort') || n.includes('cookie') || n.includes('biscuit') || n.includes('wafer') || n.includes('cake') || n.includes('pastry')) return 'cookie';
  if (n.includes('cipsi') || n.includes('chips') || n.includes('kraker') || n.includes('cracker') || n.includes('fındıq') || n.includes('badam') || n.includes('nuts') || n.includes('peanut') || n.includes('snack') || n.includes('pretzel')) return 'cookie-bite';
  if (n.includes('konfet') || n.includes('saqqız') || n.includes('karamel') || n.includes('marmelad') || n.includes('halva') || n.includes('candy') || n.includes('gum') || n.includes('marshmallow') || n.includes('jelly') || n.includes('lollipop')) return 'candy-cane';

  // ── Spices & Condiments ──
  if (n.includes('ədviyyat') || n.includes('bibər') || n.includes('duz') || n.includes('xardal') || n.includes('ketchup') || n.includes('mayonez') || n.includes('sirkə') || n.includes('spice') || n.includes('pepper') || n.includes('salt') || n.includes('mustard') || n.includes('mayo') || n.includes('vinegar') || n.includes('sauce') || n.includes('soğan tozu')) return 'pepper-hot';

  // ── Bread ──
  if (n.includes('çörək') || n.includes('lavash') || n.includes('baton') || n.includes('bread') || n.includes('toast') || n.includes('baguette')) return 'bread-slice';

  // ── Pasta ──
  if (n.includes('makaron') || n.includes('pasta') || n.includes('şehriyyə') || n.includes('spagetti') || n.includes('spaghetti') || n.includes('noodle') || n.includes('penne') || n.includes('vermicelli')) return 'utensils';

  // ── Rice & Grains ──
  if (n.includes('düyü') || n.includes('yarma') || n.includes('qarabaşaq') || n.includes('buğda') || n.includes('rice') || n.includes('grain') || n.includes('buckwheat') || n.includes('bulgur') || n.includes('oat') || n.includes('ovs')) return 'seedling';

  // ── Oil (checked AFTER butter to avoid "kərə yağı" conflict) ──
  if (n.includes('yağ') || n.includes('zeytun') || n.includes('günəbaxan') || n.includes('oil') || n.includes('olive') || n.includes('sunflower')) return 'tint';

  // ── Sugar ──
  if (n.includes('şəkər') || n.includes('qənd') || n.includes('sugar')) return 'cube';

  // ── Flour ──
  if (n.includes('un ') || n.includes(' un') || n.includes('flour')) return 'cookie';

  // ── Fruits ──
  if (n.includes('alma') || n.includes('armud') || n.includes('banan') || n.includes('nar') || n.includes('portağal') || n.includes('limon') || n.includes('üzüm') || n.includes('gilas') || n.includes('çiyələk') || n.includes('şaftalı') || n.includes('meyvə') || n.includes('apple') || n.includes('pear') || n.includes('banana') || n.includes('orange') || n.includes('lemon') || n.includes('grape') || n.includes('cherry') || n.includes('strawberry') || n.includes('fruit') || n.includes('pomegranate')) return 'apple-alt';

  // ── Vegetables ──
  if (n.includes('pomidor') || n.includes('xiyar') || n.includes('soğan') || n.includes('kartof') || n.includes('badımcan') || n.includes('yerkökü') || n.includes('kələm') || n.includes('tərəvəz') || n.includes('göyərti') || n.includes('sarımsaq') || n.includes('lobya') || n.includes('tomato') || n.includes('cucumber') || n.includes('onion') || n.includes('potato') || n.includes('eggplant') || n.includes('carrot') || n.includes('cabbage') || n.includes('vegetable') || n.includes('garlic') || n.includes('lettuce')) return 'carrot';

  // ── Fallback ──
  return 'shopping-basket';
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

/**
 * Calculates remaining time until 24h have passed since the order.
 * @param orderDate ISO date string or timestamp of the purchase
 * @returns null if 24h have passed (rating allowed), or { hours, minutes, formatted } if still waiting
 */
export function getRatingWaitTime(orderDate: string | undefined): { hours: number; minutes: number; formatted: string } | null {
  if (!orderDate) return null; // no date → allow rating

  const orderTime = new Date(orderDate).getTime();
  if (isNaN(orderTime)) return null; // invalid date → allow rating

  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const elapsed = now - orderTime;

  if (elapsed >= TWENTY_FOUR_HOURS) return null; // 24h passed → allow rating

  const remaining = TWENTY_FOUR_HOURS - elapsed;
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  return { hours, minutes, formatted: `${hours} saat ${minutes} dəqiqə` };
}
