import { Bar, BarChart as RBarChart, LabelList, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { AXIS_TICK, SERIES_COLOUR, VALUE_LABEL, formatPercent, sortBySegment } from '../chartUtils';

export interface SegmentValue {
  /** Segment code, e.g. "R3.1". */
  segment: string;
  /** Percentage, or null when there is no data. Null is never drawn as zero. */
  value: number | null;
  /** Standard error in percentage points. Shown only when `showStandardError` is on. */
  standardError?: number;
}

interface BarChartProps {
  data: SegmentValue[];
  /** Sample average, drawn as a dashed line with its value in a dark chip. */
  average?: number;
  showStandardError?: boolean;
  /** outcome: health outcomes and behaviours. factor: vulnerability factors. Or any CSS colour. */
  colour?: 'outcome' | 'factor' | string;
  height?: number;
}

interface Row {
  segment: string;
  plot: number;
  value: number | null;
  standardError?: number;
}

interface BarShapeProps { x?: number; y?: number; width?: number; height?: number; payload?: Row; fill?: string }

function BarShape({ x = 0, y = 0, width = 0, height = 0, payload, fill }: BarShapeProps) {
  if (payload?.value === null) {
    return <rect x={x + 0.5} y={y + 0.5} width={width - 1} height={Math.max(height - 1, 0)} fill="var(--neutral-200)" stroke="var(--neutral-500)" strokeDasharray="4 3" />;
  }
  return <rect x={x} y={y} width={width} height={height} fill={fill} />;
}

/** One data point across segments. Segments are always in the standard order. */
export function BarChart({ data, average, showStandardError = false, colour = 'outcome', height = 360 }: BarChartProps) {
  const fill = colour === 'outcome' || colour === 'factor' ? SERIES_COLOUR[colour] : colour;
  const sorted = sortBySegment(data);
  const values = sorted.map(d => d.value ?? 0).concat(average ?? 0);
  const max = Math.max(...values, 1) * 1.2;
  const rows: Row[] = sorted.map(d => ({ segment: d.segment, value: d.value, standardError: d.standardError, plot: d.value === null ? max * 0.92 : d.value }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={rows} margin={{ top: showStandardError ? 40 : 28, right: 8, bottom: 0, left: average !== undefined ? 48 : 8 }} barCategoryGap="18%">
        <XAxis dataKey="segment" tickLine={false} axisLine={{ stroke: 'var(--neutral-300)' }} tick={AXIS_TICK} interval={0} />
        <YAxis hide domain={[0, max]} />
        <Bar dataKey="plot" fill={fill} isAnimationActive={false} shape={(p: unknown) => <BarShape {...(p as BarShapeProps)} />}>
          <LabelList
            dataKey="plot"
            content={(p: { x?: number | string; y?: number | string; width?: number | string; index?: number }) => {
              const row = rows[p.index ?? 0];
              const cx = Number(p.x) + Number(p.width) / 2;
              const top = Number(p.y);
              if (!row) return null;
              if (row.value === null) {
                return <text x={cx} y={top + 20} textAnchor="middle" {...VALUE_LABEL} fill="var(--text-tertiary)">N/A</text>;
              }
              const se = showStandardError && row.standardError !== undefined ? `±${formatPercent(row.standardError)}` : null;
              return (
                <g>
                  <rect x={cx - 26} y={top - (se ? 36 : 22)} width={52} height={se ? 34 : 20} rx={2} fill="var(--common-white)" />
                  <text x={cx} y={top - (se ? 20 : 6)} textAnchor="middle" {...VALUE_LABEL}>{formatPercent(row.value)}</text>
                  {se && <text x={cx} y={top - 6} textAnchor="middle" {...AXIS_TICK}>{se}</text>}
                </g>
              );
            }}
          />
        </Bar>
        {average !== undefined && (
          <ReferenceLine
            y={average}
            stroke="var(--text-secondary)"
            strokeDasharray="4 3"
            label={(p: { viewBox?: { x?: number; y?: number } }) => {
              const vx = p.viewBox?.x ?? 0, vy = p.viewBox?.y ?? 0;
              const text = formatPercent(average);
              const w = text.length * 7 + 12;
              return (
                <g>
                  <rect x={vx - w - 4} y={vy - 10} width={w} height={20} rx={3} fill="var(--neutral-700)" />
                  <text x={vx - w / 2 - 4} y={vy + 4} textAnchor="middle" fill="var(--common-white)" fontSize={12} fontWeight={600} fontFamily="Inter, sans-serif">{text}</text>
                </g>
              );
            }}
          />
        )}
      </RBarChart>
    </ResponsiveContainer>
  );
}

/** Key for bar charts: "- - - Sample average". */
export function AverageKey({ label = 'Sample average' }: { label?: string }) {
  return <span className="chart-key-item"><span className="chart-key-line" />{label}</span>;
}
