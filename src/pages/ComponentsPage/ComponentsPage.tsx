import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import {
  Accordion, AnchorNav, Button, Checkbox, CheckboxItem, Chip, EmptyState, IconButton, Modal, Notice,
  Pagination, RadioCards, RadioGroup, SegmentedControl, Select, Tabs, TextField, Toggle, Tooltip,
} from '../../components/ui';
import DownloadIcon from '../../assets/icons/Download.svg?react';
import ArrowForward from '../../assets/icons/ArrowForwardFilled.svg?react';
import ArrowBack from '../../assets/icons/ArrowBackFilled.svg?react';
import CloseIcon from '../../assets/icons/CloseFilled.svg?react';
import FilterIcon from '../../assets/icons/filter.svg?react';
import ShareIcon from '../../assets/icons/share-view.svg?react';
import ChildHealth from '../../assets/icons/child-health.svg?react';
import Immunisation from '../../assets/icons/immunisation.svg?react';
import MaternalHealth from '../../assets/icons/maternal-health.svg?react';
import Nutrition from '../../assets/icons/nutrition.svg?react';
import FamilyPlanning from '../../assets/icons/family-planning.svg?react';
import './ComponentsPage.css';

interface ComponentsPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const SECTIONS = [
  { id: 'buttons', title: 'Buttons' },
  { id: 'icon-buttons', title: 'Icon buttons' },
  { id: 'checkboxes', title: 'Checkboxes' },
  { id: 'radios', title: 'Radio buttons' },
  { id: 'toggles', title: 'Toggles' },
  { id: 'radio-cards', title: 'Radio cards' },
  { id: 'segmented', title: 'Segmented control' },
  { id: 'chips', title: 'Chips' },
  { id: 'text-fields', title: 'Text fields' },
  { id: 'selects', title: 'Select' },
  { id: 'tooltips', title: 'Tooltips' },
  { id: 'tabs', title: 'Tabs' },
  { id: 'accordions', title: 'Accordion list' },
  { id: 'modals', title: 'Modal' },
  { id: 'notices', title: 'Notices' },
  { id: 'empty-states', title: 'Empty states' },
  { id: 'pagination', title: 'Pagination' },
  { id: 'anchor-nav', title: 'On this page' },
  { id: 'filters', title: 'Pattern: filters menu' },
  { id: 'selection', title: 'Pattern: act on a selection' },
];

const HEALTH_AREAS = [
  { value: 'all', label: 'All data' },
  { value: 'child', label: 'Child health', icon: <ChildHealth /> },
  { value: 'immunisation', label: 'Immunisation', icon: <Immunisation /> },
  { value: 'maternal', label: 'Maternal health', icon: <MaternalHealth /> },
  { value: 'nutrition', label: 'Nutrition', icon: <Nutrition /> },
  { value: 'srh', label: 'Sexual and reproductive health', icon: <FamilyPlanning /> },
];

const INDICATORS: Record<string, string[]> = {
  'Child health': ['Children with diarrhoea who received ORS', 'Children with fever who sought care', 'No medical care for fever or cough'],
  'Maternal health': ['Fewer than 4 ANC visits', 'No PNC for newborn', 'Woman had a health check after last birth'],
  Nutrition: ['Child stunting', 'Exclusive breastfeeding under 6 months'],
};

const FORMAT_OPTIONS = [
  { value: 'png', label: 'PNG', hint: 'best for presentations' },
  { value: 'pdf', label: 'PDF', hint: 'best for printing' },
  { value: 'xlsx', label: 'XLSX', hint: 'the data behind the chart' },
];

const TOPICS = ['Article', 'Case study', 'Community event', 'Newsletter'];

/* ── Layout helpers ─────────────────────────────────────────────── */

function Section({ id, title, use, importName, children }: { id: string; title: string; use: ReactNode; importName?: string; children: ReactNode }) {
  return (
    <section id={id} className="components-page__section">
      <h2 className="components-page__section-title">{title}</h2>
      <p className="components-page__use">{use}</p>
      {importName && <code className="components-page__import">{`import { ${importName} } from '../../components/ui';`}</code>}
      {children}
    </section>
  );
}

function Demo({ children, label = 'Try it' }: { children: ReactNode; label?: string }) {
  return (
    <div className="components-page__demo">
      <span className="components-page__demo-label">{label}</span>
      <div className="components-page__demo-body">{children}</div>
    </div>
  );
}

function States({ children }: { children: ReactNode }) {
  return (
    <div className="components-page__states">
      <span className="components-page__demo-label">All states</span>
      <div className="components-page__states-grid">{children}</div>
    </div>
  );
}

function State({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="components-page__state">
      <div className="components-page__state-preview">{children}</div>
      <span className="components-page__state-label">{label}</span>
    </div>
  );
}

const noop = () => {};

/* ── Page ───────────────────────────────────────────────────────── */

export function ComponentsPage({ currentPage, onNavigate }: ComponentsPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Components';
  }, []);

  // Live demo state
  const [loading, setLoading] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({ a: true, b: false, c: false });
  const [format, setFormat] = useState('png');
  const [stdError, setStdError] = useState(false);
  const [stats, setStats] = useState(true);
  const [area, setArea] = useState('all');
  const [source, setSource] = useState('dhs-2024');
  const [population, setPopulation] = useState('all');
  const [filters, setFilters] = useState<string[]>(['Article', 'Case study']);
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [geo, setGeo] = useState('nairobi');
  const [tab, setTab] = useState('outcomes');
  const [listSearch, setListSearch] = useState('');
  const [selected, setSelected] = useState<string[]>(['No PNC for newborn']);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFormat, setModalFormat] = useState('png');
  const [noticeVisible, setNoticeVisible] = useState(true);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<string[]>(['Case study']);
  const [compareSelection, setCompareSelection] = useState<string[]>(['Fewer than 4 ANC visits', 'Child stunting', 'No PNC for newborn']);

  const emailError = emailTouched && email && !/^\S+@\S+\.\S+$/.test(email) ? 'Please enter a valid email address' : undefined;

  const filteredIndicators = useMemo(() => {
    const q = listSearch.trim().toLowerCase();
    return Object.entries(INDICATORS)
      .map(([group, items]) => [group, items.filter(i => i.toLowerCase().includes(q))] as const)
      .filter(([, items]) => items.length > 0);
  }, [listSearch]);

  const toggleIn = (list: string[], item: string) => (list.includes(item) ? list.filter(i => i !== item) : [...list, item]);

  const runLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="components-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      <header className="components-page__hero">
        <h1 className="components-page__title">Components</h1>
        <p className="components-page__intro">
          The building blocks for Pathways prototypes. Each one is live, so try it, and every state is shown underneath.
          Import them from <code>src/components/ui</code>. Rules on when to use each are in <code>docs/components.md</code>.
        </p>
      </header>

      <div className="components-page__layout">

        <main className="components-page__main">

          {/* Buttons */}
          <Section
            id="buttons"
            title="Buttons"
            importName="Button"
            use={<><strong>Solid</strong> for the one main action in a view. <strong>Outlined</strong> for secondary actions and anything that opens a menu. <strong>Soft</strong> for card and page-header actions. <strong>Plain</strong> for low-emphasis actions such as "Clear selection".</>}
          >
            <Demo>
              <Button endIcon={<ArrowForward />}>Compare across segments</Button>
              <Button variant="outlined" startIcon={<FilterIcon />}>Filters</Button>
              <Button variant="soft" startIcon={<DownloadIcon />}>Download</Button>
              <Button variant="plain">Clear selection</Button>
              <Button loading={loading} onClick={runLoading}>{loading ? 'Downloading' : 'Click to load'}</Button>
            </Demo>
            <States>
              {(['solid', 'outlined', 'soft', 'plain'] as const).map(v => (
                <div key={v} className="components-page__state-row">
                  <span className="components-page__row-label">{v[0].toUpperCase() + v.slice(1)}</span>
                  <State label="Default"><Button variant={v}>Button</Button></State>
                  <State label="Hover"><Button variant={v} className="is-hover">Button</Button></State>
                  <State label="Pressed"><Button variant={v} className="is-active">Button</Button></State>
                  <State label="Focus"><Button variant={v} className="is-focus">Button</Button></State>
                  <State label="Disabled"><Button variant={v} disabled>Button</Button></State>
                  <State label="Loading"><Button variant={v} loading>Button</Button></State>
                </div>
              ))}
              <div className="components-page__state-row">
                <span className="components-page__row-label">Sizes</span>
                <State label="Medium (48px)"><Button>Medium</Button></State>
                <State label="Small (32px)"><Button size="sm">Small</Button></State>
                <State label="With icons"><Button variant="outlined" startIcon={<ShareIcon />}>Share this view</Button></State>
              </div>
            </States>
          </Section>

          {/* Icon buttons */}
          <Section
            id="icon-buttons"
            title="Icon buttons"
            importName="IconButton"
            use={<><strong>Plain</strong> to close modals and sheets and for pagination arrows. <strong>Outlined</strong> for carousel arrows. Always give a <code>label</code>.</>}
          >
            <Demo>
              <IconButton label="Close"><CloseIcon /></IconButton>
              <IconButton label="Previous" variant="outlined"><ArrowBack /></IconButton>
              <IconButton label="Next" variant="outlined"><ArrowForward /></IconButton>
            </Demo>
            <States>
              {(['plain', 'outlined'] as const).map(v => (
                <div key={v} className="components-page__state-row">
                  <span className="components-page__row-label">{v === 'plain' ? 'Plain' : 'Outlined'}</span>
                  <State label="Default"><IconButton label="Close" variant={v}><CloseIcon /></IconButton></State>
                  <State label="Hover"><IconButton label="Close" variant={v} className="is-hover"><CloseIcon /></IconButton></State>
                  <State label="Pressed"><IconButton label="Close" variant={v} className="is-active"><CloseIcon /></IconButton></State>
                  <State label="Focus"><IconButton label="Close" variant={v} className="is-focus"><CloseIcon /></IconButton></State>
                  <State label="Disabled"><IconButton label="Close" variant={v} disabled><CloseIcon /></IconButton></State>
                </div>
              ))}
            </States>
          </Section>

          {/* Checkboxes */}
          <Section
            id="checkboxes"
            title="Checkboxes"
            importName="Checkbox, CheckboxItem"
            use={<>Pick several items from a list. Outlined when off, solid dark neutral when on. Use <code>CheckboxItem</code> for a full-width clickable row.</>}
          >
            <Demo>
              <div className="components-page__stack">
                <CheckboxItem label="Fewer than 4 ANC visits" checked={checks.a} onChange={v => setChecks(c => ({ ...c, a: v }))} />
                <CheckboxItem label="No PNC for newborn" checked={checks.b} onChange={v => setChecks(c => ({ ...c, b: v }))} />
                <CheckboxItem label="Child stunting" meta="Nutrition" checked={checks.c} onChange={v => setChecks(c => ({ ...c, c: v }))} />
              </div>
            </Demo>
            <States>
              <div className="components-page__state-row">
                <span className="components-page__row-label">Off</span>
                <State label="Default"><Checkbox checked={false} ariaLabel="Example" /></State>
                <State label="Hover"><Checkbox checked={false} className="is-hover" ariaLabel="Example" /></State>
                <State label="Focus"><Checkbox checked={false} className="is-focus" ariaLabel="Example" /></State>
                <State label="Disabled"><Checkbox checked={false} disabled ariaLabel="Example" /></State>
              </div>
              <div className="components-page__state-row">
                <span className="components-page__row-label">On</span>
                <State label="Default"><Checkbox checked ariaLabel="Example" /></State>
                <State label="Hover"><Checkbox checked className="is-hover" ariaLabel="Example" /></State>
                <State label="Focus"><Checkbox checked className="is-focus" ariaLabel="Example" /></State>
                <State label="Disabled"><Checkbox checked disabled ariaLabel="Example" /></State>
              </div>
              <div className="components-page__state-row">
                <span className="components-page__row-label">Row</span>
                <State label="Hover"><CheckboxItem label="List item" checked={false} onChange={noop} className="is-hover" /></State>
                <State label="Disabled"><CheckboxItem label="List item" checked={false} onChange={noop} disabled /></State>
              </div>
            </States>
          </Section>

          {/* Radios */}
          <Section
            id="radios"
            title="Radio buttons"
            importName="RadioGroup"
            use={<>One choice from a few options, usually in a modal. A selected radio stays outlined with a dark dot: radios are never solid. Add a muted <code>hint</code> if it helps people choose.</>}
          >
            <Demo>
              <RadioGroup name="demo-format" label="Format" options={FORMAT_OPTIONS} value={format} onChange={setFormat} />
            </Demo>
            <States>
              <div className="components-page__state-row">
                <State label="Off"><RadioGroup name="s1" options={[{ value: 'a', label: 'Option' }]} value="" onChange={noop} /></State>
                <State label="Hover"><RadioGroup name="s2" className="components-page__force-hover" options={[{ value: 'a', label: 'Option' }]} value="" onChange={noop} /></State>
                <State label="Selected"><RadioGroup name="s3" options={[{ value: 'a', label: 'Option' }]} value="a" onChange={noop} /></State>
                <State label="Focus"><RadioGroup name="s4" className="components-page__force-focus" options={[{ value: 'a', label: 'Option' }]} value="a" onChange={noop} /></State>
                <State label="Disabled"><RadioGroup name="s5" options={[{ value: 'a', label: 'Option', disabled: true }]} value="" onChange={noop} /></State>
                <State label="Disabled, selected"><RadioGroup name="s6" options={[{ value: 'a', label: 'Option', disabled: true }]} value="a" onChange={noop} /></State>
              </div>
            </States>
          </Section>

          {/* Toggles */}
          <Section
            id="toggles"
            title="Toggles"
            importName="Toggle"
            use={<>Turn an optional layer on or off, with the label on the left. Changes take effect straight away, with no Apply button.</>}
          >
            <Demo>
              <Toggle label="Standard error" checked={stdError} onChange={setStdError} />
              <Toggle label="Statistical differences" checked={stats} onChange={setStats} />
            </Demo>
            <States>
              <div className="components-page__state-row">
                <span className="components-page__row-label">Off</span>
                <State label="Default"><Toggle label="Label" checked={false} onChange={noop} /></State>
                <State label="Hover"><Toggle label="Label" checked={false} onChange={noop} className="is-hover" /></State>
                <State label="Focus"><Toggle label="Label" checked={false} onChange={noop} className="is-focus" /></State>
                <State label="Disabled"><Toggle label="Label" checked={false} onChange={noop} disabled /></State>
              </div>
              <div className="components-page__state-row">
                <span className="components-page__row-label">On</span>
                <State label="Default"><Toggle label="Label" checked onChange={noop} /></State>
                <State label="Hover"><Toggle label="Label" checked onChange={noop} className="is-hover" /></State>
                <State label="Focus"><Toggle label="Label" checked onChange={noop} className="is-focus" /></State>
                <State label="Disabled"><Toggle label="Label" checked onChange={noop} disabled /></State>
              </div>
            </States>
          </Section>

          {/* Radio cards */}
          <Section
            id="radio-cards"
            title="Radio cards"
            importName="RadioCards"
            use={<><strong>Row:</strong> filter a whole view by health area, starting with "All data". <strong>List:</strong> one choice where each option needs more detail, such as a data source.</>}
          >
            <Demo label="Row">
              <RadioCards name="demo-area" label="Health area" options={HEALTH_AREAS} value={area} onChange={setArea} />
            </Demo>
            <Demo label="List">
              <div className="components-page__narrow">
                <RadioCards
                  name="demo-source"
                  layout="list"
                  label="Data source"
                  value={source}
                  onChange={setSource}
                  options={[
                    { value: 'dhs-2024', label: 'DHS survey 2024 & 2025', badge: <Chip variant="success">Recommended</Chip> },
                    { value: 'pathways-2024', label: 'Pathways Survey 2024', description: 'Not representative below national level' },
                    { value: 'dhs-2023', label: 'DHS survey 2023' },
                    { value: 'dhs-2014', label: 'DHS survey 2014', description: 'Not available for this segmentation', disabled: true },
                  ]}
                />
              </div>
            </Demo>
            <States>
              <div className="components-page__state-row">
                <State label="Default"><RadioCards name="rc1" options={[HEALTH_AREAS[1]]} value="" onChange={noop} /></State>
                <State label="Hover"><RadioCards name="rc2" className="components-page__force-hover" options={[HEALTH_AREAS[1]]} value="" onChange={noop} /></State>
                <State label="Selected"><RadioCards name="rc3" options={[HEALTH_AREAS[1]]} value="child" onChange={noop} /></State>
                <State label="Focus"><RadioCards name="rc4" className="components-page__force-focus" options={[HEALTH_AREAS[1]]} value="child" onChange={noop} /></State>
                <State label="Disabled"><RadioCards name="rc5" options={[{ ...HEALTH_AREAS[1], disabled: true }]} value="" onChange={noop} /></State>
              </div>
            </States>
          </Section>

          {/* Segmented */}
          <Section
            id="segmented"
            title="Segmented control"
            importName="SegmentedControl"
            use={<>Switch between views of the same data, such as population type or how segments are grouped. Two to four short options.</>}
          >
            <Demo>
              <SegmentedControl label="Population type" value={population} onChange={setPopulation} options={[{ value: 'all', label: 'All segments' }, { value: 'rural', label: 'Rural 4' }, { value: 'urban', label: 'Urban 4' }]} />
            </Demo>
            <States>
              <div className="components-page__state-row">
                <State label="Selected and default"><SegmentedControl label="States" value="a" onChange={noop} options={[{ value: 'a', label: 'Selected' }, { value: 'b', label: 'Default' }]} /></State>
                <State label="Hover"><SegmentedControl label="Hover" className="components-page__force-hover-second" value="a" onChange={noop} options={[{ value: 'a', label: 'Selected' }, { value: 'b', label: 'Hover' }]} /></State>
                <State label="Focus"><SegmentedControl label="Focus" className="components-page__force-focus-first" value="a" onChange={noop} options={[{ value: 'a', label: 'Selected' }, { value: 'b', label: 'Default' }]} /></State>
                <State label="Disabled option"><SegmentedControl label="Disabled" value="a" onChange={noop} options={[{ value: 'a', label: 'Selected' }, { value: 'b', label: 'Disabled', disabled: true }]} /></State>
              </div>
            </States>
          </Section>

          {/* Chips */}
          <Section
            id="chips"
            title="Chips"
            importName="Chip"
            use={<>Tags and statuses on cards and table rows, applied filters (with a remove button) and vulnerability levels. Chips aren't buttons: to filter, use radio cards or a filters menu.</>}
          >
            <Demo>
              {filters.map(f => <Chip key={f} onRemove={() => setFilters(fs => fs.filter(x => x !== f))}>{f}</Chip>)}
              {filters.length === 0 && <Button variant="plain" size="sm" onClick={() => setFilters(['Article', 'Case study'])}>Reset filters</Button>}
            </Demo>
            <States>
              <div className="components-page__state-row">
                <State label="Soft (tag)"><Chip>Case study</Chip></State>
                <State label="Outlined"><Chip variant="outlined">Kenya</Chip></State>
                <State label="Success"><Chip variant="success">Recommended</Chip></State>
                <State label="Removable"><Chip onRemove={noop}>Newsletter</Chip></State>
                <State label="Remove: hover"><Chip onRemove={noop} className="components-page__force-hover">Newsletter</Chip></State>
                <State label="With icon"><Chip icon={<Nutrition />}>Nutrition</Chip></State>
              </div>
              <div className="components-page__state-row">
                <span className="components-page__row-label">Levels</span>
                <State label="Least"><Chip variant="level" level="least">Least vulnerable</Chip></State>
                <State label="Less"><Chip variant="level" level="less">Less vulnerable</Chip></State>
                <State label="More"><Chip variant="level" level="more">More vulnerable</Chip></State>
                <State label="Most"><Chip variant="level" level="most">Most vulnerable</Chip></State>
              </div>
            </States>
          </Section>

          {/* Text fields */}
          <Section
            id="text-fields"
            title="Text fields"
            importName="TextField"
            use={<><strong>Search:</strong> soft fill with a clear button, for filtering lists. <strong>Field:</strong> outlined with a label, for forms. Show errors under the field, in plain words.</>}
          >
            <Demo>
              <div className="components-page__fields">
                <TextField variant="search" placeholder="Search data points" value={search} onChange={setSearch} aria-label="Search data points" />
                <TextField label="Email" placeholder="name@organisation.org" value={email} onChange={setEmail} onBlur={() => setEmailTouched(true)} error={emailError} helper="We'll only use this to reply to you." />
              </div>
            </Demo>
            <States>
              <div className="components-page__state-row">
                <span className="components-page__row-label">Search</span>
                <State label="Empty"><TextField variant="search" placeholder="Search" value="" onChange={noop} aria-label="Search" /></State>
                <State label="Focus"><TextField variant="search" placeholder="Search" value="" onChange={noop} className="is-focus" aria-label="Search" /></State>
                <State label="Filled"><TextField variant="search" placeholder="Search" value="ANC" onChange={noop} aria-label="Search" /></State>
                <State label="Disabled"><TextField variant="search" placeholder="Search" value="" onChange={noop} disabled aria-label="Search" /></State>
              </div>
              <div className="components-page__state-row">
                <span className="components-page__row-label">Field</span>
                <State label="Default"><TextField label="Organisation" placeholder="Organisation" value="" onChange={noop} /></State>
                <State label="Hover"><TextField label="Organisation" placeholder="Organisation" value="" onChange={noop} className="is-hover" /></State>
                <State label="Focus"><TextField label="Organisation" value="Ministry of Health" onChange={noop} className="is-focus" /></State>
                <State label="Error"><TextField label="Email" value="name@" onChange={noop} error="Please enter a valid email address" /></State>
                <State label="Disabled"><TextField label="Organisation" value="Ministry of Health" onChange={noop} disabled /></State>
              </div>
            </States>
          </Section>

          {/* Select */}
          <Section
            id="selects"
            title="Select"
            importName="Select"
            use={<>Choose one item from a set list that's too long for a segmented control, such as a geography in a filter bar.</>}
          >
            <Demo>
              <Select label="County" value={geo} onChange={setGeo} options={[{ value: 'nairobi', label: 'Nairobi' }, { value: 'mombasa', label: 'Mombasa' }, { value: 'kisumu', label: 'Kisumu' }, { value: 'turkana', label: 'Turkana' }]} />
            </Demo>
            <States>
              <div className="components-page__state-row components-page__state-row--tall">
                <State label="Placeholder"><Select value="" onChange={noop} placeholder="Select a county" options={[]} /></State>
                <State label="Hover"><Select value="nairobi" onChange={noop} className="is-hover" options={[{ value: 'nairobi', label: 'Nairobi' }]} /></State>
                <State label="Focus"><Select value="nairobi" onChange={noop} className="is-focus" options={[{ value: 'nairobi', label: 'Nairobi' }]} /></State>
                <State label="Disabled"><Select value="nairobi" onChange={noop} disabled options={[{ value: 'nairobi', label: 'Nairobi' }]} /></State>
                <State label="Open"><Select value="kisumu" onChange={noop} defaultOpen options={[{ value: 'nairobi', label: 'Nairobi' }, { value: 'kisumu', label: 'Kisumu' }, { value: 'turkana', label: 'Turkana' }]} /></State>
              </div>
            </States>
          </Section>

          {/* Tooltips */}
          <Section
            id="tooltips"
            title="Tooltips"
            importName="Tooltip"
            use={<>Explain a term or number with an info icon. Keep it to one or two sentences; anything longer belongs in a modal or on the page.</>}
          >
            <Demo>
              <span className="components-page__inline">
                Denominator
                <Tooltip content="The population group this data point is calculated from. Different data points may measure different groups." />
              </span>
            </Demo>
            <States>
              <div className="components-page__state-row components-page__state-row--tall-top">
                <State label="Closed"><Tooltip content="Explanation" /></State>
                <State label="Open"><Tooltip content="Women aged 15–49 with a live birth in the last 3 years" defaultOpen /></State>
              </div>
            </States>
          </Section>

          {/* Tabs */}
          <Section
            id="tabs"
            title="Tabs"
            importName="Tabs"
            use={<>Switch between sibling panels of content. For switching how the same data is shown, use a segmented control instead.</>}
          >
            <Demo>
              <div className="components-page__wide">
                <Tabs label="Data point type" value={tab} onChange={setTab} tabs={[{ value: 'outcomes', label: 'Health outcomes and behaviours', count: 48 }, { value: 'factors', label: 'Vulnerability factors', count: 62 }]} />
                <p className="components-page__tab-panel">{tab === 'outcomes' ? 'Showing health outcomes and behaviours.' : 'Showing vulnerability factors.'}</p>
              </div>
            </Demo>
            <States>
              <div className="components-page__state-row">
                <State label="Selected"><Tabs label="s" value="a" onChange={noop} tabs={[{ value: 'a', label: 'Tab' }]} /></State>
                <State label="Default"><Tabs label="s" value="x" onChange={noop} tabs={[{ value: 'a', label: 'Tab' }]} /></State>
                <State label="Hover"><Tabs label="s" value="x" onChange={noop} className="components-page__force-hover" tabs={[{ value: 'a', label: 'Tab' }]} /></State>
                <State label="Focus"><Tabs label="s" value="a" onChange={noop} className="components-page__force-focus" tabs={[{ value: 'a', label: 'Tab' }]} /></State>
                <State label="Disabled"><Tabs label="s" value="x" onChange={noop} tabs={[{ value: 'a', label: 'Tab', disabled: true }]} /></State>
              </div>
            </States>
          </Section>

          {/* Accordion list */}
          <Section
            id="accordions"
            title="Accordion list"
            importName="Accordion, CheckboxItem, TextField"
            use={<>Long, searchable lists grouped by category, like the data browser's data points. Search opens every matching group. No matches shows a compact empty state.</>}
          >
            <Demo>
              <div className="components-page__list">
                <TextField variant="search" placeholder="Search data points" value={listSearch} onChange={setListSearch} aria-label="Search data points" />
                {filteredIndicators.length === 0 ? (
                  <EmptyState compact title={`No results found for "${listSearch}"`} action={<Button variant="plain" size="sm" onClick={() => setListSearch('')}>Clear search</Button>} />
                ) : (
                  filteredIndicators.map(([group, items]) => (
                    <Accordion key={group + (listSearch ? '-q' : '')} title={group} count={items.length} defaultOpen={!!listSearch || group === 'Maternal health'}>
                      {items.map(item => (
                        <CheckboxItem key={item} label={item} checked={selected.includes(item)} onChange={() => setSelected(s => toggleIn(s, item))} />
                      ))}
                    </Accordion>
                  ))
                )}
              </div>
            </Demo>
            <States>
              <div className="components-page__state-row components-page__state-row--block">
                <State label="Closed"><div className="components-page__list-preview"><Accordion title="Child health" count={3}>…</Accordion></div></State>
                <State label="Hover"><div className="components-page__list-preview components-page__force-hover"><Accordion title="Child health" count={3}>…</Accordion></div></State>
                <State label="Open"><div className="components-page__list-preview"><Accordion title="Nutrition" count={2} defaultOpen><CheckboxItem label="Child stunting" checked onChange={noop} /></Accordion></div></State>
              </div>
            </States>
          </Section>

          {/* Modal */}
          <Section
            id="modals"
            title="Modal"
            importName="Modal"
            use={<>A focused task over the page, such as exporting. Closes with ✕, Escape or a click outside. Becomes a full-screen sheet on phones, with stacked full-width buttons.</>}
          >
            <Demo>
              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => setModalOpen(true)}>Download</Button>
            </Demo>
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Download chart"
              footer={<><Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => setModalOpen(false)}>Download</Button></>}
            >
              <RadioGroup name="modal-format" label="Format" options={FORMAT_OPTIONS} value={modalFormat} onChange={setModalFormat} />
            </Modal>
          </Section>

          {/* Notices */}
          <Section
            id="notices"
            title="Notices"
            importName="Notice"
            use={<>Tell people about a limitation before they read the data: state it, then what it means for them. Make it dismissible once read.</>}
          >
            <Demo>
              {noticeVisible ? (
                <Notice tone="warning" onDismiss={() => setNoticeVisible(false)} action={<a href="#components" onClick={e => e.preventDefault()}>View source data details</a>}>
                  This segmentation is based on the Pathways Survey, which is not designed to yield exact state-level results. Interpret this data with caution.
                </Notice>
              ) : (
                <Button variant="plain" size="sm" onClick={() => setNoticeVisible(true)}>Show the notice again</Button>
              )}
            </Demo>
            <States>
              <div className="components-page__state-row components-page__state-row--block">
                <State label="Info"><Notice>One urban segment is not included here (1% of the population) due to uncertainty in estimates owing to its very small size.</Notice></State>
                <State label="Warning, with title"><Notice tone="warning" title="Illustrative data">These figures are made up for this prototype. Don't use them as findings.</Notice></State>
              </div>
            </States>
          </Section>

          {/* Empty states */}
          <Section
            id="empty-states"
            title="Empty states"
            importName="EmptyState"
            use={<>When there's nothing to show yet, or a search finds nothing. One plain line, plus an action if there's an obvious next step.</>}
          >
            <States>
              <div className="components-page__state-row components-page__state-row--block">
                <State label="Default"><EmptyState title="No data selected">Select data points from the list to compare them across segments.</EmptyState></State>
                <State label="Compact (side panels)"><EmptyState compact title='No results found for "zinc"' action={<Button variant="plain" size="sm">Clear search</Button>} /></State>
              </div>
            </States>
          </Section>

          {/* Pagination */}
          <Section
            id="pagination"
            title="Pagination"
            importName="Pagination"
            use={<>Page through long lists of content, such as blog posts. Long ranges collapse with "…".</>}
          >
            <Demo>
              <Pagination page={page} pageCount={12} onChange={setPage} />
            </Demo>
            <States>
              <div className="components-page__state-row">
                <State label="First page"><Pagination page={1} pageCount={4} onChange={noop} /></State>
                <State label="Last page"><Pagination page={4} pageCount={4} onChange={noop} /></State>
                <State label="Many pages"><Pagination page={6} pageCount={12} onChange={noop} /></State>
              </div>
            </States>
          </Section>

          {/* Anchor nav */}
          <Section
            id="anchor-nav"
            title="On this page"
            importName="AnchorNav"
            use={<>In-page navigation for long pages such as segment profiles, in a sticky column on the right. The section in view is highlighted as you scroll. Add an <code>action</code> for the page's main download. This page's own right-hand column uses it.</>}
          >
            <States>
              <div className="components-page__state-row">
                <State label="Active, default, hover and focus links">
                  <div className="components-page__anchor-preview">
                    <AnchorNav
                      activeId="demo-b"
                      links={[{ id: 'demo-a', label: 'Introduction' }, { id: 'demo-b', label: 'Key data points' }, { id: 'demo-c', label: 'Segment prevalence' }, { id: 'demo-d', label: 'All data points' }]}
                      className="components-page__anchor-states"
                    />
                  </div>
                </State>
                <State label="With an action">
                  <div className="components-page__anchor-preview">
                    <AnchorNav
                      activeId="demo-e"
                      links={[{ id: 'demo-e', label: 'Introduction' }, { id: 'demo-f', label: 'Walk in her shoes' }, { id: 'demo-g', label: 'All data points' }]}
                      action={<Button variant="soft" endIcon={<DownloadIcon />}>Download segment profile</Button>}
                    />
                  </div>
                </State>
              </div>
            </States>
          </Section>

          {/* Pattern: filters menu */}
          <Section
            id="filters"
            title="Pattern: filters menu"
            use={<>Filter a list of content. An outlined "Filters" button opens checkboxes with Clear and Apply. Applied filters show as removable chips under the heading.</>}
          >
            <Demo>
              <div className="components-page__wide components-page__wide--menu">
                <div className="components-page__filters-bar">
                  <h3 className="components-page__filters-title">Latest updates</h3>
                  <div className="components-page__filters-anchor">
                    <Button variant="outlined" startIcon={<FilterIcon />} aria-expanded={filtersOpen} onClick={() => { setDraftFilters(appliedFilters); setFiltersOpen(o => !o); }}>
                      Filters{appliedFilters.length > 0 ? ` (${appliedFilters.length})` : ''}
                    </Button>
                    {filtersOpen && (
                      <div className="components-page__filters-menu">
                        {TOPICS.map(t => <CheckboxItem key={t} label={t} checked={draftFilters.includes(t)} onChange={() => setDraftFilters(d => toggleIn(d, t))} />)}
                        <div className="components-page__filters-actions">
                          <Button variant="outlined" size="sm" onClick={() => setDraftFilters([])}>Clear</Button>
                          <Button size="sm" onClick={() => { setAppliedFilters(draftFilters); setFiltersOpen(false); }}>Apply</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="components-page__applied">
                  {appliedFilters.length === 0
                    ? <span className="components-page__muted">No filters applied</span>
                    : appliedFilters.map(f => <Chip key={f} onRemove={() => setAppliedFilters(a => a.filter(x => x !== f))}>{f}</Chip>)}
                </div>
              </div>
            </Demo>
          </Section>

          {/* Pattern: selection */}
          <Section
            id="selection"
            title="Pattern: act on a selection"
            use={<>Once people have selected items, show a plain "Clear selection" next to a solid main action that includes the count. Disable the main action when nothing is selected.</>}
          >
            <Demo>
              <div className="components-page__wide">
                <div className="components-page__selection-bar">
                  <h3 className="components-page__filters-title">All data points</h3>
                  <div className="components-page__selection-actions">
                    {compareSelection.length > 0 && <Button variant="plain" onClick={() => setCompareSelection([])}>Clear selection</Button>}
                    <Button endIcon={<ArrowForward />} disabled={compareSelection.length === 0}>
                      Compare across segments{compareSelection.length > 0 ? ` (${compareSelection.length})` : ''}
                    </Button>
                  </div>
                </div>
                <div className="components-page__stack">
                  {['Fewer than 4 ANC visits', 'No PNC for newborn', 'Child stunting', 'Exclusive breastfeeding under 6 months'].map(i => (
                    <CheckboxItem key={i} label={i} checked={compareSelection.includes(i)} onChange={() => setCompareSelection(s => toggleIn(s, i))} />
                  ))}
                </div>
              </div>
            </Demo>
          </Section>

        </main>

        <aside className="components-page__aside">
          <AnchorNav links={SECTIONS.map(sec => ({ id: sec.id, label: sec.title }))} />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
