# Data visualisation

Which chart to use and how to draw it. Source of truth: Figma [MUI for Pathways](https://www.figma.com/design/aHM114L0PSvgiAl29fkXSD/MUI-for-Pathways?node-id=415-13576) (pages "Zeroheight – Foundations" and "Zeroheight – Charts") and Zeroheight [Chart types](https://pathways.zeroheight.com/styleguide/s/102143/p/12a009). Production charts are in Storybook → Charts. Data structures are in [data-model.md](data-model.md).

## Choosing a chart

Each chart shows **one data point**. Use **Recharts**; don't add another chart library.

| Chart | Use when the question is… | Prototype |
|---|---|---|
| Bar | How do segments compare on one data point? | `ChartViewerPanel` (`chartType: 'bar'`) |
| Stacked bar | How does each segment split across the categories of one data point? | `ChartViewerPanel` (`chartType: 'stacked'`) |
| Data point bars | How does one segment do on one data point? (profiles) | `KeyDataPoints`, `AllDataPoints` |
| Box plot | How spread out are values within each segment? | not built ([PlotChart](https://storybook.withpathways.org/?path=/docs/components-charts-plotchart--docs)) |
| Segment bar / pie | Which segments make up each admin area? | Kenya overview (partial) |
| Prevalence map | Where is a segment most prevalent? | `PrevalenceMap` |

## Rules for every chart

1. **Same segment order everywhere:** R1, R3.1, R3.2, R4, U1, U2.1, U2.2, U4 (rural then urban, by level). A segment keeps its slot even with no data.
2. **Title and plain-language description**, so the chart still makes sense when downloaded.
3. **Show who was asked** under the chart, with a "Denominator:" label.
4. **Value label on every bar**, so no axis is needed.
5. **Missing data is never zero.** No data: keep the slot, dashed outline, neutral fill, label "N/A". A real zero: empty slot labelled "0%".
6. **Benchmark:** bar charts and data point bars show the **sample average** as a dashed line with its value in a dark chip. Stacked bars add an **Average** bar after a dashed divider. Box plots show the **sample median** as its own box.
7. **Standard error** only when the user turns on the "Standard error" toggle.

## Colour

| Use | Token |
|---|---|
| Single series, and health outcomes and behaviours | `--data-categorical-1` |
| Vulnerability factors | `--data-categorical-6` |
| Rural / urban | `--segment-rural`, `--segment-urban` |
| Stacked bar categories | `--data-categorical-1`, `-2`, `-3`… **in order**, never picked by taste |
| Segment fills (segment bar, pie, map) | `--vulnerability-*` for the segment's level, never categorical |

- Each categorical colour has a main, darkened and light tone. Main and light tones fail contrast on white, so **value labels and outlines use the darkened tone**. Some darkened tones pass for lines but not text: check the contrast table in Figma before putting text in a data colour.
- If two neighbouring segments share a level (and so a colour), texture the second one, in this order: none, diagonal, grid, horizontal, vertical. Use textures only for this.

## Chart text

All chart text uses `--text-tertiary`, so the data stays the focus.

| Role | Style |
|---|---|
| Chart title | Inter 18px, 600 |
| Description | Inter 16px, 400 |
| Legend label, denominator | Inter 14px (label 600, text 400) |
| Axis label (segment codes) | Inter 12px, 500 |
| Helper hint ("Click a category in the legend above to isolate it") | Inter 12px, 600 |

## Interaction

- **Stacked bar legend:** clicking a category isolates it as a bar chart, so segments compare from the same baseline.
- **Box plots** get a "Help me understand this chart" link.
- **Sub-national charts from a Pathways Survey segmentation** show a dismissible warning that state or county results are estimates. DHS-based segmentations don't.
- **Download:** every chart exports to PNG, PDF or XLSX (`src/utils/exportCards.ts`).

## Known gaps in the prototype

- The benchmark field is called `medianLine` in `src/types/chartData.ts` but holds the sample average.
- Segment order in `chartData.ts` doesn't match the order above. Fix it when replacing data.
- Standard errors are fake (hashed from the segment name in `ChartViewerPanel.tsx`).
- N/A slots and textures aren't built yet.
