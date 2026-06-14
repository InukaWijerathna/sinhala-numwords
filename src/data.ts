/**
 * Sinhala number word lookup tables.
 *
 * Sinhala numbers are not built from a single "digit word" pattern the way
 * English is (e.g. "twenty-five" = "twenty" + "five"). Many forms have
 * irregular shapes depending on whether the word stands alone, or whether
 * it combines with a following word (tens before ones, or a multiplier
 * before a scale word like "දහස්" / "ලක්ෂ" / "කෝටි").
 */

export const ZERO = 'බිංදුව';

/** 1-9 as they appear on their own, e.g. toWords(5) === 'පහ'. */
export const ONES_STANDALONE = [
  '',
  'එක',
  'දෙක',
  'තුන',
  'හතර',
  'පහ',
  'හය',
  'හත',
  'අට',
  'නවය',
] as const;

/** 1-9 combining forms, used directly before another word (e.g. 'එක් දහස්'). */
export const ONES_COMBINING = [
  '',
  'එක්',
  'දෙ',
  'තුන්',
  'හාර',
  'පන්',
  'හය',
  'හත්',
  'අට',
  'නව',
] as const;

/** Exact multiples of ten (10, 20, ..., 90) as they appear on their own. */
export const TENS_STANDALONE = [
  '',
  'දහය',
  'විස්ස',
  'තිහ',
  'හතළිහ',
  'පනහ',
  'හැට',
  'හැත්තෑව',
  'අසූව',
  'අනූව',
] as const;

/** Combining prefixes for 20-90, used before a ones word (e.g. 'තිස් පහ' = 35). */
export const TENS_PREFIX = [
  '',
  '',
  'විසි',
  'තිස්',
  'හතළිස්',
  'පනස්',
  'හැට',
  'හැත්තෑ',
  'අසූ',
  'අනූ',
] as const;

/** 11-19 as they appear on their own, indexed by the ones digit (1-9). */
export const TEENS = [
  '',
  'එකොළහ',
  'දොළහ',
  'දහතුන',
  'දාහතර',
  'පහළොව',
  'දාසය',
  'දාහත',
  'දහඅට',
  'දහනවය',
] as const;

/** 11-19 combining forms, used before a scale word (e.g. 'එකොළොස් දහස්' = 11000). */
export const TEENS_COMBINING = [
  '',
  'එකොළොස්',
  'දොළොස්',
  'දහතුන්',
  'දාහතර',
  'පහළොස්',
  'දාසය',
  'දාහත්',
  'දහඅට',
  'දහනව',
] as const;

/** Combining form of 10, used before a scale word (e.g. 'දස දහස්' = 10000). */
export const TEN_COMBINING = 'දස';

/** Full words for 100-900 (the hundreds digit already fuses with 'සිය'). */
export const HUNDREDS = [
  '',
  'එකසිය',
  'දෙසිය',
  'තුන්සිය',
  'හාරසිය',
  'පන්සිය',
  'හයසිය',
  'හත්සිය',
  'අටසිය',
  'නවසිය',
] as const;

/** Scale words for groups above 1000, largest first. */
export const SCALES = [
  { value: 10_000_000, word: 'කෝටි' },
  { value: 100_000, word: 'ලක්ෂ' },
  { value: 1_000, word: 'දහස්' },
] as const;

/** Largest integer this package can render in words. */
export const MAX_VALUE = 9_999_999_999;

export const NEGATIVE_PREFIX = 'ඍණ';
export const CURRENCY_PREFIX = 'රුපියල්';
/** Appended to a word for emphasis, e.g. 'එක' -> 'එකයි'. Used for currency amounts and decimals. */
export const YI_SUFFIX = 'යි';
/** Separates the integer and fractional parts of a decimal number. */
export const DECIMAL_POINT = 'දශම';
/** Word for the currency subunit (cents), e.g. 'රුපියල් එකසිය එකයි ශත පහයි'. */
export const CENTS = 'ශත';

/** 1-9 ordinal suffixes used both standalone and inside compounds. */
export const ORDINAL_UNIT = [
  '',
  'එක්වෙනි',
  'දෙවෙනි',
  'තුන්වෙනි',
  'හතරවෙනි',
  'පස්වෙනි',
  'හයවෙනි',
  'හත්වෙනි',
  'අටවෙනි',
  'නවවෙනි',
] as const;

export const ORDINAL_FIRST = 'පළවෙනි';
export const ORDINAL_TEN = 'දහවෙනි';
export const ORDINAL_SUFFIX = 'වෙනි';

/** Standalone word for 100, e.g. toWords(100) -> 'සියය'. */
export const HUNDRED = 'සියය';
/** Ordinal for 100, e.g. toWords(100, { ordinal: true }) -> 'සියවෙනි'. */
export const ORDINAL_HUNDRED = 'සියවෙනි';
