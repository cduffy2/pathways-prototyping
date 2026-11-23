import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import SearchIcon from '../../../assets/icons/Search.svg?react';
import CloseIcon from '../../../assets/icons/CloseFilled.svg?react';
import './TextField.css';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  /** Visible label above the field. Leave out only for search fields. */
  label?: string;
  /** Short help under the field. Replaced by `error` when there is one. */
  helper?: ReactNode;
  error?: string;
  /** search: soft fill with a search icon and a clear button, for filtering lists. field: outlined, for forms. */
  variant?: 'field' | 'search';
  className?: string;
}

export function TextField({ value, onChange, label, helper, error, variant = 'field', disabled, className = '', id, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const message = error || helper;

  return (
    <div className={`text-field text-field--${variant} ${error ? 'text-field--error' : ''} ${disabled ? 'text-field--disabled' : ''} ${className}`}>
      {label && <label className="text-field__label" htmlFor={inputId}>{label}</label>}
      <div className="text-field__control">
        {variant === 'search' && <SearchIcon className="text-field__icon" aria-hidden="true" />}
        <input
          id={inputId}
          className="text-field__input"
          value={value}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={message ? messageId : undefined}
          onChange={e => onChange(e.target.value)}
          type={variant === 'search' ? 'search' : rest.type}
          {...rest}
        />
        {variant === 'search' && value && !disabled && (
          <button type="button" className="text-field__clear" onClick={() => onChange('')} aria-label="Clear search">
            <CloseIcon />
          </button>
        )}
      </div>
      {message && <p id={messageId} className="text-field__message">{message}</p>}
    </div>
  );
}
