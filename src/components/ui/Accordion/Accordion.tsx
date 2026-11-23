import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import ChevronDown from '../../../assets/icons/ChevronDown.svg?react';
import './Accordion.css';

interface AccordionProps {
  title: ReactNode;
  /** Optional count after the title, e.g. how many items are inside or selected. */
  count?: number;
  children: ReactNode;
  /** Uncontrolled starting state. */
  defaultOpen?: boolean;
  /** Controlled state: pass both `open` and `onToggle`. */
  open?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
}

/** Plain, collapsible group. Use to group long lists by category. */
export function Accordion({ title, count, children, defaultOpen = false, open, onToggle, className = '' }: AccordionProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const isOpen = open ?? innerOpen;
  const panelId = useId();

  const toggle = () => {
    onToggle?.(!isOpen);
    if (open === undefined) setInnerOpen(!isOpen);
  };

  return (
    <div className={`accordion ${isOpen ? 'accordion--open' : ''} ${className}`}>
      <button type="button" className="accordion__header" aria-expanded={isOpen} aria-controls={panelId} onClick={toggle}>
        <span className="accordion__title">{title}</span>
        {count !== undefined && <span className="accordion__count">{count}</span>}
        <ChevronDown className="accordion__chevron" aria-hidden="true" />
      </button>
      {isOpen && <div id={panelId} className="accordion__panel">{children}</div>}
    </div>
  );
}
