import type { ReactNode } from 'react';
import InfoIcon from '../../../assets/icons/InfoOutlined.svg?react';
import TipsIcon from '../../../assets/icons/Tips.svg?react';
import DownloadIcon from '../../../assets/icons/Download.svg?react';
import { Tooltip } from '../../ui/Tooltip/Tooltip';
import { Button } from '../../ui/Button/Button';
import './ChartCard.css';

interface ChartCardProps {
  /** Data point name, exactly as on live. */
  title: string;
  /** Key under the title: legend items, "Sample average" etc. */
  chartKey?: ReactNode;
  /** One short hint, e.g. "Click a category in the legend above to isolate it". */
  hint?: string;
  /** Adds "Help with understanding this chart" (use for box plots and other unfamiliar charts). */
  help?: ReactNode;
  /** A warning shown above the chart, e.g. the Pathways Survey sub-national caveat. */
  notice?: ReactNode;
  children: ReactNode;
  /** Who was asked. Shown only when it differs from `defaultSample`. */
  denominator?: string;
  /** The segmentation's default sample population, e.g. "Women aged 15–49". */
  defaultSample?: string;
  /** One plain sentence starting with who and what. Shown under the chart so it survives download. */
  description?: string;
  onDownload?: () => void;
  className?: string;
}

/** The frame every chart sits in: title, key, chart, denominator and description. */
export function ChartCard({
  title, chartKey, hint, help, notice, children, denominator, defaultSample, description, onDownload, className = '',
}: ChartCardProps) {
  const norm = (t?: string) => (t ?? '').replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
  const showDenominator = !!denominator && norm(denominator) !== norm(defaultSample);

  return (
    <figure className={`chart-card ${className}`}>
      <div className="chart-card__body">
        <header className="chart-card__header">
          <h3 className="chart-card__title">{title}</h3>
          {onDownload && (
            <Button variant="plain" size="sm" className="chart-card__download" endIcon={<DownloadIcon />} onClick={onDownload}>Download</Button>
          )}
          {chartKey && <div className="chart-card__key">{chartKey}</div>}
          {help && (
            <Tooltip content={help} placement="bottom">
              <button type="button" className="chart-card__help"><TipsIcon aria-hidden="true" />Help with understanding this chart</button>
            </Tooltip>
          )}
          {hint && <p className="chart-card__hint"><InfoIcon aria-hidden="true" />{hint}</p>}
        </header>

        {notice && <div className="chart-card__notice">{notice}</div>}

        <div className="chart-card__chart">{children}</div>

        {showDenominator && (
          <p className="chart-card__denominator">
            <InfoIcon aria-hidden="true" />
            <strong>Denominator:</strong> {denominator}
          </p>
        )}
      </div>
      {description && <figcaption className="chart-card__description">{description}</figcaption>}
    </figure>
  );
}
