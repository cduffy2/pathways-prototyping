import { useState } from 'react';
import { Bar, BarChart as RBarChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import InfoIcon from '../../../assets/icons/InfoOutlined.svg?react';
import { AXIS_TICK, CATEGORICAL, formatPercent, sortBySegment } from '../chartUtils';
import { BarChart } from '../BarChart/BarChart';
import { Button } from '../../ui/Button/Button';
import './StackedBarChart.css';

export interface StackCategory {
  key: string;
  label: string;
}

export interface StackedSegment {
  segment: string;
  /** Percentages per category key, adding up to 100. Null when there is no data (not applicable). */
  values: Record<string, number> | null;
}

interface StackedBarChartProps {
  /** In the order they should be coloured: categorical 1, 2, 3… */
  categories: StackCategory[];
  data: StackedSegment[];
  /** Sample average split, shown as an "Average" bar set apart by a dashed divider. */
  average?: Record<string, number>;
  height?: number;
}

const GAP = '__gap';
const AVERAGE = 'Average';

interface NAShapeProps { x?: number; y?: number; width?: number; height?: number }
function NAShape({ x = 0, y = 0, width = 0, height = 0 }: NAShapeProps) {
  if (height <= 0) return null;
  return <rect x={x + 0.5} y={y + 0.5} width={width - 1} height={height - 1} fill="var(--neutral-200)" stroke="var(--neutral-500)" strokeDasharray="4 3" />;
}

interface TooltipProps { active?: boolean; label?: string; payload?: { name?: string; value?: number; dataKey?: string; color?: string }[] }
function StackTooltip({ active, label, payload }: TooltipProps) {
  if (!active || !payload?.length || label === GAP) return null;
  const items = payload.filter(p => p.dataKey !== 'na' && (p.value ?? 0) > 0);
  return (
    <div className="stacked-bar__tooltip">
      <p className="stacked-bar__tooltip-title">{label}</p>
      {items.length === 0 ? <p>Not applicable</p> : items.map(p => (
        <p key={p.dataKey}><span className="stacked-bar__tooltip-swatch" style={{ background: p.color }} />{p.name}: {formatPercent(p.value ?? 0)}</p>
      ))}
    </div>
  );
}

/**
 * How each segment splits across the categories of one data point.
 * Clicking a legend category isolates it as a bar chart, so segments compare from the same baseline.
 */
export function StackedBarChart({ categories, data, average, height = 360 }: StackedBarChartProps) {
  const [isolated, setIsolated] = useState<string | null>(null);
  const colourOf = (key: string) => CATEGORICAL[categories.findIndex(c => c.key === key) % CATEGORICAL.length];
  const sorted = sortBySegment(data);
  const hasNA = sorted.some(d => d.values === null);

  const rows: Record<string, string | number>[] = sorted.map(d => {
    const row: Record<string, string | number> = { segment: d.segment, na: d.values === null ? 100 : 0 };
    categories.forEach(c => { row[c.key] = d.values?.[c.key] ?? 0; });
    return row;
  });
  if (average) {
    rows.push({ segment: GAP, na: 0 });
    const avg: Record<string, string | number> = { segment: AVERAGE, na: 0 };
    categories.forEach(c => { avg[c.key] = average[c.key] ?? 0; });
    rows.push(avg);
  }

  const isolatedCategory = categories.find(c => c.key === isolated);

  return (
    <div className="stacked-bar">
      <div className="stacked-bar__legend" role="group" aria-label="Categories">
        {categories.map(c => (
          <button
            key={c.key}
            type="button"
            className={`stacked-bar__legend-item ${isolated === c.key ? 'stacked-bar__legend-item--active' : ''} ${isolated && isolated !== c.key ? 'stacked-bar__legend-item--muted' : ''}`}
            aria-pressed={isolated === c.key}
            onClick={() => setIsolated(isolated === c.key ? null : c.key)}
          >
            <span className="stacked-bar__swatch" style={{ background: colourOf(c.key) }} />
            {c.label}
          </button>
        ))}
        {hasNA && <span className="stacked-bar__legend-item stacked-bar__legend-item--static"><span className="chart-swatch--na" />Not applicable</span>}
      </div>

      {isolatedCategory ? (
        <>
          <div className="stacked-bar__hint">
            <span>Showing <strong>{isolatedCategory.label}</strong> only</span>
            <Button variant="plain" size="sm" onClick={() => setIsolated(null)}>Show all categories</Button>
          </div>
          <BarChart
            height={height}
            colour={colourOf(isolatedCategory.key)}
            average={average?.[isolatedCategory.key]}
            data={sorted.map(d => ({ segment: d.segment, value: d.values ? d.values[isolatedCategory.key] ?? 0 : null }))}
          />
        </>
      ) : (
        <>
          <p className="stacked-bar__hint"><InfoIcon aria-hidden="true" />Click a category in the legend above to isolate it</p>
          <ResponsiveContainer width="100%" height={height}>
            <RBarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 8 }} barCategoryGap="18%">
              <XAxis dataKey="segment" tickLine={false} axisLine={false} interval={0} tick={AXIS_TICK} tickFormatter={(v: string) => (v === GAP ? '' : v)} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<StackTooltip />} cursor={{ fill: 'var(--neutral-100)' }} />
              {categories.map(c => (
                <Bar key={c.key} dataKey={c.key} name={c.label} stackId="s" fill={colourOf(c.key)} isAnimationActive={false} />
              ))}
              <Bar dataKey="na" stackId="s" isAnimationActive={false} shape={(p: unknown) => <NAShape {...(p as NAShapeProps)} />} />
              {average && <ReferenceLine x={GAP} stroke="var(--neutral-400)" strokeDasharray="4 4" />}
            </RBarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
