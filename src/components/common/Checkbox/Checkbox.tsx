import './Checkbox.css';

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Accessible name when there is no visible label next to it. */
  ariaLabel?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, disabled = false, ariaLabel, className = '' }: CheckboxProps) {
  const toggle = () => {
    if (!disabled) onChange?.(!checked);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    }
  };

  return (
    <div
      className={`checkbox ${checked ? 'checkbox--checked' : ''} ${disabled ? 'checkbox--disabled' : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
    >
      {checked && (
        <svg
          className="checkbox__icon"
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 5L5 9L13 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
