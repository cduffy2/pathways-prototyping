import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './IconButton.css';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name, read by screen readers. Required because there is no visible text. */
  label: string;
  variant?: 'plain' | 'outlined';
  size?: 'md' | 'sm';
  children: ReactNode;
}

export function IconButton({ label, variant = 'plain', size = 'md', className = '', children, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`icon-button icon-button--${variant} icon-button--${size} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
