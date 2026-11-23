import type { ReactNode } from 'react';
import emptyImage from '../../../assets/Compare-Empty.png';
import './EmptyState.css';

interface EmptyStateProps {
  /** One plain line: what's empty. e.g. "No data selected", "No results found for "anc"". */
  title: string;
  /** Optional next step. */
  children?: ReactNode;
  /** Optional action, e.g. a "Clear search" button. */
  action?: ReactNode;
  /** Hide the illustration in tight spaces such as a side panel. */
  compact?: boolean;
  className?: string;
}

export function EmptyState({ title, children, action, compact = false, className = '' }: EmptyStateProps) {
  return (
    <div className={`empty-state ${compact ? 'empty-state--compact' : ''} ${className}`}>
      {!compact && <img className="empty-state__image" src={emptyImage} alt="" />}
      <p className="empty-state__title">{title}</p>
      {children && <div className="empty-state__body">{children}</div>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
