import type { ReactNode } from 'react';
import InfoIcon from '../../../assets/icons/InfoOutlined.svg?react';
import WarningIcon from '../../../assets/icons/WarningFilled.svg?react';
import CloseIcon from '../../../assets/icons/CloseFilled.svg?react';
import './Notice.css';

interface NoticeProps {
  /** info: neutral context. warning: a limitation the user should know before reading the data. */
  tone?: 'info' | 'warning';
  title?: string;
  children: ReactNode;
  /** A link or button after the message, e.g. "View source data details". */
  action?: ReactNode;
  /** Adds a ✕ so the user can dismiss it once read. */
  onDismiss?: () => void;
  className?: string;
}

/** State the limitation, then what it means for the user. One or two sentences. */
export function Notice({ tone = 'info', title, children, action, onDismiss, className = '' }: NoticeProps) {
  return (
    <div className={`notice notice--${tone} ${className}`} role={tone === 'warning' ? 'alert' : 'status'}>
      <span className="notice__icon" aria-hidden="true">{tone === 'warning' ? <WarningIcon /> : <InfoIcon />}</span>
      <div className="notice__content">
        {title && <p className="notice__title">{title}</p>}
        <div className="notice__body">{children}</div>
        {action && <div className="notice__action">{action}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="notice__dismiss" onClick={onDismiss} aria-label="Dismiss">
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
