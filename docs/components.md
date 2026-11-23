# Components

What already exists, when to use it, and its production equivalent. Source of truth: [Storybook](https://storybook.withpathways.org/) and Figma [MUI for Pathways](https://www.figma.com/design/aHM114L0PSvgiAl29fkXSD/MUI-for-Pathways) (one page per component).

**Before building anything:**
1. Check Storybook. If production has it, match its look and behaviour.
2. Check this list. If the prototype has it, reuse or extend it.
3. Only then build something new, and add it here.

Components are plain React + CSS, one folder each, with BEM class names.

## Layout

| Component | Use |
|---|---|
| `layout/PrimaryNavBar` | Top nav on every page (`currentPage`, `onNavigate`). Includes the Segmentations dropdown, search trigger and mobile menu. |
| `layout/LeftSidebar` | Sidebar on segmentation tool pages: geography, tools and segment profile links with level badges. |
| `layout/Footer` | Footer on every page. |
| `layout/GlobalSearch` | ⌘K search dialog, opened from the nav. |

## Common

| Component | Use |
|---|---|
| `common/Checkbox` | Controlled checkbox (`checked`, `onChange`). Safe inside a clickable row. |
| `common/MobileNotice` | "Limited mobile experience" notice for desktop-only tools. Place straight after `PrimaryNavBar`. |
| `common/AboutThisContent` | "About this content" disclosure (sources, technical notes) on overview and profile pages. |

### Buttons

Not a shared component yet. Copy the class pattern and match Storybook [Button](https://storybook.withpathways.org/?path=/story/components-buttons-button--default).

| Style | When | Look | Example class |
|---|---|---|---|
| Primary dark | The one main action in a view | `--neutral-700` fill, white text, 6px radius | `.data-browser-page__dark-btn` |
| Outlined | Secondary actions, filters, menus | White fill, `--neutral-200` border | `.page-header__actions-trigger` |
| Soft | Low-emphasis actions in cards | `--neutral-200` fill, arrow icon | `.resources-page__explainer-btn` |
| Link | Navigating to more content | `--text-link`, 600 weight, arrow icon | `.news-page__read-more` |

## Data tools

| Component | Use |
|---|---|
| `data-browser/PageHeader` | Tool header: title, description, Download/Compare, standard-error toggle, health area chips. Collapses to an **Actions ⋮** menu below 900px. |
| `data-browser/DataCategoryPanel` | Searchable indicator list by category and subcategory, with checkboxes to pick indicators. |
| `data-browser/ChartViewerPanel` | One indicator as a bar or stacked bar chart. See [dataviz.md](dataviz.md). |
| `data-browser/PopulationSegmentsAlt` | Segment overview (size, level, urban/rural) on the overview page. Use this, not the older `PopulationSegments`. |
| `data-browser/*Modal` | Data source, source data, technical notes and urban/rural definition modals. |
| `compare-segments/AddDataModal` | Pick indicators to add to a comparison. |

## Segment profile

| Component | Use |
|---|---|
| `segment-profile/SegmentHeader` | Segment name, level chip and size. |
| `segment-profile/AnchorNav` | In-page section nav on long profiles. |
| `segment-profile/KeyDataPoints`, `AllDataPoints` | One segment's values against the sample average. |
| `segment-profile/DetailedDemographics` | Demographic breakdown. |
| `segment-profile/PrevalenceMap` | Map of where a segment is most prevalent. |
| `segment-profile/WalkInHerShoes` | Narrative persona section. |
| `segment-profile/ExportFlowModal` | Export a profile or charts as PNG, PDF or XLSX. |

## In Storybook, not built here yet

Match the story before building: [Explainer card](https://storybook.withpathways.org/?path=/story/components-cards-explainer-card--default), [Geography card](https://storybook.withpathways.org/?path=/story/components-cards-geography-card--default), [Legend](https://storybook.withpathways.org/?path=/story/components-legend--vulnerability-levels), [GenericDropdown](https://storybook.withpathways.org/?path=/story/components-genericdropdown--uncontrolled), [GenericTooltip](https://storybook.withpathways.org/?path=/story/components-generictooltip--default), [Tooltip term](https://storybook.withpathways.org/?path=/story/components-tooltip-term--default), [ButtonGroupTabs](https://storybook.withpathways.org/?path=/story/components-buttongrouptabs--default), [PieChart](https://storybook.withpathways.org/?path=/docs/components-charts-piechart--docs), [PlotChart](https://storybook.withpathways.org/?path=/docs/components-charts-plotchart--docs).

## Patterns inside pages

Hero band with wave (`NewsPage`, `ResourcesPage`), newsletter CTA (`.welcome-newsletter`), article card, filters menu and pagination (`NewsPage.tsx`), tag pill (`.news-page__tag`). Extract into `common/` if you reuse one.
