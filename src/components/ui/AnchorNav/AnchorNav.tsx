import { useEffect, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import './AnchorNav.css';

export interface AnchorLink {
  /** id of the section element on the page. */
  id: string;
  label: string;
}

interface AnchorNavProps {
  links: AnchorLink[];
  /** Small label above the links. */
  title?: string;
  /** Optional action under a divider, e.g. <Button variant="soft">Download segment profile</Button>. */
  action?: ReactNode;
  /** Start with this link active (for showing states in a gallery). Otherwise the section in view is active. */
  activeId?: string;
  className?: string;
}

/**
 * "On this page" navigation for long pages, in a sticky column on the right, as on production.
 * The section in view is highlighted as the user scrolls; clicking a link scrolls to its section.
 * Uses scrolling rather than URL hashes, because the prototype's routing is hash-based.
 */
export function AnchorNav({ links, title = 'On this page', action, activeId: fixedActive, className = '' }: AnchorNavProps) {
  const [activeId, setActiveId] = useState<string>(fixedActive ?? links[0]?.id ?? '');

  useEffect(() => {
    if (fixedActive) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => { if (entry.isIntersecting) setActiveId(entry.target.id); }),
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );
    const elements = links.map(l => document.getElementById(l.id)).filter((el): el is HTMLElement => !!el);
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [links, fixedActive]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (!fixedActive) setActiveId(id);
  };

  return (
    <nav className={`anchor-nav ${className}`} aria-label={title}>
      <p className="anchor-nav__title">{title}</p>
      <ul className="anchor-nav__list">
        {links.map(link => {
          const active = (fixedActive ?? activeId) === link.id;
          return (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`anchor-nav__link ${active ? 'anchor-nav__link--active' : ''}`}
                aria-current={active ? 'location' : undefined}
                onClick={e => go(e, link.id)}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
      {action && <div className="anchor-nav__action">{action}</div>}
    </nav>
  );
}
