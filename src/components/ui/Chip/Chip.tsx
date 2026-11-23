import type { ReactNode } from 'react';
import CloseIcon from '../../../assets/icons/CloseFilled.svg?react';
import './Chip.css';

export type VulnerabilityLevel = 'least' | 'less' | 'more' | 'most';

interface ChipProps {
  children: ReactNode;
  /**
   * soft: tags, statuses and applied filters. outlined: lighter tags on busy backgrounds.
   * success: positive status such as "Recommended". level: a vulnerability level (set `level`).
   */
  variant?: 'soft' | 'outlined' | 'success' | 'level';
  level?: VulnerabilityLevel;
  icon?: ReactNode;
  /** Adds a remove button, e.g. for an applied filter. */
  onRemove?: () => void;
  className?: string;
}

export function Chip({ children, variant = 'soft', level, icon, onRemove, className = '' }: ChipProps) {
  const levelClass = variant === 'level' && level ? `chip--level-${level}` : '';
  return (
    <span className={`chip chip--${variant} ${levelClass} ${className}`}>
      {icon && <span className="chip__icon">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button type="button" className="chip__remove" onClick={onRemove} aria-label={`Remove ${typeof children === 'string' ? children : 'filter'}`}>
          <CloseIcon />
        </button>
      )}
    </span>
  );
}
