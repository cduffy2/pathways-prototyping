import { chartDataSets } from '../../../data/chartData';
import { DEFAULT_SAMPLE } from '../../../data/segments';
import type { StackedChartDataSet, ChartDataSet } from '../../../types/chartData';
import { AverageKey, BarChart, ChartCard, StackedBarChart } from '../../charts';
import './ChartViewerPanel.css';

// Illustrative standard error for a segment's value. The prototype data has no real standard errors.
function illustrativeStandardError(segment: string, value: number): number {
  let hash = 0;
  for (let i = 0; i < segment.length; i++) {
    hash = ((hash << 5) - hash) + segment.charCodeAt(i);
    hash |= 0;
  }
  const errors = [0.3, 0.5, 0.8, 1.1, 0.4, 0.7, 1.2, 0.6, 0.9, 1.5];
  const pctFactor = 1 + Math.sin((value / 100) * Math.PI) * 0.3;
  return +(errors[Math.abs(hash % 10)] * pctFactor).toFixed(1);
}

interface ChartViewerPanelProps {
  dataItemId: string;
  showStandardError?: boolean;
}

function isStackedChart(chart: ChartDataSet | StackedChartDataSet): chart is StackedChartDataSet {
  return chart.chartType === 'stacked';
}

export function ChartViewerPanel({ dataItemId, showStandardError = false }: ChartViewerPanelProps) {
  // Handle suffixed IDs (e.g., hh-clean-cooking-fuel-ch -> hh-clean-cooking-fuel)
  // These suffixes are used to make health area-specific vulnerability factors unique
  const baseId = dataItemId.replace(/-(?:ch|im|mh|nu|sr)$/, '');
  const chartData = chartDataSets[dataItemId] || chartDataSets[baseId];

  if (!chartData) {
    return (
      <div className="chart-viewer-panel">
        <div className="chart-viewer-panel__empty">Select a data item to view the chart</div>
      </div>
    );
  }

  return (
    <div className="chart-viewer-panel">
      <div className="chart-viewer-panel__content">
        {isStackedChart(chartData) ? (
          <ChartCard
            className="chart-viewer-panel__card"
            title={chartData.title}
            denominator={chartData.denominator}
            defaultSample={DEFAULT_SAMPLE}
            description={chartData.description}
          >
            <StackedBarChart
              categories={chartData.categories.map(c => ({ key: c.key, label: c.label }))}
              data={chartData.data.map(row => ({
                segment: String(row.segment),
                values: Object.fromEntries(chartData.categories.map(c => [c.key, Number(row[c.key] ?? 0)])),
              }))}
            />
          </ChartCard>
        ) : (
          <ChartCard
            className="chart-viewer-panel__card"
            title={chartData.title}
            chartKey={chartData.medianLine !== undefined ? <AverageKey /> : undefined}
            denominator={chartData.denominator}
            defaultSample={DEFAULT_SAMPLE}
            description={chartData.description}
          >
            <BarChart
              data={chartData.data.map(d => ({ segment: d.segment, value: d.value, standardError: d.value === null ? undefined : illustrativeStandardError(d.segment, d.value) }))}
              average={chartData.medianLine}
              showStandardError={showStandardError}
            />
          </ChartCard>
        )}
      </div>
    </div>
  );
}
