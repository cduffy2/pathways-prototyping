import type { ReactNode } from 'react';
import { Checkbox } from '../../common/Checkbox/Checkbox';
import './CheckboxItem.css';

interface CheckboxItemProps {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Optional muted text after the label, e.g. a count. */
  meta?: ReactNode;
  className?: string;
}

/** A full-width clickable row with a checkbox: use in lists and filter menus. */
export function CheckboxItem({ label, checked, onChange, disabled = false, meta, className = '' }: CheckboxItemProps) {
  return (
    <div
      className={`checkbox-item ${checked ? 'checkbox-item--checked' : ''} ${disabled ? 'checkbox-item--disabled' : ''} ${className}`}
      onClick={() => !disabled && onChange(!checked)}
    >
      <Checkbox checked={checked} onChange={onChange} disabled={disabled} />
      <span className="checkbox-item__label">{label}</span>
      {meta && <span className="checkbox-item__meta">{meta}</span>}
    </div>
  );
}
