import type { KeyboardEvent } from 'react';
import './Tabs.css';

export interface TabItem {
  value: string;
  label: string;
  /** Optional count shown after the label. */
  count?: number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

/** Switch between sibling panels of content, e.g. "Health outcomes" and "Vulnerability factors". */
export function Tabs({ tabs, value, onChange, label, className = '' }: TabsProps) {
  const enabled = tabs.filter(t => !t.disabled);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = enabled.findIndex(t => t.value === value);
    const next = enabled[(i + (e.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length];
    onChange(next.value);
  };

  return (
    <div role="tablist" aria-label={label} className={`tabs ${className}`} onKeyDown={onKeyDown}>
      {tabs.map(tab => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={tab.disabled}
            className={`tabs__tab ${selected ? 'tabs__tab--selected' : ''}`}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
            {tab.count !== undefined && <span className="tabs__count">{tab.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
