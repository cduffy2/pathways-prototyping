// Shared rules for every Pathways chart. See docs/dataviz.md.

export type VulnerabilityLevel = 'least' | 'less' | 'more' | 'most';
export type SegmentType = 'rural' | 'urban';
export type Texture = 'none' | 'diagonal' | 'grid' | 'horizontal' | 'vertical';

/** "R3.1" → rural, "U2" → urban. */
export function segmentType(code: string): SegmentType {
  return code.trim().toUpperCase().startsWith('U') ? 'urban' : 'rural';
}

/** The number before the dot is the level: 1 least, 2 less, 3 more, 4 most vulnerable. */
export function segmentLevel(code: string): VulnerabilityLevel {
  const n = parseInt(code.replace(/[^0-9.]/g, ''), 10);
  return (['least', 'less', 'more', 'most'] as const)[Math.min(Math.max(n, 1), 4) - 1];
}

function codeNumber(code: string): number {
  return parseFloat(code.replace(/[^0-9.]/g, '')) || 0;
}

/**
 * Order for comparison charts (bar, stacked bar, box plot): rural then urban, each by code.
 * e.g. R1, R3.1, R3.2, R4, U1, U2.1, U2.2, U4. Same on every chart.
 */
export function compareSegments(a: string, b: string): number {
  const ta = segmentType(a), tb = segmentType(b);
  if (ta !== tb) return ta === 'rural' ? -1 : 1;
  return codeNumber(a) - codeNumber(b);
}

/**
 * Order for population breakdowns (segment bar, pie), as on production:
 * urban then rural, each from most to least vulnerable.
 * e.g. U4, U2.1, U2.2, U1, R4, R3.1, R3.2, R1.
 */
export function compareSegmentsForBreakdown(a: string, b: string): number {
  const ta = segmentType(a), tb = segmentType(b);
  if (ta !== tb) return ta === 'urban' ? -1 : 1;
  const la = Math.floor(codeNumber(a)), lb = Math.floor(codeNumber(b));
  if (la !== lb) return lb - la;
  return codeNumber(a) - codeNumber(b);
}

export function sortBySegment<T extends { segment: string }>(items: T[], compare = compareSegments): T[] {
  return [...items].sort((x, y) => compare(x.segment, y.segment));
}

/** Fill for a segment in breakdown charts: its vulnerability level, never a categorical colour. */
export function levelFill(level: VulnerabilityLevel): string {
  return `var(--vulnerability-${level}-light)`;
}

export function levelLine(level: VulnerabilityLevel): string {
  return `var(--vulnerability-${level}-dark)`;
}

/** Categorical colours for stacked-bar categories: always in this order, never picked by taste. */
export const CATEGORICAL = Array.from({ length: 10 }, (_, i) => `var(--data-categorical-${i + 1})`);

/** Bar colour by data point type. */
export const SERIES_COLOUR = {
  outcome: 'var(--data-categorical-1)',
  factor: 'var(--data-categorical-6)',
} as const;

/** Urban and rural bands (categorical 10 and 7, as on production). */
export const TYPE_COLOUR: Record<SegmentType, string> = {
  rural: 'var(--data-categorical-7)',
  urban: 'var(--data-categorical-10)',
};

const TEXTURE_ORDER: Texture[] = ['none', 'diagonal', 'grid', 'horizontal', 'vertical'];

/**
 * Textures for segments in display order. When a segment has the same level (and so the same colour)
 * as its neighbour, it gets the next texture in the order diagonal, grid, horizontal, vertical,
 * counting across the whole chart, as on production. Textures are only used for this.
 */
export function assignTextures(orderedCodes: string[]): Record<string, Texture> {
  const out: Record<string, Texture> = {};
  let used = 0;
  orderedCodes.forEach((code, i) => {
    const prev = orderedCodes[i - 1];
    const repeats = !!prev && segmentLevel(prev) === segmentLevel(code) && segmentType(prev) === segmentType(code);
    out[code] = repeats ? TEXTURE_ORDER[1 + (used++ % (TEXTURE_ORDER.length - 1))] : 'none';
  });
  return out;
}

export function formatPercent(value: number): string {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

/** Shared text styles for SVG chart text (all chart text except the title is tertiary). */
export const AXIS_TICK = { fill: 'var(--text-tertiary)', fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif' };
export const VALUE_LABEL = { fill: 'var(--text-primary)', fontSize: 14, fontFamily: 'Inter, sans-serif' };

/** id of the SVG pattern for a level and texture, unique per chart instance. */
export function patternId(prefix: string, level: VulnerabilityLevel, texture: Texture): string {
  return `${prefix}-${level}-${texture}`;
}

/** Fill value for a segment: plain level colour, or its texture pattern. */
export function segmentFill(prefix: string, level: VulnerabilityLevel, texture: Texture): string {
  return texture === 'none' ? levelFill(level) : `url(#${patternId(prefix, level, texture)})`;
}

