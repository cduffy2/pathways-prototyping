import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import {
  AverageKey, BarChart, BoxPlot, ChartCard, DataPointBar, SegmentBreakdownBar, SegmentLegend, SegmentPie, StackedBarChart,
} from '../../components/charts';
import type { AreaBreakdown, PopulationFilter, SegmentValue } from '../../components/charts';
import { AnchorNav, Notice, SegmentedControl, Toggle } from '../../components/ui';
import '../ComponentsPage/ComponentsPage.css';
import './ChartsPage.css';

interface ChartsPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

/* ── Illustrative data (not real findings) ─────────────────────── */

const DEFAULT_SAMPLE = 'Women aged 15–49';

const NO_ANC: SegmentValue[] = [
  { segment: 'U4', value: 9.2, standardError: 2.4 },
  { segment: 'R2', value: 0.4, standardError: 0.2 },
  { segment: 'R3.1', value: 1.5, standardError: 0.5 },
  { segment: 'R3.2', value: 3, standardError: 0.7 },
  { segment: 'R4', value: 8, standardError: 1.2 },
  { segment: 'U1', value: 0, standardError: 0 },
  { segment: 'U2.1', value: 0.5, standardError: 0.2 },
  { segment: 'U2.2', value: 1.6, standardError: 0.9 },
];

const FIRST_BIRTH = {
  categories: [
    { key: 'under18', label: 'Under 18' },
    { key: '18to19', label: '18 to 19' },
    { key: '20to24', label: '20 to 24' },
    { key: '25plus', label: '25 or older' },
    { key: 'none', label: 'No births' },
  ],
  data: [
    { segment: 'R2', values: { under18: 18, '18to19': 20, '20to24': 34, '25plus': 14, none: 14 } },
    { segment: 'R3.1', values: { under18: 28, '18to19': 24, '20to24': 28, '25plus': 8, none: 12 } },
    { segment: 'R3.2', values: null },
    { segment: 'R4', values: { under18: 41, '18to19': 23, '20to24': 22, '25plus': 4, none: 10 } },
    { segment: 'U1', values: { under18: 6, '18to19': 10, '20to24': 30, '25plus': 32, none: 22 } },
    { segment: 'U2.1', values: { under18: 14, '18to19': 17, '20to24': 33, '25plus': 18, none: 18 } },
    { segment: 'U2.2', values: { under18: 16, '18to19': 19, '20to24': 31, '25plus': 16, none: 18 } },
    { segment: 'U4', values: { under18: 33, '18to19': 22, '20to24': 25, '25plus': 7, none: 13 } },
  ],
  average: { under18: 22, '18to19': 20, '20to24': 29, '25plus': 14, none: 15 },
};

const PARTNER_AGE = {
  data: [
    { segment: 'R2', stats: { min: 25, q1: 30, median: 35, q3: 41, max: 52, mean: 36 } },
    { segment: 'R3.1', stats: { min: 24, q1: 29, median: 35, q3: 40, max: 53, mean: 35.5 } },
    { segment: 'R3.2', stats: null },
    { segment: 'R4', stats: { min: 26, q1: 33, median: 40, q3: 48, max: 63, mean: 41 } },
    { segment: 'U1', stats: { min: 26, q1: 30, median: 34, q3: 38, max: 49, mean: 34.5 } },
    { segment: 'U2.1', stats: { min: 24, q1: 28, median: 33, q3: 37, max: 47, mean: 33 } },
    { segment: 'U2.2', stats: { min: 27, q1: 34, median: 40, q3: 46, max: 60, mean: 40.5 } },
    { segment: 'U4', stats: { min: 25, q1: 31, median: 36, q3: 41, max: 53, mean: 36.5 } },
  ],
  sample: { min: 25, q1: 30, median: 36, q3: 42, max: 55, mean: 36.5 },
};

const AREAS: AreaBreakdown[] = [
  { name: 'Baringo', shares: { 'U2.1': 6, 'U2.2': 3, U1: 3, R4: 16, 'R3.1': 30, 'R3.2': 19, R2: 23 } },
  { name: 'Bomet', shares: { 'U2.1': 1, 'U2.2': 1, U1: 1, R4: 1, 'R3.1': 50, 'R3.2': 17, R2: 29 } },
  { name: 'Nairobi', shares: { U4: 9, 'U2.1': 34, 'U2.2': 27, U1: 30 } },
];

const PROFILE_POINTS = [
  { label: 'No ANC visit', value: 8, average: 1.8, standardError: 1.2 },
  { label: 'Less than 4 ANC visits', value: 54, average: 38, standardError: 3.1 },
  { label: 'Latest birth delivered at home', value: 61, average: 29, standardError: 2.8 },
  { label: 'No PNC for newborn', value: null, average: 33 },
];

const CHOOSING = [
  ['Bar chart', 'How do segments compare on one data point?', 'bar'],
  ['Stacked bar chart', 'How does each segment split across the categories of one data point?', 'stacked'],
  ['Data point bar', 'How does one segment do on one data point? (profiles)', 'data-point'],
  ['Box plot', 'How spread out are values within each segment?', 'box'],
  ['Segment breakdown bar', 'Which segments make up each area’s population?', 'breakdown'],
  ['Pie chart', 'The same, one area at a time', 'pie'],
];

/* ── Layout helpers ─────────────────────────────────────────────── */

function Section({ id, title, use, importName, children }: { id: string; title: string; use: ReactNode; importName?: string; children: ReactNode }) {
  return (
    <section id={id} className="components-page__section">
      <h2 className="components-page__section-title">{title}</h2>
      <p className="components-page__use">{use}</p>
      {importName && <code className="components-page__import">{`import { ${importName} } from '../../components/charts';`}</code>}
      {children}
    </section>
  );
}

function Controls({ children }: { children: ReactNode }) {
  return <div className="charts-page__controls">{children}</div>;
}

const SURVEY_NOTICE = (
  <Notice tone="warning" action={<a href="#charts" onClick={e => e.preventDefault()}>View source data details</a>}>
    This segmentation is based on the Pathways Survey, which is not designed to yield exact county-level results. Interpret this data with caution.
  </Notice>
);

/* ── Page ───────────────────────────────────────────────────────── */

export function ChartsPage({ currentPage, onNavigate }: ChartsPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Charts';
  }, []);

  const [barSE, setBarSE] = useState(false);
  const [barCase, setBarCase] = useState('complete');
  const [barType, setBarType] = useState<'outcome' | 'factor'>('outcome');
  const [ownDenominator, setOwnDenominator] = useState(true);
  const [subNational, setSubNational] = useState(false);
  const [profileSE, setProfileSE] = useState(false);
  const [filter, setFilter] = useState<PopulationFilter>('both');

  const barData = barCase === 'missing'
    ? NO_ANC.map(d => (d.segment === 'R3.2' ? { ...d, value: null } : d))
    : NO_ANC;

  const sections = [
    ['choosing', 'Choosing a chart'], ['rules', 'Rules for every chart'], ['bar', 'Bar chart'], ['stacked', 'Stacked bar chart'],
    ['data-point', 'Data point bar'], ['box', 'Box plot'], ['breakdown', 'Segment breakdown bar'], ['pie', 'Pie chart'], ['colour', 'Colour and texture'],
  ];

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="components-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      <header className="components-page__hero">
        <h1 className="components-page__title">Charts</h1>
        <p className="components-page__intro">
          Every Pathways chart, built to the rules in <code>docs/dataviz.md</code>. Import them from <code>src/components/charts</code>:
          segment order, N/A slots, value labels, benchmarks and colours are built in. All data on this page is illustrative.
        </p>
      </header>

      <div className="components-page__layout">

        <main className="components-page__main">

          <Section id="choosing" title="Choosing a chart" use="Each chart shows one data point. Pick the chart by the question it answers.">
            <div className="charts-page__table-wrap">
              <table className="charts-page__table">
                <thead><tr><th>Chart</th><th>Answers</th></tr></thead>
                <tbody>
                  {CHOOSING.map(([name, q, id]) => (
                    <tr key={id}><td><a href="#charts" onClick={e => { e.preventDefault(); scrollTo(id); }}>{name}</a></td><td>{q}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="rules" title="Rules for every chart" use="The chart components do these for you. If you draw a chart by hand, follow them.">
            <ol className="charts-page__rules">
              <li><strong>Same segment order everywhere:</strong> rural then urban, by code. Breakdown charts go urban then rural, most to least vulnerable.</li>
              <li><strong>Title and plain-language description,</strong> so the chart makes sense once downloaded.</li>
              <li><strong>Denominator only when it differs</strong> from the segmentation's default sample.</li>
              <li><strong>A value label on every bar,</strong> so no axis is needed.</li>
              <li><strong>Missing data is never zero:</strong> keep the slot, dashed outline, "N/A". A real zero is an empty slot labelled "0%".</li>
              <li><strong>Benchmark:</strong> sample average line (bar), Average bar (stacked), Sample box (box plot).</li>
              <li><strong>Standard error</strong> only when the user turns it on.</li>
            </ol>
          </Section>

          <Section id="bar" title="Bar chart" importName="ChartCard, BarChart, AverageKey"
            use={<>How segments compare on one data point. Blue for health outcomes and behaviours, slate blue for vulnerability factors. The sample average is a dashed line with its value in a dark chip.</>}>
            <Controls>
              <SegmentedControl label="Example data" value={barCase} onChange={setBarCase} options={[{ value: 'complete', label: 'With a zero (U1)' }, { value: 'missing', label: 'With missing data (R3.2)' }]} />
              <SegmentedControl label="Data point type" value={barType} onChange={v => setBarType(v as 'outcome' | 'factor')} options={[{ value: 'outcome', label: 'Health outcome' }, { value: 'factor', label: 'Vulnerability factor' }]} />
              <Toggle label="Standard error" checked={barSE} onChange={setBarSE} />
              <Toggle label="Denominator differs from default" checked={ownDenominator} onChange={setOwnDenominator} />
              <Toggle label="Sub-national, Pathways Survey" checked={subNational} onChange={setSubNational} />
            </Controls>
            <ChartCard
              title="No ANC visit"
              chartKey={<AverageKey />}
              notice={subNational ? SURVEY_NOTICE : undefined}
              defaultSample={DEFAULT_SAMPLE}
              denominator={ownDenominator ? 'Women aged 15–49 with a live birth in the last 3 years' : DEFAULT_SAMPLE}
              description="Woman did not receive any antenatal care visit for her most recent birth."
              onDownload={() => {}}
            >
              <BarChart data={barData} average={1.8} showStandardError={barSE} colour={barType} />
            </ChartCard>
          </Section>

          <Section id="stacked" title="Stacked bar chart" importName="ChartCard, StackedBarChart"
            use={<>How each segment splits across the categories of one data point. Categories take categorical colours 1, 2, 3… in order. Click a legend item to isolate it as a bar chart. R3.2 shows a not applicable bar.</>}>
            <ChartCard
              title="Age at first birth"
              defaultSample={DEFAULT_SAMPLE}
              denominator="Women aged 15–49 who have ever given birth. Those with no births are shown separately."
              description="The age at which women had their first child."
            >
              <StackedBarChart categories={FIRST_BIRTH.categories} data={FIRST_BIRTH.data} average={FIRST_BIRTH.average} />
            </ChartCard>
          </Section>

          <Section id="data-point" title="Data point bar" importName="DataPointBar"
            use={<>One segment's value for each data point, against the sample average (dashed marker). Used on segment profiles. Missing data shows "N/A" and an empty dashed track.</>}>
            <Controls>
              <Toggle label="Standard error" checked={profileSE} onChange={setProfileSE} />
            </Controls>
            <div className="charts-page__panel">
              <h3 className="charts-page__panel-title">Rural 4: key data points</h3>
              <div className="charts-page__points">
                {PROFILE_POINTS.map(p => <DataPointBar key={p.label} {...p} showStandardError={profileSE} />)}
              </div>
              <p className="charts-page__panel-key"><span className="chart-key-item"><span className="charts-page__marker" />Sample average</span></p>
            </div>
          </Section>

          <Section id="box" title="Box plot" importName="ChartCard, BoxPlot"
            use={<>How spread out values are within each segment, for numbers such as ages or counts. The purple Sample box is the benchmark. Always add the help link: many users haven't read a box plot before.</>}>
            <ChartCard
              title="Partner age"
              help={<>The box shows the middle 50% of values and the line inside it is the median. The dot is the mean. Whiskers show the range, excluding outliers. Compare each box with the purple Sample box.</>}
              defaultSample={DEFAULT_SAMPLE}
              denominator="Women aged 15–49 who are currently in a union"
              description="Age of woman's husband or partner, as reported by the woman."
            >
              <BoxPlot data={PARTNER_AGE.data} sample={PARTNER_AGE.sample} yLabel="Years" />
            </ChartCard>
          </Section>

          <Section id="breakdown" title="Segment breakdown bar" importName="SegmentBreakdownBar"
            use={<>Which segments make up each area's population. Segments use their vulnerability colour; the thin band above shows the urban and rural share. Neighbouring segments with the same level get a texture. Filtering to urban or rural rescales to 100%.</>}>
            <Controls>
              <SegmentedControl label="Population type" value={filter} onChange={v => setFilter(v as PopulationFilter)} options={[{ value: 'both', label: 'Both' }, { value: 'urban', label: 'Urban' }, { value: 'rural', label: 'Rural' }]} />
            </Controls>
            <div className="charts-page__panel">
              <SegmentBreakdownBar areas={AREAS} filter={filter} />
            </div>
          </Section>

          <Section id="pie" title="Pie chart" importName="SegmentPie, SegmentLegend"
            use={<>The same breakdown for one area at a time, with the urban and rural share as an outer ring. Small slices are labelled outside. Show several pies side by side with one shared legend.</>}>
            <div className="charts-page__panel">
              <div className="charts-page__pies">
                {AREAS.map(a => <SegmentPie key={a.name} area={a} filter={filter} />)}
              </div>
              <SegmentLegend codes={['U4', 'U2.1', 'U2.2', 'U1', 'R4', 'R3.1', 'R3.2', 'R2'].filter(c => filter === 'both' || (filter === 'urban') === c.startsWith('U'))} />
            </div>
            <p className="charts-page__note">The population type filter above controls these pies too.</p>
          </Section>

          <Section id="colour" title="Colour and texture" use="What each colour means. Colour carries meaning, so never pick one by taste.">
            <div className="charts-page__swatches">
              <div className="charts-page__swatch-group">
                <h3>Single series</h3>
                <span className="chart-key-item"><span className="charts-page__chip" style={{ background: 'var(--data-categorical-1)' }} />Health outcomes and behaviours (categorical 1)</span>
                <span className="chart-key-item"><span className="charts-page__chip" style={{ background: 'var(--data-categorical-6)' }} />Vulnerability factors (categorical 6)</span>
              </div>
              <div className="charts-page__swatch-group">
                <h3>Stacked bar categories, in order</h3>
                <div className="charts-page__chip-row">
                  {Array.from({ length: 10 }, (_, i) => <span key={i} className="charts-page__chip charts-page__chip--numbered" style={{ background: `var(--data-categorical-${i + 1})` }}>{i + 1}</span>)}
                </div>
              </div>
              <div className="charts-page__swatch-group">
                <h3>Segments: vulnerability level, then texture for neighbours that share a level</h3>
                <SegmentLegend codes={['U2.1', 'U2.2', 'U2.3', 'R3.1', 'R3.2', 'R3.3']} />
              </div>
            </div>
          </Section>

        </main>

        <aside className="components-page__aside">
          <AnchorNav links={sections.map(([id, label]) => ({ id, label }))} />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
