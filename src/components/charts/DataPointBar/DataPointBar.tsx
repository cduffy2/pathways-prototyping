import { SERIES_COLOUR, formatPercent } from '../chartUtils';
import './DataPointBar.css';
import '../charts.css';

interface DataPointBarProps {
  /** Data point name, exactly as on live. */
  label: string;
  /** Percentage for this segment, or null when there is no data. */
  value: number | null;
  /** Sample average, drawn as a dashed marker. */
  average?: number;
  standardError?: number;
  showStandardError?: boolean;
  /** outcome: health outcomes and behaviours. factor: vulnerability factors. */
  type?: 'outcome' | 'factor';
  /** Hide the visible label when the surrounding card already shows it (it is still read out). */
  hideLabel?: boolean;
}

/** One segment's value for one data point, against the sample average. Used on segment profiles. */
export function DataPointBar({ label, value, average, standardError, showStandardError = false, type = 'outcome', hideLabel = false }: DataPointBarProps) {
  const na = value === null;
  return (
    <div className="data-point-bar">
      <div className="data-point-bar__row">
        <span className={`data-point-bar__label ${hideLabel ? 'data-point-bar__label--hidden' : ''}`}>{label}</span>
        <span className="data-point-bar__value">
          {na ? 'N/A' : formatPercent(value)}
          {!na && showStandardError && standardError !== undefined && <span className="data-point-bar__se"> ±{formatPercent(standardError)}</span>}
        </span>
      </div>
      <div
        className={`data-point-bar__track ${na ? 'data-point-bar__track--na' : ''}`}
        role="img"
        aria-label={na ? `${label}: no data` : `${label}: ${formatPercent(value)}${average !== undefined ? `, sample average ${formatPercent(average)}` : ''}`}
      >
        {!na && <div className="data-point-bar__fill" style={{ width: `${Math.min(value, 100)}%`, background: SERIES_COLOUR[type] }} />}
        {average !== undefined && <div className="data-point-bar__average" style={{ left: `${Math.min(average, 100)}%` }} title={`Sample average ${formatPercent(average)}`} />}
      </div>
    </div>
  );
}
