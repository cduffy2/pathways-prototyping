import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import CloseIcon from '../../../assets/icons/CloseFilled.svg?react';
import { IconButton } from '../IconButton/IconButton';
import './Modal.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Buttons, right-aligned. Put the main action last. */
  footer?: ReactNode;
  width?: number;
}

/** A focused task over the page. Closes with ✕, Escape or a click on the backdrop. Becomes a full-screen sheet below 600px. */
export function Modal({ open, onClose, title, children, footer, width = 520 }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={dialogRef} className="modal__dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} style={{ maxWidth: width }}>
        <div className="modal__header">
          <h2 id={titleId} className="modal__title">{title}</h2>
          <IconButton label="Close" onClick={onClose}><CloseIcon /></IconButton>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
