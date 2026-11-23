import { useId } from 'react';
import { Bar, BarChart as RBarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  AXIS_TICK, TYPE_COLOUR, assignTextures, compareSegmentsForBreakdown, formatPercent, segmentFill, segmentLevel, segmentType,
} from '../chartUtils';
import { SegmentPatternDefs, SegmentSwatch } from '../ChartPatterns';
import '../StackedBarChart/StackedBarChart.css';
import './SegmentBreakdown.css';
import '../charts.css';

export interface AreaBreakdown {
  /** Geographic area, e.g. "Baringo". */
  name: string;
  /** Share of the area's population in each segment, in %, adding up to 100. */
  shares: Record<string, number>;
}

export type PopulationFilter = 'both' | 'urban' | 'rural';

function useChartId() {
  return 'c' + useId().replace(/[^a-zA-Z0-9]/g, '');
}

/** Segment codes present in the data, in breakdown order (urban then rural, most to least vulnerable). */
function orderedSegments(areas: AreaBreakdown[], filter: PopulationFilter): string[] {
  const codes = new Set<string>();
  areas.forEach(a => Object.keys(a.shares).forEach(c => codes.add(c)));
  return [...codes].filter(c => filter === 'both' || segmentType(c) === filter).sort(compareSegmentsForBreakdown);
}

/** Rescale shares to 100% for the selected population type. */
function filteredShares(area: AreaBreakdown, codes: string[]): Record<string, number> {
  const total = codes.reduce((sum, c) => sum + (area.shares[c] ?? 0), 0) || 1;
  return Object.fromEntries(codes.map(c => [c, ((area.shares[c] ?? 0) / total) * 100]));
}

function segmentName(code: string) {
  return `${segmentType(code) === 'urban' ? 'Urban' : 'Rural'}-${code.replace(/^[A-Za-z]/, '')}`;
}

/** Legend for breakdown charts: urban and rural groups, each segment with its colour and texture. */
export function SegmentLegend({ codes }: { codes: string[] }) {
  const id = useChartId();
  const textures = assignTextures(codes);
  const groups = (['urban', 'rural'] as const).map(type => ({ type, codes: codes.filter(c => segmentType(c) === type) })).filter(g => g.codes.length);
  return (
    <div className="segment-legend">
      {groups.map(g => (
        <div key={g.type} className="segment-legend__group">
          <span className="segment-legend__type"><span className="segment-legend__type-bar" style={{ background: TYPE_COLOUR[g.type] }} />{g.type === 'urban' ? 'Urban segments' : 'Rural segments'}</span>
          <span className="segment-legend__items">
            {g.codes.map(c => (
              <span key={c} className="chart-key-item"><SegmentSwatch prefix={`${id}${c.replace('.', '')}`} level={segmentLevel(c)} texture={textures[c]} />{segmentName(c)}</span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

interface BreakdownTooltipProps { active?: boolean; label?: string; payload?: { dataKey?: string; value?: number }[] }
function BreakdownTooltip({ active, label, payload }: BreakdownTooltipProps) {
  if (!active || !payload?.length) return null;
  const items = payload.filter(p => !['urbanTotal', 'ruralTotal'].includes(String(p.dataKey)) && (p.value ?? 0) > 0);
  return (
    <div className="stacked-bar__tooltip">
      <p className="stacked-bar__tooltip-title">{label}</p>
      {items.map(p => <p key={p.dataKey}>{p.dataKey}: {formatPercent(Math.round((p.value ?? 0) * 10) / 10)}</p>)}
    </div>
  );
}

interface SegmentBreakdownBarProps {
  areas: AreaBreakdown[];
  filter?: PopulationFilter;
  showLegend?: boolean;
}

/**
 * Which segments make up each area's population: one 100% bar per area, with a thin band above
 * showing the urban and rural share. Segment colours are their vulnerability level.
 */
export function SegmentBreakdownBar({ areas, filter = 'both', showLegend = true }: SegmentBreakdownBarProps) {
  const id = useChartId();
  const codes = orderedSegments(areas, filter);
  const textures = assignTextures(codes);
  const rows = areas.map(a => {
    const shares = filteredShares(a, codes);
    const urbanTotal = codes.filter(c => segmentType(c) === 'urban').reduce((s, c) => s + shares[c], 0);
    return { name: a.name, ...shares, urbanTotal, ruralTotal: 100 - urbanTotal };
  });

  return (
    <div className="segment-breakdown">
      <ResponsiveContainer width="100%" height={48 + rows.length * 64}>
        <RBarChart className="pathways-chart" data={rows} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }} barGap={2} barCategoryGap={12}>
          <defs><SegmentPatternDefs prefix={id} /></defs>
          <XAxis type="number" orientation="top" domain={[0, 100]} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} tick={AXIS_TICK} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--neutral-300)' }} width={96} />
          <Tooltip content={<BreakdownTooltip />} cursor={{ fill: 'var(--neutral-100)' }} />
          {filter === 'both' && <Bar className="segment-breakdown__type" dataKey="urbanTotal" stackId="type" barSize={6} fill={TYPE_COLOUR.urban} isAnimationActive={false} />}
          {filter === 'both' && <Bar className="segment-breakdown__type" dataKey="ruralTotal" stackId="type" barSize={6} fill={TYPE_COLOUR.rural} isAnimationActive={false} />}
          {codes.map(c => (
            <Bar key={c} dataKey={c} stackId="seg" barSize={36} fill={segmentFill(id, segmentLevel(c), textures[c])} isAnimationActive={false} />
          ))}
        </RBarChart>
      </ResponsiveContainer>
      {showLegend && <SegmentLegend codes={codes} />}
    </div>
  );
}

interface SegmentPieProps {
  area: AreaBreakdown;
  filter?: PopulationFilter;
  size?: number;
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: { name?: string; value?: number }[] }) {
  const p = payload?.[0];
  if (!active || !p) return null;
  return <div className="stacked-bar__tooltip"><p className="stacked-bar__tooltip-title">{p.name}: {formatPercent(Math.round((p.value ?? 0) * 10) / 10)}</p></div>;
}

interface LabelProps { cx?: number; cy?: number; midAngle?: number; outerRadius?: number; value?: number; name?: string }

/** The same breakdown for one area at a time, with an outer ring for the urban and rural share. */
export function SegmentPie({ area, filter = 'both', size = 220 }: SegmentPieProps) {
  const id = useChartId();
  const codes = orderedSegments([area], filter);
  const textures = assignTextures(codes);
  const shares = filteredShares(area, codes);
  const slices = codes.map(c => ({ name: c, value: shares[c] })).filter(s => s.value > 0);
  const urban = codes.filter(c => segmentType(c) === 'urban').reduce((s, c) => s + shares[c], 0);
  const ring = [{ name: 'urban', value: urban }, { name: 'rural', value: 100 - urban }].filter(r => r.value > 0);
  const r = size / 2 - 34;
  const RAD = Math.PI / 180;

  const label = ({ cx = 0, cy = 0, midAngle = 0, outerRadius = 0, value = 0, name = '' }: LabelProps) => {
    if (value < 3) return null; // tiny slices: hover for the value
    const big = value >= 8;
    const dist = big ? outerRadius * 0.62 : outerRadius + 22;
    const x = cx + dist * Math.cos(-midAngle * RAD);
    const y = cy + dist * Math.sin(-midAngle * RAD);
    const lx1 = cx + (outerRadius + 6) * Math.cos(-midAngle * RAD), ly1 = cy + (outerRadius + 6) * Math.sin(-midAngle * RAD);
    const lx2 = cx + (outerRadius + 14) * Math.cos(-midAngle * RAD), ly2 = cy + (outerRadius + 14) * Math.sin(-midAngle * RAD);
    return (
      <g>
        {!big && <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="var(--text-tertiary)" strokeWidth={1} />}
        <text x={x} y={y - 2} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--text-primary)" fontFamily="Inter, sans-serif">{name}</text>
        <text x={x} y={y + 11} textAnchor="middle" fontSize={11} fill="var(--text-secondary)" fontFamily="Inter, sans-serif">{formatPercent(Math.round(value))}</text>
      </g>
    );
  };

  return (
    <figure className="segment-pie">
      <figcaption className="segment-pie__name">{area.name}</figcaption>
      <PieChart className="pathways-chart" width={size} height={size}>
        <defs><SegmentPatternDefs prefix={id} /></defs>
        <Tooltip content={<PieTooltip />} />
        <Pie className="segment-pie__slices" data={slices} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={r} startAngle={90} endAngle={-270} label={label} labelLine={false} isAnimationActive={false} stroke="var(--common-white)" strokeWidth={1}>
          {slices.map(s => <Cell key={s.name} fill={segmentFill(id, segmentLevel(s.name), textures[s.name])} />)}
        </Pie>
        {filter === 'both' && (
          <Pie data={ring} dataKey="value" cx="50%" cy="50%" innerRadius={r + 2} outerRadius={r + 6} startAngle={90} endAngle={-270} isAnimationActive={false} stroke="none">
            {ring.map(s => <Cell key={s.name} fill={TYPE_COLOUR[s.name as 'urban' | 'rural']} />)}
          </Pie>
        )}
      </PieChart>
    </figure>
  );
}
