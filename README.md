# sinhala-numwords

Convert numbers (including decimals, currency amounts, and ordinals) to Sinhala words, and back — useful for payroll slips, invoices, cheques, and legal documents.

## Install

```sh
npm install sinhala-numwords
```

## Usage

```ts
import { toWords, toNumber } from 'sinhala-numwords';

toWords(35); // 'තිස් පහ'
toWords(200); // 'දෙසිය'
toWords(1500); // 'එක් දහස් පන්සිය'
toWords(2550, { currency: true }); // 'රුපියල් දෙදහස් පන්සිය පනහයි'
toWords(3, { ordinal: true }); // 'තුන්වෙනි'
toWords(13.14); // 'දහතුනයි දශම එකයි හතර'
toWords(2550.75, { currency: true }); // 'රුපියල් දෙදහස් පන්සිය පනහයි ශත හැත්තෑ පහයි'

toNumber('තිස් පහ'); // 35
toNumber('රුපියල් දෙදහස් පන්සිය පනහයි'); // 2550
```

A default export is also available for those who prefer it:

```ts
import sinhalaNum from 'sinhala-numwords';

sinhalaNum.toWords(350);
sinhalaNum.toNumber('තුන්සිය පනහ');
```

## API

### `toWords(num, options?)`

Converts a number to its Sinhala word form.

- `num` — a number between `-9,999,999,999` and `9,999,999,999`. May include decimals.
- `options.currency` — prefix the result with "රුපියල්" (rupees) and suffix the result with "යි".
  Decimal amounts are read as rupees and cents (`ශත`), e.g. `2550.75` -> `රුපියල් දෙදහස් පන්සිය පනහයි ශත හැත්තෑ පහයි`.
- `options.ordinal` — render as an ordinal (1st, 2nd, 3rd, ...). For integers, requires `num >= 1`.
- `options.assert` — append the assertive particle "යි" to the result, e.g. `toWords(5, { assert: true })` -> `'පහයි'`. Ignored when `currency` is set, which already appends "යි".

Decimal numbers (without `currency`) are read digit-by-digit after "දශම" (point), e.g.
`501.231` -> `පන්සිය එකයි දශම දෙකයි තුනයි එක`.

Decimal ordinals render the last fractional digit as an ordinal, e.g.
`13.14` with `ordinal: true` -> `දහතුනයි දශම එකයි හතරවෙනි`.

**Errors:**

| Input | Throws |
| --- | --- |
| Not a `number` (string, `null`, `undefined`, array, ...) | `TypeError` |
| `NaN` | `TypeError` |
| `Infinity` / `-Infinity` | `RangeError` |
| Outside ±9,999,999,999 | `RangeError` |
| `ordinal: true` with an integer `num < 1` | `RangeError` |

### `toNumber(text)`

Parses a Sinhala cardinal number word string (optionally with a `රුපියල් ... යි` currency prefix/suffix) back into a number. The inverse of `toWords` for its plain or currency integer output (not ordinal or decimal).

**Errors:**

| Input | Throws |
| --- | --- |
| Not a `string` | `TypeError` |
| Empty string | `SyntaxError` |
| Unrecognized or non-Sinhala words (including digits like `'350'`) | `SyntaxError` |
| Mixed Sinhala/Latin text | `SyntaxError` |

## License

MIT @InukaWijerathna
