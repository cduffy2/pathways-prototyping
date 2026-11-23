import './SegmentedControl.css';

export interface SegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the group, e.g. "Population type". */
  label: string;
  size?: 'md' | 'sm';
  className?: string;
}

/** Switch between views of the same data, e.g. "All segments / Rural / Urban". */
export function SegmentedControl({ options, value, onChange, label, size = 'sm', className = '' }: SegmentedControlProps) {
  return (
    <div role="radiogroup" aria-label={label} className={`segmented segmented--${size} ${className}`}>
      {options.map(opt => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={opt.disabled}
            className={`segmented__option ${selected ? 'segmented__option--selected' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
