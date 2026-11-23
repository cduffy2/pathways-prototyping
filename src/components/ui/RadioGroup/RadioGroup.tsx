import type { ReactNode } from 'react';
import './RadioGroup.css';

export interface RadioOption {
  value: string;
  label: ReactNode;
  /** Muted text after the label, e.g. "best for presentations". */
  hint?: ReactNode;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  /** Visible group label. */
  label?: string;
  className?: string;
}

/** One choice from a few options. Selected radios stay outlined, with a dark dot. */
export function RadioGroup({ name, options, value, onChange, label, className = '' }: RadioGroupProps) {
  return (
    <fieldset className={`radio-group ${className}`}>
      {label && <legend className="radio-group__legend">{label}</legend>}
      {options.map(opt => {
        const selected = opt.value === value;
        return (
          <label
            key={opt.value}
            className={`radio-group__option ${selected ? 'radio-group__option--selected' : ''} ${opt.disabled ? 'radio-group__option--disabled' : ''}`}
          >
            <input
              type="radio"
              className="radio-group__input"
              name={name}
              value={opt.value}
              checked={selected}
              disabled={opt.disabled}
              onChange={() => onChange(opt.value)}
            />
            <span className="radio-group__ring" aria-hidden="true">
              <span className="radio-group__dot" />
            </span>
            <span className="radio-group__label">{opt.label}</span>
            {opt.hint && <span className="radio-group__hint">· {opt.hint}</span>}
          </label>
        );
      })}
    </fieldset>
  );
}
