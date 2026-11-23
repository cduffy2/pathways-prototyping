import type { ReactNode } from 'react';
import './RadioCards.css';

export interface RadioCardOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Extra line under the label (list layout only). */
  description?: ReactNode;
  /** e.g. a "Recommended" chip (list layout only). */
  badge?: ReactNode;
  disabled?: boolean;
}

interface RadioCardsProps {
  name: string;
  options: RadioCardOption[];
  value: string;
  onChange: (value: string) => void;
  /**
   * row: a horizontal filter, e.g. health areas ("All data", "Child health"…).
   * list: stacked cards with a radio, e.g. choosing a data source.
   */
  layout?: 'row' | 'list';
  label?: string;
  className?: string;
}

export function RadioCards({ name, options, value, onChange, layout = 'row', label, className = '' }: RadioCardsProps) {
  return (
    <div role="radiogroup" aria-label={label} className={`radio-cards radio-cards--${layout} ${className}`}>
      {options.map(opt => {
        const selected = opt.value === value;
        return (
          <label
            key={opt.value}
            className={`radio-cards__card ${selected ? 'radio-cards__card--selected' : ''} ${opt.disabled ? 'radio-cards__card--disabled' : ''}`}
          >
            <input
              type="radio"
              className="radio-cards__input"
              name={name}
              value={opt.value}
              checked={selected}
              disabled={opt.disabled}
              onChange={() => onChange(opt.value)}
            />
            {opt.icon && <span className="radio-cards__icon">{opt.icon}</span>}
            <span className="radio-cards__text">
              <span className="radio-cards__label">{opt.label}</span>
              {layout === 'list' && opt.description && <span className="radio-cards__description">{opt.description}</span>}
              {layout === 'list' && opt.badge && <span className="radio-cards__badge">{opt.badge}</span>}
            </span>
            {layout === 'list' && (
              <span className="radio-cards__ring" aria-hidden="true"><span className="radio-cards__dot" /></span>
            )}
          </label>
        );
      })}
    </div>
  );
}
