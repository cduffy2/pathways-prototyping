import { useEffect, useId, useRef, useState } from 'react';
import ChevronDown from '../../../assets/icons/ChevronDown.svg?react';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Start open (for showing states in a gallery). */
  defaultOpen?: boolean;
  className?: string;
}

/** Choose one item from a set list, e.g. a geography in a filter bar. */
export function Select({ options, value, onChange, label, placeholder = 'Select…', disabled = false, defaultOpen = false, className = '' }: SelectProps) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`select ${open ? 'select--open' : ''} ${disabled ? 'select--disabled' : ''} ${className}`}>
      {label && <span id={labelId} className="select__label">{label}</span>}
      <button
        type="button"
        className="select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? labelId : undefined}
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
      >
        <span className={selected ? '' : 'select__placeholder'}>{selected ? selected.label : placeholder}</span>
        <ChevronDown className="select__chevron" aria-hidden="true" />
      </button>
      {open && (
        <ul className="select__menu" role="listbox">
          {options.map(opt => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              tabIndex={0}
              className={`select__option ${opt.value === value ? 'select__option--selected' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(opt.value); setOpen(false); } }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
