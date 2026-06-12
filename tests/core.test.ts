import { describe, expect, it } from 'vitest';
import sinhalaNumwords, { toNumber, toWords } from '../src/index.js';

describe('toWords', () => {
  it('converts zero', () => {
    expect(toWords(0)).toBe('බිංදුව');
  });

  it('converts single digits', () => {
    expect(toWords(1)).toBe('එක');
    expect(toWords(5)).toBe('පහ');
    expect(toWords(9)).toBe('නවය');
  });

  it('converts teens', () => {
    expect(toWords(11)).toBe('එකොළහ');
    expect(toWords(12)).toBe('දොළහ');
    expect(toWords(19)).toBe('දහනවය');
  });

  it('converts exact tens', () => {
    expect(toWords(10)).toBe('දහය');
    expect(toWords(20)).toBe('විස්ස');
    expect(toWords(50)).toBe('පනහ');
    expect(toWords(90)).toBe('අනූව');
  });

  it('converts compound tens and ones', () => {
    expect(toWords(21)).toBe('විසි එක');
    expect(toWords(35)).toBe('තිස් පහ');
    expect(toWords(99)).toBe('අනූ නවය');
  });

  it('converts hundreds', () => {
    expect(toWords(100)).toBe('එක්සිය');
    expect(toWords(200)).toBe('දෙසිය');
    expect(toWords(350)).toBe('තුන්සිය පනහ');
    expect(toWords(999)).toBe('නවසිය අනූ නවය');
  });

  it('converts thousands', () => {
    expect(toWords(1000)).toBe('එක් දහස්');
    expect(toWords(1500)).toBe('එක් දහස් පන්සිය');
    expect(toWords(2000)).toBe('දෙදහස්');
    expect(toWords(35000)).toBe('තිස් පන් දහස්');
  });

  it('converts lakhs and crores', () => {
    expect(toWords(100000)).toBe('එක් ලක්ෂ');
    expect(toWords(10000000)).toBe('එක් කෝටි');
  });

  it('converts negative numbers', () => {
    expect(toWords(-5)).toBe('ඍණ පහ');
  });

  it('supports the currency option', () => {
    expect(toWords(2550, { currency: true })).toBe('රුපියල් දෙදහස් පන්සිය පනහ');
    expect(toWords(0, { currency: true })).toBe('රුපියල් බිංදුව');
  });

  it('supports the ordinal option', () => {
    expect(toWords(1, { ordinal: true })).toBe('පළමුවැනි');
    expect(toWords(2, { ordinal: true })).toBe('දෙවැනි');
    expect(toWords(10, { ordinal: true })).toBe('දහවැනි');
    expect(toWords(35, { ordinal: true })).toBe('තිස් පස්වැනි');
  });

  it('rejects non-integers and out-of-range numbers', () => {
    expect(() => toWords(1.5)).toThrow(RangeError);
    expect(() => toWords(3.14)).toThrow(RangeError);
    expect(() => toWords(10_000_000_000)).toThrow(RangeError);
    expect(() => toWords(Infinity)).toThrow(RangeError);
    expect(() => toWords(-Infinity)).toThrow(RangeError);
  });

  it('rejects invalid input types', () => {
    // @ts-expect-error testing runtime validation of bad input
    expect(() => toWords('hello')).toThrow(TypeError);
    // @ts-expect-error testing runtime validation of bad input
    expect(() => toWords(null)).toThrow(TypeError);
    // @ts-expect-error testing runtime validation of bad input
    expect(() => toWords(undefined)).toThrow(TypeError);
    // @ts-expect-error testing runtime validation of bad input
    expect(() => toWords([350])).toThrow(TypeError);
    expect(() => toWords(NaN)).toThrow(TypeError);
  });
});

describe('default export', () => {
  it('exposes toWords and toNumber as a single object', () => {
    expect(sinhalaNumwords.toWords(350)).toBe(toWords(350));
    expect(sinhalaNumwords.toNumber('තිස් පහ')).toBe(35);
  });
});

describe('toNumber', () => {
  it('parses zero', () => {
    expect(toNumber('බිංදුව')).toBe(0);
  });

  it('parses single digits and teens', () => {
    expect(toNumber('පහ')).toBe(5);
    expect(toNumber('එකොළහ')).toBe(11);
  });

  it('parses compound tens and ones', () => {
    expect(toNumber('විසි එක')).toBe(21);
    expect(toNumber('තිස් පහ')).toBe(35);
  });

  it('parses hundreds', () => {
    expect(toNumber('දෙසිය')).toBe(200);
    expect(toNumber('තුන්සිය පනහ')).toBe(350);
  });

  it('parses thousands', () => {
    expect(toNumber('එක් දහස්')).toBe(1000);
    expect(toNumber('එක් දහස් පන්සිය')).toBe(1500);
    expect(toNumber('දෙදහස් පන්සිය පනහ')).toBe(2550);
    expect(toNumber('තිස් පන් දහස්')).toBe(35000);
  });

  it('parses negative numbers and currency prefixes', () => {
    expect(toNumber('ඍණ පහ')).toBe(-5);
    expect(toNumber('රුපියල් දෙදහස් පන්සිය පනහ')).toBe(2550);
  });

  it('round-trips a range of numbers through toWords', () => {
    for (const n of [0, 1, 9, 10, 11, 19, 20, 21, 35, 99, 100, 101, 199, 350, 999, 1000, 1500, 2550, 9999, 12345, 100000, 999999]) {
      expect(toNumber(toWords(n))).toBe(n);
    }
  });

  it('throws on unrecognized words', () => {
    expect(() => toNumber('not sinhala')).toThrow(SyntaxError);
    expect(() => toNumber('350')).toThrow(SyntaxError);
    expect(() => toNumber('තුන්සිය 50')).toThrow(SyntaxError);
    expect(() => toNumber('')).toThrow(SyntaxError);
  });

  it('rejects invalid input types', () => {
    // @ts-expect-error testing runtime validation of bad input
    expect(() => toNumber(350)).toThrow(TypeError);
    // @ts-expect-error testing runtime validation of bad input
    expect(() => toNumber(null)).toThrow(TypeError);
    // @ts-expect-error testing runtime validation of bad input
    expect(() => toNumber(undefined)).toThrow(TypeError);
  });
});
