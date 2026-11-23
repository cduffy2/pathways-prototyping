import ArrowBack from '../../../assets/icons/ArrowBackFilled.svg?react';
import ArrowForward from '../../../assets/icons/ArrowForwardFilled.svg?react';
import { IconButton } from '../IconButton/IconButton';
import './Pagination.css';

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  className?: string;
}

/** Pages 1-based. Shows first, last and neighbours, with "…" for gaps. */
function pageList(page: number, count: number): (number | 'gap')[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const pages = new Set([1, count, page - 1, page, page + 1]);
  const sorted = [...pages].filter(p => p >= 1 && p <= count).sort((a, b) => a - b);
  const out: (number | 'gap')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('gap');
    out.push(p);
  });
  return out;
}

export function Pagination({ page, pageCount, onChange, className = '' }: PaginationProps) {
  return (
    <nav className={`pagination ${className}`} aria-label="Pagination">
      <IconButton label="Previous page" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}><ArrowBack /></IconButton>
      {pageList(page, pageCount).map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="pagination__gap">…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={`pagination__page ${p === page ? 'pagination__page--current' : ''}`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <IconButton label="Next page" size="sm" disabled={page >= pageCount} onClick={() => onChange(page + 1)}><ArrowForward /></IconButton>
    </nav>
  );
}
