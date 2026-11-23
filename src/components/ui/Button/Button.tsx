import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export type ButtonVariant = 'solid' | 'outlined' | 'soft' | 'plain';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** solid: the one main action. outlined: secondary or opens a menu. soft: card and page-header actions. plain: low emphasis. */
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'solid',
  size = 'md',
  startIcon,
  endIcon,
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? 'button--full' : '',
    loading ? 'button--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <span className="button__spinner" aria-hidden="true" /> : startIcon && <span className="button__icon">{startIcon}</span>}
      <span>{children}</span>
      {!loading && endIcon && <span className="button__icon">{endIcon}</span>}
    </button>
  );
}
