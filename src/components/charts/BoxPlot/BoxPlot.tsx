import { Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AXIS_TICK, sortBySegment } from '../chartUtils';
import '../StackedBarChart/StackedBarChart.css';
import '../charts.css';

export interface BoxStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  mean: number;
}

export interface SegmentBox {
  segment: string;
  /** Null when there is no data. */
  stats: BoxStats | null;
}

interface BoxPlotProps {
  data: SegmentBox[];
  /** Whole-sample distribution, drawn last as the "Sample" comparison box. */
  sample: BoxStats;
  /** Y-axis unit or title, e.g. "Years". */
  yLabel?: string;
  height?: number;
}

interface Row {
  segment: string;
  range: [number, number];
  stats: BoxStats | null;
  isSample: boolean;
}

interface ShapeProps { x?: number; y?: number; width?: number; height?: number; payload?: Row }

function BoxShape({ x = 0, y = 0, width = 0, height = 0, payload }: ShapeProps) {
  if (!payload) return null;
  if (!payload.stats) {
    return <g className="chart-mark--box"><rect x={x + width * 0.15} y={y} width={width * 0.7} height={height} fill="var(--neutral-200)" stroke="var(--neutral-500)" strokeDasharray="4 3" /></g>;
  }
  const { min, q1, median, q3, max, mean } = payload.stats;
  const span = max - min || 1;
  const py = (v: number) => y + ((max - v) / span) * height;
  const cx = x + width / 2;
  const bw = width * 0.7;
  const bx = cx - bw / 2;
  const stroke = payload.isSample ? 'var(--vulnerability-more-dark)' : 'var(--neutral-600)';
  const fill = payload.isSample ? 'var(--vulnerability-more-050)' : 'var(--primary-050)';
  const cap = bw * 0.3;
  return (
    <g className="chart-mark--box" stroke={stroke} strokeWidth={1}>
      <line x1={cx} x2={cx} y1={py(max)} y2={py(q3)} />
      <line x1={cx} x2={cx} y1={py(q1)} y2={py(min)} />
      <line x1={cx - cap} x2={cx + cap} y1={py(max)} y2={py(max)} />
      <line x1={cx - cap} x2={cx + cap} y1={py(min)} y2={py(min)} />
      <rect x={bx} y={py(q3)} width={bw} height={Math.max(py(q1) - py(q3), 1)} fill={fill} />
      <line x1={bx} x2={bx + bw} y1={py(median)} y2={py(median)} />
      <circle cx={cx} cy={py(mean)} r={2.5} fill={stroke} stroke="none" />
    </g>
  );
}

function BoxTooltip({ active, payload }: { active?: boolean; payload?: { payload?: Row }[] }) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return (
    <div className="stacked-bar__tooltip">
      <p className="stacked-bar__tooltip-title">{row.segment}</p>
      {row.stats ? (
        <>
          <p>Median: {row.stats.median}</p>
          <p>Middle 50%: {row.stats.q1} to {row.stats.q3}</p>
          <p>Range: {row.stats.min} to {row.stats.max}</p>
          <p>Mean: {row.stats.mean}</p>
        </>
      ) : <p>Not applicable</p>}
    </div>
  );
}

/** How spread out values are within each segment, compared with the whole sample. */
export function BoxPlot({ data, sample, yLabel, height = 380 }: BoxPlotProps) {
  const all = data.flatMap(d => (d.stats ? [d.stats.min, d.stats.max] : [])).concat(sample.min, sample.max);
  const step = Math.max(...all) - Math.min(...all) > 20 ? 10 : 2;
  const lo = Math.floor(Math.min(...all) / step) * step;
  const hi = Math.ceil((Math.max(...all) * 1.02) / step) * step;
  const ticks = Array.from({ length: Math.round((hi - lo) / step) + 1 }, (_, i) => lo + i * step);
  const rows: Row[] = [
    ...sortBySegment(data).map(d => ({ segment: d.segment, stats: d.stats, isSample: false, range: (d.stats ? [d.stats.min, d.stats.max] : [lo + (hi - lo) * 0.1, hi * 0.95]) as [number, number] })),
    { segment: 'Sample', stats: sample, isSample: true, range: [sample.min, sample.max] },
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart className="pathways-chart" data={rows} margin={{ top: 8, right: 8, bottom: yLabel ? 16 : 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--neutral-200)" />
        <XAxis dataKey="segment" tickLine={false} axisLine={{ stroke: 'var(--neutral-300)' }} tick={AXIS_TICK} interval={0} />
        <YAxis domain={[lo, hi]} ticks={ticks} tickLine={false} axisLine={false} tick={AXIS_TICK} width={40}
          label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', style: AXIS_TICK } : undefined} />
        <Tooltip content={<BoxTooltip />} cursor={{ fill: 'var(--neutral-100)' }} />
        <Bar dataKey="range" isAnimationActive={false} shape={(p: unknown) => <BoxShape {...(p as ShapeProps)} />} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
