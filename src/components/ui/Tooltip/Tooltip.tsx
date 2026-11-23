import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import InfoIcon from '../../../assets/icons/InfoOutlined.svg?react';
import './Tooltip.css';

interface TooltipProps {
  content: ReactNode;
  /** The trigger. Defaults to an info icon, the usual way to explain a term or number. */
  children?: ReactNode;
  /** Accessible name for the default info icon. */
  label?: string;
  placement?: 'top' | 'bottom';
  /** Start visible (for showing states in a gallery). */
  defaultOpen?: boolean;
}

export function Tooltip({ content, children, label = 'More information', placement = 'top', defaultOpen = false }: TooltipProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <span
      className="tooltip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(defaultOpen)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(defaultOpen)}
    >
      {children ?? (
        <button type="button" className="tooltip__trigger" aria-label={label} aria-describedby={open ? id : undefined}>
          <InfoIcon />
        </button>
      )}
      {open && (
        <span id={id} role="tooltip" className={`tooltip__bubble tooltip__bubble--${placement}`}>
          {content}
        </span>
      )}
    </span>
  );
}
