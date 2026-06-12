# sinhala-numwords

Convert numbers to Sinhala words, and back — useful for payroll slips, invoices, cheques, and legal documents.

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
toWords(2550, { currency: true }); // 'රුපියල් දෙදහස් පන්සිය පනහ'
toWords(3, { ordinal: true }); // 'තුන්වැනි'

toNumber('තිස් පහ'); // 35
toNumber('රුපියල් දෙදහස් පන්සිය පනහ'); // 2550
```

## API

### `toWords(num, options?)`

Converts an integer to its Sinhala word form.

- `num` — an integer between `-9,999,999,999` and `9,999,999,999`.
- `options.currency` — prefix the result with "රුපියල්" (rupees).
- `options.ordinal` — render as an ordinal (1st, 2nd, 3rd, ...). Requires `num >= 1`.

### `toNumber(text)`

Parses a Sinhala cardinal number word string back into a number. The inverse of `toWords` for its non-ordinal output.

## License

MIT
