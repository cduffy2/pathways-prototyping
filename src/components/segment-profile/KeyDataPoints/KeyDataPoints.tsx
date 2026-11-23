import minilineIcon from '../../../assets/icons/Miniline.png';
import { DataPointBar } from '../../charts';
import './KeyDataPoints.css';

interface DataPoint {
  label: string;
  percentage: number;
  medianPercentage?: number;
}

interface SimpleValuePoint {
  label: string;
  value: number | string;
  medianValue?: number;
}

interface CategoricalDataPoint {
  label: string;
  segments: { label: string; percentage: number; color: string }[];
}

type VulnerabilityDataPoint = DataPoint | CategoricalDataPoint | SimpleValuePoint;

interface KeyDataPointsProps {
  healthOutcomes: DataPoint[];
  vulnerabilityFactors: VulnerabilityDataPoint[];
}

function isCategorical(item: VulnerabilityDataPoint): item is CategoricalDataPoint {
  return 'segments' in item;
}

function isSimpleValue(item: VulnerabilityDataPoint): item is SimpleValuePoint {
  return 'value' in item && !('percentage' in item);
}

interface DataBarProps extends DataPoint {
  variant?: 'health' | 'vulnerability';
}

function DataBar({ label, percentage, medianPercentage, variant = 'health' }: DataBarProps) {
  return (
    <DataPointBar
      label={label}
      value={percentage}
      average={medianPercentage}
      type={variant === 'vulnerability' ? 'factor' : 'outcome'}
    />
  );
}

function SimpleValue({ label, value, medianValue }: SimpleValuePoint) {
  return (
    <div className="key-data-points__simple-value">
      <span className="key-data-points__bar-label">{label}</span>
      <div className="key-data-points__bar-wrapper">
        <span className="key-data-points__simple-value-text">{value}</span>
        {medianValue !== undefined && (
          <div className="key-data-points__tooltip">
            <div className="key-data-points__tooltip-content">
              <div className="key-data-points__tooltip-indicator">
                <div className="key-data-points__tooltip-line" />
              </div>
              <span className="key-data-points__tooltip-text">
                Sample average: {medianValue}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoricalBar({ label, segments }: CategoricalDataPoint) {
  return (
    <div className="key-data-points__categorical-item">
      <span className="key-data-points__bar-label">{label}</span>
      <div className="key-data-points__categorical-bar-container">
        <div className="key-data-points__categorical-bar">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="key-data-points__categorical-segment"
              style={{
                width: `${segment.percentage}%`,
                backgroundColor: segment.color,
              }}
            />
          ))}
        </div>
      </div>
      <div className="key-data-points__categorical-legend">
        {segments.map((segment, index) => (
          <div key={index} className="key-data-points__categorical-legend-item">
            <span
              className="key-data-points__categorical-legend-color"
              style={{ backgroundColor: segment.color }}
            />
            <span className="key-data-points__categorical-legend-text">
              {segment.label} ({segment.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KeyDataPoints({ healthOutcomes, vulnerabilityFactors }: KeyDataPointsProps) {
  return (
    <div className="key-data-points">
      <div className="key-data-points__heading">
        <img src={minilineIcon} alt="" className="key-data-points__miniline" />
        <h2 className="key-data-points__title">Key data points for this segment</h2>
      </div>
      <div className="key-data-points__columns">
        <div className="key-data-points__column">
          <div className="key-data-points__column-header">
            <h3 className="key-data-points__column-title">Health outcomes / behaviours</h3>
            <div className="key-data-points__list">
              {healthOutcomes.map((item, index) => (
                <DataBar key={index} {...item} variant="health" />
              ))}
            </div>
          </div>
        </div>
        <div className="key-data-points__column">
          <div className="key-data-points__column-header">
            <h3 className="key-data-points__column-title">Vulnerability factors</h3>
            <div className="key-data-points__list">
              {vulnerabilityFactors.map((item, index) => {
                if (isCategorical(item)) {
                  return <CategoricalBar key={index} {...item} />;
                } else if (isSimpleValue(item)) {
                  return <SimpleValue key={index} {...item} />;
                } else {
                  return <DataBar key={index} {...item} variant="vulnerability" />;
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
