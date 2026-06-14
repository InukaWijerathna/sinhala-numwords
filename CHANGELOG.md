# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-14

### Added

- Support for decimal numbers in `toWords`, read digit-by-digit after "දශම" (e.g. `13.14` -> `දහතුනයි දශම එකයි හතර`).
- `currency: true` now accepts decimal amounts, read as rupees and cents (`ශත`), e.g. `2550.75` -> `රුපියල් දෙදහස් පන්සිය පනහයි ශත හැත්තෑ පහයි`.
- `currency: true` output is now suffixed with "යි" (e.g. `2550` -> `රුපියල් දෙදහස් පන්සිය පනහයි`), and `toNumber` parses this suffix.

### Changed

- **Breaking:** ordinal suffix changed from "-වැනි" to "-වෙනි" (e.g. `තුන්වැනි` -> `තුන්වෙනි`).
- **Breaking:** ordinal for `1` changed from `පළමුවැනි` to `පළවෙනි`.
- **Breaking:** ordinal for `4` changed from `සිව්වෙනි` to `හතරවෙනි`.
- **Breaking:** `100` now renders as `සියය` (was `එක්සිය`), and its ordinal as `සියවෙනි`.
- **Breaking:** the hundreds-prefix word for `1` changed from `එක්සිය` to `එකසිය` (e.g. `1100` -> `එක් දහස් එකසිය`).
- `toWords` now requires integers only for `ordinal: true`; plain and currency calls accept decimals.

## [0.0.1] - 2026-06-12

### Added

- `toWords(num, options?)` — converts integers to Sinhala words, with `currency` and `ordinal` options.
- `toNumber(text)` — parses Sinhala number words back into integers.
- Default export (`import sinhalaNumwords from 'sinhala-numwords'`) alongside named exports.
- Runtime input validation: `TypeError` for invalid types/`NaN`, `RangeError` for non-integers, `Infinity`, and out-of-range values (`±9,999,999,999`); `SyntaxError` for unparsable strings in `toNumber`.
- ESM + CJS builds with type declarations via tsup.

[1.0.0]: https://github.com/inukawijerathna/sinhala-numwords/releases/tag/v1.0.0
[0.0.1]: https://github.com/inukawijerathna/sinhala-numwords/releases/tag/v0.0.1
