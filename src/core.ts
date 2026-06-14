import {
  CENTS,
  CURRENCY_PREFIX,
  DECIMAL_POINT,
  HUNDRED,
  HUNDREDS,
  MAX_VALUE,
  NEGATIVE_PREFIX,
  ONES_COMBINING,
  ONES_STANDALONE,
  ORDINAL_FIRST,
  ORDINAL_HUNDRED,
  ORDINAL_SUFFIX,
  ORDINAL_TEN,
  ORDINAL_UNIT,
  SCALES,
  TEENS,
  TEENS_COMBINING,
  TEN_COMBINING,
  TENS_PREFIX,
  TENS_STANDALONE,
  YI_SUFFIX,
  ZERO,
} from './data.js';

export interface ToWordsOptions {
  /** Prefix the result with the Sinhala word for "rupees". */
  currency?: boolean;
  /** Render the number as an ordinal (1st, 2nd, 3rd, ...). */
  ordinal?: boolean;
  /** Append the assertive particle 'යි' to the result, e.g. 'පහ' -> 'පහයි'. Ignored when `currency` or `ordinal` is set, since both already produce a complete form. */
  assert?: boolean;
}

/** Converts 1-99 to words, e.g. 35 -> 'තිස් පහ', 12 -> 'දොළහ'. */
function tensAndOnesToWords(n: number): string {
  if (n <= 9) return ONES_STANDALONE[n];
  if (n === 10) return TENS_STANDALONE[1];
  if (n < 20) return TEENS[n - 10];

  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (ones === 0) return TENS_STANDALONE[tens];
  return `${TENS_PREFIX[tens]} ${ONES_STANDALONE[ones]}`;
}

/** Converts 1-999 to words, e.g. 350 -> 'තුන්සිය පනහ'. */
function hundredsGroupToWords(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;

  const parts: string[] = [];
  if (hundreds > 0) parts.push(HUNDREDS[hundreds]);
  if (rest > 0) parts.push(tensAndOnesToWords(rest));
  return parts.join(' ');
}

/** Converts 1-99 to a multiplier preceding a scale word, e.g. (35, 'දහස්') -> 'තිස් පන් දහස්'. */
function multiplierToWords(n: number, scaleWord: string): string {
  if (n <= 9) {
    if (n === 2) return `දෙ${scaleWord}`;
    return `${ONES_COMBINING[n]} ${scaleWord}`;
  }
  if (n === 10) return `${TEN_COMBINING} ${scaleWord}`;
  if (n < 20) return `${TEENS_COMBINING[n - 10]} ${scaleWord}`;

  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (ones === 0) return `${TENS_PREFIX[tens]} ${scaleWord}`;
  return `${TENS_PREFIX[tens]} ${ONES_COMBINING[ones]} ${scaleWord}`;
}

/** Converts 1-999 occurring before a scale word (e.g. 235 -> 'දෙසිය තිස් පහ ලක්ෂ'). */
function scaleGroupToWords(n: number, scaleWord: string): string {
  if (n <= 99) return multiplierToWords(n, scaleWord);
  return `${hundredsGroupToWords(n)} ${scaleWord}`;
}

function positiveIntegerToWords(n: number): string {
  if (n === 0) return ZERO;

  const parts: string[] = [];
  let remaining = n;
  for (const { value, word } of SCALES) {
    const group = Math.floor(remaining / value);
    if (group > 0) parts.push(scaleGroupToWords(group, word));
    remaining %= value;
  }
  if (remaining > 0) parts.push(hundredsGroupToWords(remaining));

  return parts.join(' ');
}

/** Converts 1-99 to an ordinal suffix, e.g. 35 -> 'තිස් පස්වෙනි'. */
function ordinalUpTo99(n: number): string {
  if (n === 10) return ORDINAL_TEN;
  if (n < 10) return ORDINAL_UNIT[n];
  if (n < 20) return `${TEENS_COMBINING[n - 10]}${ORDINAL_SUFFIX}`;

  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (ones === 0) return `${TENS_PREFIX[tens]}${ORDINAL_SUFFIX}`;
  return `${TENS_PREFIX[tens]} ${ORDINAL_UNIT[ones]}`;
}

/** Converts a non-negative integer to words, special-casing 100 -> 'සියය'. */
function cardinalWords(n: number): string {
  return n === 100 ? HUNDRED : positiveIntegerToWords(n);
}

/** Converts a single digit (0-9) to its standalone word, e.g. 0 -> 'බිංදුව', 4 -> 'හතර'. */
function digitToWords(digit: number): string {
  return digit === 0 ? ZERO : ONES_STANDALONE[digit];
}

/**
 * Converts a non-integer number to words: the integer part, suffixed with
 * 'යි', followed by 'දශම' and each fractional digit (also suffixed with
 * 'යි', except the last digit).
 *
 * @example
 * decimalToWords(13.14) // 'දහතුනයි දශම එකයි හතර'
 * decimalToWords(501.231) // 'පන්සිය එකයි දශම දෙකයි තුනයි එක'
 */
function decimalToWords(num: number): string {
  const [integerPart, fractionPart] = Math.abs(num).toString().split('.');

  const integerWords = `${cardinalWords(Number(integerPart))}${YI_SUFFIX}`;
  const fractionDigits = fractionPart.split('').map(Number);
  const fractionWords = fractionDigits
    .map((digit, i) => {
      const word = digitToWords(digit);
      return i === fractionDigits.length - 1 ? word : `${word}${YI_SUFFIX}`;
    })
    .join(' ');

  const result = `${integerWords} ${DECIMAL_POINT} ${fractionWords}`;
  return num < 0 ? `${NEGATIVE_PREFIX} ${result}` : result;
}

/**
 * Converts a non-integer number to its ordinal word form: like
 * {@link decimalToWords}, but the last fractional digit is rendered as an
 * ordinal instead of a cardinal.
 *
 * @example
 * decimalOrdinalToWords(13.14) // 'දහතුනයි දශම එකයි හතරවෙනි'
 * decimalOrdinalToWords(3.1) // 'තුනයි දශම එක්වෙනි'
 */
function decimalOrdinalToWords(num: number): string {
  const [integerPart, fractionPart] = Math.abs(num).toString().split('.');

  const integerWords = `${cardinalWords(Number(integerPart))}${YI_SUFFIX}`;
  const fractionDigits = fractionPart.split('').map(Number);
  const fractionWords = fractionDigits
    .map((digit, i) => {
      if (i < fractionDigits.length - 1) return `${digitToWords(digit)}${YI_SUFFIX}`;
      return digit === 0 ? `${ZERO}${ORDINAL_SUFFIX}` : ordinalUpTo99(digit);
    })
    .join(' ');

  const result = `${integerWords} ${DECIMAL_POINT} ${fractionWords}`;
  return num < 0 ? `${NEGATIVE_PREFIX} ${result}` : result;
}

/**
 * Converts a decimal currency amount to words as rupees and cents,
 * rounding to the nearest cent. The trailing 'යි' is only added when
 * `assert` is set.
 *
 * @example
 * decimalCurrencyToWords(2550.75, false) // 'රුපියල් දෙදහස් පන්සිය පනහයි ශත හැත්තෑ පහ'
 * decimalCurrencyToWords(2550.75, true) // 'රුපියල් දෙදහස් පන්සිය පනහයි ශත හැත්තෑ පහයි'
 */
function decimalCurrencyToWords(num: number, assert: boolean): string {
  const totalCents = Math.round(Math.abs(num) * 100);
  const rupees = Math.floor(totalCents / 100);
  const cents = totalCents % 100;

  let words = cents > 0
    ? `${cardinalWords(rupees)}${YI_SUFFIX} ${CENTS} ${cardinalWords(cents)}`
    : cardinalWords(rupees);
  if (assert) words += YI_SUFFIX;
  if (num < 0) words = `${NEGATIVE_PREFIX} ${words}`;

  return `${CURRENCY_PREFIX} ${words}`;
}

/**
 * Converts a decimal currency amount to its ordinal word form: the rupees,
 * followed by 'ශත' and the cents rendered as an ordinal, rounding to the
 * nearest cent.
 *
 * @example
 * decimalCurrencyOrdinalToWords(13.14) // 'රුපියල් දහතුනයි ශත දාහතරවෙනි'
 * decimalCurrencyOrdinalToWords(2550.75) // 'රුපියල් දෙදහස් පන්සිය පනහයි ශත හැත්තෑ පස්වෙනි'
 */
function decimalCurrencyOrdinalToWords(num: number): string {
  const totalCents = Math.round(Math.abs(num) * 100);
  const rupees = Math.floor(totalCents / 100);
  const cents = totalCents % 100;

  const centsOrdinal = cents === 0 ? `${ZERO}${ORDINAL_SUFFIX}` : ordinalUpTo99(cents);
  let words = `${cardinalWords(rupees)}${YI_SUFFIX} ${CENTS} ${centsOrdinal}`;
  if (num < 0) words = `${NEGATIVE_PREFIX} ${words}`;

  return `${CURRENCY_PREFIX} ${words}`;
}

function positiveIntegerToOrdinalWords(n: number): string {
  if (n === 1) return ORDINAL_FIRST;
  if (n === 100) return ORDINAL_HUNDRED;
  if (n <= 99) return ordinalUpTo99(n);

  const lastChunk = n % 100;
  const prefixValue = n - lastChunk;
  if (lastChunk === 0) return `${positiveIntegerToWords(n)}${ORDINAL_SUFFIX}`;
  return `${positiveIntegerToWords(prefixValue)} ${ordinalUpTo99(lastChunk)}`;
}

/**
 * Converts a number to its Sinhala word form.
 *
 * @example
 * toWords(35) // 'තිස් පහ'
 * toWords(200) // 'දෙසිය'
 * toWords(1500) // 'එක් දහස් පන්සිය'
 * toWords(2550, { currency: true }) // 'රුපියල් දෙදහස් පන්සිය පනහ'
 */
export function toWords(num: number, options: ToWordsOptions = {}): string {
  if (typeof num !== 'number') {
    throw new TypeError(`toWords expects a number, got ${typeof num}`);
  }
  if (Number.isNaN(num)) {
    throw new TypeError('toWords expects a valid number, got NaN');
  }
  if (!Number.isFinite(num)) {
    throw new RangeError('toWords expects a finite number, got Infinity');
  }
  if (Math.abs(Math.trunc(num)) > MAX_VALUE) {
    throw new RangeError(`toWords only supports numbers up to ${MAX_VALUE}`);
  }

  if (options.ordinal) {
    if (!Number.isInteger(num)) {
      const ordinal = options.currency ? decimalCurrencyOrdinalToWords(num) : decimalOrdinalToWords(num);
      return finalize(ordinal, options);
    }
    if (num < 1) throw new RangeError('ordinal numbers must be 1 or greater');
    const ordinal = positiveIntegerToOrdinalWords(num);
    return finalize(options.currency ? `${CURRENCY_PREFIX} ${ordinal}` : ordinal, options);
  }

  if (!Number.isInteger(num)) {
    if (options.currency) return decimalCurrencyToWords(num, !!options.assert);
    return finalize(decimalToWords(num), options);
  }

  const words = num < 0 ? `${NEGATIVE_PREFIX} ${cardinalWords(-num)}` : cardinalWords(num);

  if (options.currency) {
    return `${CURRENCY_PREFIX} ${options.assert ? `${words}${YI_SUFFIX}` : words}`;
  }
  return finalize(words, options);
}

/** Appends the assertive particle 'යි' when `options.assert` is set (and not already added by `currency` or `ordinal`). */
function finalize(result: string, options: ToWordsOptions): string {
  return options.assert && !options.currency && !options.ordinal ? `${result}${YI_SUFFIX}` : result;
}

/** Maps every cardinal word (standalone and combining forms) to its numeric value. */
const VALUE_MAP = new Map<string, number>([[ZERO, 0], [TEN_COMBINING, 10], [HUNDRED, 100]]);
for (let i = 1; i <= 9; i++) {
  VALUE_MAP.set(ONES_STANDALONE[i], i);
  VALUE_MAP.set(ONES_COMBINING[i], i);
  VALUE_MAP.set(TEENS[i], 10 + i);
  VALUE_MAP.set(TEENS_COMBINING[i], 10 + i);
  VALUE_MAP.set(HUNDREDS[i], i * 100);
  if (i >= 2) {
    VALUE_MAP.set(TENS_STANDALONE[i], i * 10);
    VALUE_MAP.set(TENS_PREFIX[i], i * 10);
  }
}
VALUE_MAP.set(TENS_STANDALONE[1], 10);

/** Maps scale words to their value, applied as a multiplier on the accumulated total. */
const SCALE_MAP = new Map<string, number>(SCALES.map(({ value, word }) => [word, value]));

/** Maps fused "2 x scale" words (e.g. 'දෙදහස්') directly to their value. */
const FUSED_SCALE_MAP = new Map<string, number>(
  SCALES.map(({ value, word }) => [`දෙ${word}`, value * 2]),
);

/**
 * Parses a Sinhala number word string back into a number. The inverse of
 * {@link toWords} for its cardinal (non-ordinal) output.
 *
 * @example
 * toNumber('තිස් පහ') // 35
 * toNumber('රුපියල් දෙදහස් පන්සිය පනහ') // 2550
 */
export function toNumber(text: string): number {
  if (typeof text !== 'string') {
    throw new TypeError(`toNumber expects a string, got ${typeof text}`);
  }

  const tokens = text.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    throw new SyntaxError('cannot parse an empty string');
  }

  let negative = false;
  if (tokens[0] === NEGATIVE_PREFIX) {
    negative = true;
    tokens.shift();
  }
  if (tokens[0] === CURRENCY_PREFIX) {
    tokens.shift();
    const last = tokens[tokens.length - 1];
    if (last?.endsWith(YI_SUFFIX)) {
      tokens[tokens.length - 1] = last.slice(0, -YI_SUFFIX.length);
    }
  }
  if (tokens.length === 0) {
    throw new SyntaxError('cannot parse an empty string');
  }

  let total = 0;
  let acc = 0;
  for (const token of tokens) {
    if (token === ZERO) {
      continue;
    } else if (FUSED_SCALE_MAP.has(token)) {
      total += acc + FUSED_SCALE_MAP.get(token)!;
      acc = 0;
    } else if (SCALE_MAP.has(token)) {
      total += acc * SCALE_MAP.get(token)!;
      acc = 0;
    } else if (VALUE_MAP.has(token)) {
      acc += VALUE_MAP.get(token)!;
    } else {
      throw new SyntaxError(`unrecognized Sinhala number word: '${token}'`);
    }
  }
  total += acc;

  return negative ? -total : total;
}
