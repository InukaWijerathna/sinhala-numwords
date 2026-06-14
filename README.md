# sinhala-numwords

The first npm package to convert numbers to Sinhala (සිංහල) words — zero dependencies, TypeScript-first.
Convert numbers (including decimals, currency amounts, and ordinals) to Sinhala words, and back — useful for payroll slips, invoices, cheques, and legal documents.

## Install

```sh
npm install sinhala-numwords
```

## Quick start

```ts
import { toWords, toNumber } from 'sinhala-numwords';

toWords(35); // 'තිස් පහ'
toWords(2550.75, { currency: true }); // 'රුපියල් දෙදහස් පන්සිය පනහයි ශත හැත්තෑ පහ'
toNumber('තිස් පහ'); // 35
```

A default export is also available for those who prefer it:

```ts
import sinhalaNum from 'sinhala-numwords';

sinhalaNum.toWords(350);
sinhalaNum.toNumber('තුන්සිය පනහ');
```

## `toWords(num, options?)`

Converts a number to its Sinhala word form.

- `num` — a number between `-9,999,999,999` and `9,999,999,999`. May include decimals.
- `options.currency` — read as money (rupees and cents).
- `options.ordinal` — read as an ordinal (1st, 2nd, 3rd, ...).
- `options.assert` — append the assertive particle "යි" (e.g. "පහ" -> "පහයි").

### Plain numbers

```ts
toWords(0); // 'බිංදුව'
toWords(5); // 'පහ'
toWords(35); // 'තිස් පහ'
toWords(100); // 'සියය'
toWords(200); // 'දෙසිය'
toWords(1000); // 'එක් දහස්'
toWords(1500); // 'එක් දහස් පන්සිය'
toWords(100000); // 'එක් ලක්ෂ'
toWords(10000000); // 'එක් කෝටි'
toWords(-5); // 'ඍණ පහ'
```

### Decimal numbers

Read digit-by-digit after "දශම" (point):

```ts
toWords(13.14); // 'දහතුනයි දශම එකයි හතර'
toWords(0.5); // 'බිංදුවයි දශම පහ'
toWords(501.231); // 'පන්සිය එකයි දශම දෙකයි තුනයි එක'
toWords(-13.14); // 'ඍණ දහතුනයි දශම එකයි හතර'
```

### Ordinal numbers (`ordinal: true`)

```ts
toWords(1, { ordinal: true }); // 'පළවෙනි'
toWords(2, { ordinal: true }); // 'දෙවෙනි'
toWords(10, { ordinal: true }); // 'දහවෙනි'
toWords(35, { ordinal: true }); // 'තිස් පස්වෙනි'
```

Negative integers are prefixed with "ඍණ":

```ts
toWords(-3, { ordinal: true }); // 'ඍණ තුන්වෙනි'
toWords(-35, { ordinal: true }); // 'ඍණ තිස් පස්වෙනි'
```

Decimal ordinals render the last fractional digit as an ordinal:

```ts
toWords(13.14, { ordinal: true }); // 'දහතුනයි දශම එකයි හතරවෙනි'
toWords(3.1, { ordinal: true }); // 'තුනයි දශම එක්වෙනි'
```

`0` has no ordinal form and throws a `RangeError` for `ordinal: true`.

### Currency amounts (`currency: true`)

Prefixes the result with "රුපියල්" (rupees):

```ts
toWords(2550, { currency: true }); // 'රුපියල් දෙදහස් පන්සිය පනහ'
toWords(0, { currency: true }); // 'රුපියල් බිංදුව'
toWords(101, { currency: true }); // 'රුපියල් එකසිය එක'
```

Decimal amounts are read as rupees and cents ("ශත"), rounded to the nearest cent:

```ts
toWords(2550.75, { currency: true }); // 'රුපියල් දෙදහස් පන්සිය පනහයි ශත හැත්තෑ පහ'
toWords(101.05, { currency: true }); // 'රුපියල් එකසිය එකයි ශත පහ'
toWords(101.0, { currency: true }); // 'රුපියල් එකසිය එක' (no cents when amount is whole)
```

`currency: true` does not support negative amounts and throws a `RangeError`.

Combine with `ordinal: true` to read the cents as an ordinal:

```ts
toWords(13.14, { currency: true, ordinal: true }); // 'රුපියල් දහතුනයි ශත දාහතරවෙනි'
toWords(2550.75, { currency: true, ordinal: true }); // 'රුපියල් දෙදහස් පන්සිය පනහයි ශත හැත්තෑ පස්වෙනි'
```

### Assertive form (`assert: true`)

Appends "යි" to the final word for emphasis, e.g. when reading a final amount aloud:

```ts
toWords(5, { assert: true }); // 'පහයි'
toWords(-5, { assert: true }); // 'ඍණ පහයි'
toWords(13.14, { assert: true }); // 'දහතුනයි දශම එකයි හතරයි'
toWords(2550, { currency: true, assert: true }); // 'රුපියල් දෙදහස් පන්සිය පනහයි'
toWords(2550.75, { currency: true, assert: true }); // 'රුපියල් දෙදහස් පන්සිය පනහයි ශත හැත්තෑ පහයි'
```

Ignored when `ordinal` is set, since ordinal forms ("...වෙනි") are already grammatically complete:

```ts
toWords(3, { ordinal: true, assert: true }); // 'තුන්වෙනි'
toWords(13.14, { ordinal: true, assert: true }); // 'දහතුනයි දශම එකයි හතරවෙනි'
```

### Combining options

`ordinal`, `currency`, and `assert` can all be combined. Here's the full matrix for `35` and `13.14`:

| ordinal | currency | assert | `toWords(35, ...)` | `toWords(13.14, ...)` |
| --- | --- | --- | --- | --- |
| – | – | – | `තිස් පහ` | `දහතුනයි දශම එකයි හතර` |
| – | – | ✓ | `තිස් පහයි` | `දහතුනයි දශම එකයි හතරයි` |
| – | ✓ | – | `රුපියල් තිස් පහ` | `රුපියල් දහතුනයි ශත දාහතර` |
| – | ✓ | ✓ | `රුපියල් තිස් පහයි` | `රුපියල් දහතුනයි ශත දාහතරයි` |
| ✓ | – | – | `තිස් පස්වෙනි` | `දහතුනයි දශම එකයි හතරවෙනි` |
| ✓ | – | ✓ | `තිස් පස්වෙනි` (assert ignored) | `දහතුනයි දශම එකයි හතරවෙනි` (assert ignored) |
| ✓ | ✓ | – | `රුපියල් තිස් පස්වෙනි` | `රුපියල් දහතුනයි ශත දාහතරවෙනි` |
| ✓ | ✓ | ✓ | `රුපියල් තිස් පස්වෙනි` (assert ignored) | `රුපියල් දහතුනයි ශත දාහතරවෙනි` (assert ignored) |

### Errors

| Input | Throws |
| --- | --- |
| Not a `number` (string, `null`, `undefined`, array, ...) | `TypeError` |
| `NaN` | `TypeError` |
| `Infinity` / `-Infinity` | `RangeError` |
| Outside ±9,999,999,999 | `RangeError` |
| `ordinal: true` with `num === 0` | `RangeError` |
| `currency: true` with a negative `num` | `RangeError` |

## `toNumber(text)`

Parses a Sinhala cardinal number word string back into a number — the inverse of `toWords` for its plain or currency integer output (not ordinal or decimal).

```ts
toNumber('තිස් පහ'); // 35
toNumber('දෙසිය'); // 200
toNumber('එක් දහස් පන්සිය'); // 1500
toNumber('ඍණ පහ'); // -5
toNumber('රුපියල් දෙදහස් පන්සිය පනහ'); // 2550
toNumber('රුපියල් දෙදහස් පන්සිය පනහයි'); // 2550 (with assertive "යි", also accepted)
toNumber('රුපියල් එකසිය එක'); // 101
```

### Errors

| Input | Throws |
| --- | --- |
| Not a `string` | `TypeError` |
| Empty string | `SyntaxError` |
| Unrecognized or non-Sinhala words (including digits like `'350'`) | `SyntaxError` |
| Mixed Sinhala/Latin text | `SyntaxError` |

## License

MIT

## Author

**Inuka Wijerathna** — [inukawijerathna.me](https://inukawijerathna.me) · [GitHub](https://github.com/inukawijerathna) · [LinkedIn](https://www.linkedin.com/in/inukawijerathna/)
