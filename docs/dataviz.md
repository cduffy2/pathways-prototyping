# Data visualisation

Which chart to use and how to draw it. Source of truth: the live site, Figma [MUI for Pathways](https://www.figma.com/design/aHM114L0PSvgiAl29fkXSD/MUI-for-Pathways?node-id=415-13576) (pages "Zeroheight – Foundations" and "Zeroheight – Charts") and Zeroheight [Chart types](https://pathways.zeroheight.com/styleguide/s/102143/p/12a009). Data structures are in [data-model.md](data-model.md).

## Use the chart kit

**Don't draw charts by hand.** `src/components/charts/` has every chart, built on Recharts, with the rules below built in. See each one live, with its states, at **`#charts`** (`src/pages/ChartsPage/`).

```tsx
import { ChartCard, BarChart, AverageKey } from '../../components/charts';

<ChartCard title="No ANC visit" chartKey={<AverageKey />} denominator={d.denominator} defaultSample={DEFAULT_SAMPLE} description={d.description}>
  <BarChart data={d.data} average={d.average} showStandardError={showSE} />
</ChartCard>
```

Wrap every chart in `ChartCard`. `DEFAULT_SAMPLE` lives in `src/data/segments.ts`. Don't add another chart library.

## Choosing a chart

Each chart shows **one data point**.

| Chart | Use when the question is… | Component |
|---|---|---|
| Bar | How do segments compare on one data point? | `BarChart` |
| Stacked bar | How does each segment split across the categories of one data point? | `StackedBarChart` |
| Data point bar | How does one segment do on one data point? (profiles) | `DataPointBar` |
| Box plot | How spread out are values within each segment? (ages, counts) | `BoxPlot` |
| Segment breakdown bar | Which segments make up each area's population? | `SegmentBreakdownBar` |
| Pie | The same, one area at a time | `SegmentPie` + `SegmentLegend` |
| Prevalence map | Where is a segment most prevalent? | `segment-profile/PrevalenceMap` (not in the kit yet) |

## Rules for every chart

1. **Same segment order everywhere.** Comparison charts (bar, stacked, box plot): rural then urban, each by code, e.g. R1, R3.1, R3.2, R4, U1, U2.1, U2.2, U4. Breakdown charts (segment bar, pie): urban then rural, each from most to least vulnerable, as on production. A segment keeps its slot even with no data.
2. **Title and plain-language description**, so the chart still makes sense when downloaded.
3. **Denominator** under the chart, with a "Denominator:" label, only when it differs from the segmentation's default sample population.
4. **Value label on every bar**, so no axis is needed.
5. **Missing data is never zero.** No data: keep the slot, dashed outline, neutral fill, "N/A" (pass `null`). A real zero: empty slot labelled "0%".
6. **Benchmark:** bar charts and data point bars show the **sample average** as a dashed line (bar charts put its value in a dark chip). Stacked bars add an **Average** bar after a dashed divider. Box plots end with a purple **Sample** box.
7. **Standard error** only when the user turns on the "Standard error" toggle, shown as "±1.2%" under the value.

## Colour

| Use | Token |
|---|---|
| Single series, and health outcomes and behaviours | `--data-categorical-1` |
| Vulnerability factors | `--data-categorical-6` |
| Urban / rural bands and rings | `--data-categorical-10` / `--data-categorical-7`, as on production (not `--segment-rural`) |
| Stacked bar categories | `--data-categorical-1`, `-2`, `-3`… **in order**, never picked by taste |
| Segment fills (segment bar, pie, map) | `--vulnerability-{level}-light` for the segment's level, never categorical |

- Each categorical colour has a main, darkened and light tone. **Text that sits on a data colour goes on the light tone**: all ten pass contrast there. Don't put text on the main or darkened tones.
- **Textures:** when a segment has the same level (so the same colour) as its neighbour, it gets the next texture in the order diagonal, grid, horizontal, vertical, counting across the whole chart. So U2.2 gets diagonal and R3.2 gets grid. Use textures only for this.

## Chart text

Chart titles use `--text-primary`. All other chart text uses `--text-tertiary`, so the data stays the focus.

| Role | Style |
|---|---|
| Chart title | Inter 18px, 600 |
| Description | Inter 16px, 400 |
| Legend label, denominator | Inter 14px (label 600, text 400) |
| Axis label (segment codes) | Inter 12px, 500 |
| Helper hint ("Click a category in the legend above to isolate it") | Inter 12px, 600 |

## Interaction

- **Hover:** every mark (bar, stacked segment, box, breakdown segment, pie slice, data point bar) darkens and gets a link-blue (`--text-link`) border, with a tooltip of its values. The kit does this through `src/components/charts/charts.css`; charts drawn any other way must match it.
- **Stacked bar legend:** clicking a category isolates it as a bar chart, so segments compare from the same baseline.
- **Box plots** get a "Help with understanding this chart" link (`ChartCard` `help`).
- **Breakdown charts** have a Both / Urban / Rural filter; urban or rural rescales to 100%. Tiny pie slices (under 3%) have no label; hover shows the value.
- **Sub-national charts from a Pathways Survey segmentation** show a warning that state or county results are estimates (`ChartCard` `notice`). DHS-based segmentations don't.
- **Download:** every chart exports to PNG, PDF or XLSX (`src/utils/exportCards.ts`).

## Known gaps in the prototype

- The benchmark field is called `medianLine` in `src/types/chartData.ts` but holds the sample average.
- Standard errors are illustrative (hashed from the segment name), not real.
- The Kenya overview and prevalence map pages still draw their segment breakdowns by hand. Swap in `SegmentBreakdownBar` and `SegmentPie` when you next touch them.
