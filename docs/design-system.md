# Design system

Colour, type and spacing rules for the prototype.

- **Values:** [`src/styles/tokens.css`](../src/styles/tokens.css), generated from [`design-tokens.json`](../design-tokens.json). Read hex values there, not here.
- **Source of truth:** Figma [MUI for Pathways](https://www.figma.com/design/aHM114L0PSvgiAl29fkXSD/MUI-for-Pathways?node-id=415-13576) (Typography and Colours page) and Zeroheight [Brand Colors](https://pathways.zeroheight.com/styleguide/s/102143/p/971a7c) / [Typography](https://pathways.zeroheight.com/styleguide/s/102143/p/963586).

## Rules

1. Use `var(--token)` whenever a token exists. Don't add raw hex values.
2. Neutrals do most of the work. Colour carries meaning: vulnerability, data, links, status.
3. Vulnerability colours are only for vulnerability levels. Never use them decoratively.
4. Body text uses `--text-primary` or `--text-secondary` and must meet WCAG AA contrast.
5. Sentence case everywhere. Never `text-transform: uppercase`.
6. Don't use the "Legacy / mixed mode" tokens (`--color-gray-*`, `--color-badge-*`, `--color-beige*`).

## Colour

| Group | Tokens | Use for |
|---|---|---|
| Neutrals | `--neutral-050` … `-900` | Backgrounds, borders, text. The warm beige Pathways look. |
| Backgrounds | `--background-body` (white), `--background-page`, `--background-level1/2/3` | Page, card and raised surfaces. Hero bands use light beige `#F3F3E6`. |
| Text | `--text-primary`, `-secondary`, `-tertiary`, `--text-link`, `--text-link-hover` | Headings and body, secondary copy, captions, links |
| Interactive | `--neutral-plain-hoverbg`, `--neutral-plain-activebg`, `--neutral-outlined-border` | Hover and selected states on nav items, chips, rows, outlined buttons |
| Primary (blue) | `--primary-*` | Links, focus rings (`--focus-visible`), selected controls |
| Status | `--success-*`, `--warning-*`, `--danger-*` | Validation, banners and errors only |
| Vulnerability | `--vulnerability-{least,less,more,most}-*` | Segment badges, cards and chart fills. **Least = green, Less = blue, More = purple, Most = red.** |
| Data | `--data-categorical-1` … `-10`, `--segment-rural`, `--segment-urban` | Charts only. See [dataviz.md](dataviz.md). |

Literals still found in the code, and the token to use instead:

| Literal | Token |
|---|---|
| `#E5E5DC` | `--neutral-200` / `--neutral-outlined-border` |
| `#DCDACD` | `--neutral-300` / `--neutral-plain-activebg` |
| `#383633` | `--neutral-700` (dark buttons) |
| `#1F1E1C` | `--text-primary` |
| `#026ACC` | `--text-link` |

## Typography

- **Inter** for UI, headings and body (about 90% of text). Set `font-family: 'Inter', sans-serif` explicitly; `--font-family-base` is only a system stack.
- **Noto Serif** for long-form article body, card descriptions, quotes and highlighted numbers.

| Role | Desktop | Phone (<600px) | Weight |
|---|---|---|---|
| Page hero title | 36–48px | 28px | 700 |
| Section title | 30–36px | 24–28px | 700 |
| Card title | 24px | 20px | 600 |
| Body (Inter) | 16–18px | 16–17px | 400 |
| Body (Noto Serif) | 18px | 17px | 400 |
| Small, meta, captions | 14px | 14px | 400–600 |

Line height 1.33 for headings, 1.5 for body. Keep paragraphs under 5 lines.

## Spacing, radius, elevation

- Spacing: `--space-1` (4px) to `--space-12` (48px). Site sections: 80–112px vertical padding on desktop, 48px below 900px. Gutters: 40–64px desktop, 20–24px tablet and phone.
- Radius: buttons and inputs **6px** (ignore `--border-radius-sm`, which says 4px), pills 24px, avatars and flags 50%, cards match the nearest production component.
- Shadows: `--shadow-sm/md/lg`. Menus and dropdowns: `0 4px 16px rgba(21,21,21,.12)`.
- Motion: 150ms (`--transition-fast`) for hover, 300ms ease for panels and drawers.

## Icons and imagery

- Icons: SVGs in `src/assets/icons/`, imported as `Icon.svg?react` so they take `currentColor`. 16–24px.
- Illustrations: line art on warm beige, in `src/assets/`. Follow Zeroheight [Illustrations](https://pathways.zeroheight.com/styleguide/s/102143/p/28276a).
- Photos need a credit and consent. See [tone-of-voice.md](tone-of-voice.md#credits).
