# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-06-12

### Added

- `toWords(num, options?)` — converts integers to Sinhala words, with `currency` and `ordinal` options.
- `toNumber(text)` — parses Sinhala number words back into integers.
- Default export (`import sinhalaNumwords from 'sinhala-numwords'`) alongside named exports.
- Runtime input validation: `TypeError` for invalid types/`NaN`, `RangeError` for non-integers, `Infinity`, and out-of-range values (`±9,999,999,999`); `SyntaxError` for unparsable strings in `toNumber`.
- ESM + CJS builds with type declarations via tsup.

[0.0.1]: https://github.com/inukawijerathna/sinhala-numwords/releases/tag/v0.0.1
