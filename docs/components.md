# Components

What already exists, when to use it, and its production equivalent. Source of truth: [Storybook](https://storybook.withpathways.org/) and Figma [MUI for Pathways](https://www.figma.com/design/aHM114L0PSvgiAl29fkXSD/MUI-for-Pathways) (one page per component).

**Before building anything:**
1. Check Storybook. If production has it, match its look and behaviour.
2. Check the shared UI kit (below) and this list. If the prototype has it, reuse or extend it.
3. Only then build something new, and add it here.

Components are plain React + CSS, one folder each, with BEM class names.

## Shared UI kit

**Start here.** `src/components/ui/` holds the basic controls, already matching Figma. See every one live, with all its states, at **`#components`** (`src/pages/ComponentsPage/`).

```tsx
import { Button, Toggle, RadioCards, Modal } from '../../components/ui';
```

| Component | Use for |
|---|---|
| `Button` | Actions: `solid`, `outlined`, `soft`, `plain`; `loading` and `disabled` built in |
| `IconButton` | Close, pagination and carousel arrows (needs a `label`) |
| `Checkbox`, `CheckboxItem` | Multi-select; `CheckboxItem` is a full-width clickable row |
| `RadioGroup` | One choice from a few options, with optional hints |
| `RadioCards` | `row`: health area filter. `list`: options that need detail, e.g. data source |
| `SegmentedControl` | Switching views of the same data |
| `Toggle` | Optional layers such as "Standard error" |
| `Chip` | Tags, statuses, applied filters (`onRemove`) and vulnerability levels |
| `TextField` | `search` for filtering lists, `field` for forms (with `error`) |
| `Select` | One item from a set list |
| `Tooltip` | Explaining a term or number |
| `Tabs` | Sibling panels of content |
| `Accordion` | Grouping long lists |
| `Modal` | Focused tasks; full-screen sheet on phones |
| `Notice` | Data caveats and limitations |
| `EmptyState` | Nothing to show, or no search results |
| `Pagination` | Long lists of content |
| `AnchorNav` | "On this page" navigation for long pages, in a sticky right-hand column, with an optional action |

For charts, use the chart kit in `src/components/charts/` (live at `#charts`), described in [dataviz.md](dataviz.md).

Existing pages still use their own hand-written versions of some of these. Use the kit for anything new, and swap it in when you touch an old page.

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

### Checkboxes, radio buttons and toggles

| Control | Off | On | Reference |
|---|---|---|---|
| Checkbox | Outlined: white fill, `--neutral-400` border | Solid `--neutral-700` fill, white tick | `Checkbox` |
| Toggle | Outlined track, grey thumb | Solid `--neutral-700` track, white thumb | `Toggle` |
| Radio | Outlined ring | Ring stays outlined, with a `--text-primary` dot. Radios are never solid. | `RadioGroup` |

- "On" is always dark neutral, never blue.
- Hover goes one step darker (`--neutral-500` border off, `--neutral-800` fill on).
- Don't use the browser's default controls.

### Buttons

Use `Button` from the kit. The example classes show where older pages hand-built each style.

| Style | When | Look | Example class |
|---|---|---|---|
| Solid (primary dark) | The one main action in a view: Compare, Submit, Join the Pathways Community | `--neutral-700` fill, white text, 6px radius | `.data-browser-page__dark-btn` |
| Outlined | Secondary actions and anything that opens a menu: Filters, Actions | White fill, `--neutral-200` border | `.page-header__actions-trigger` |
| Soft | Card calls to action ("Explore") and page-header actions (Download, Share this view) | `--neutral-200` fill, arrow icon | `.resources-page__explainer-btn` |
| Plain / link | Low-emphasis text actions (Clear selection, Back) and links to more content | `--text-link`, 600 weight, arrow icon | `.news-page__read-more` |

## Which component where

Taken from the Figma feature files. Follow these before inventing a pattern.

| Need | Use | Example in Figma |
|---|---|---|
| Filter a whole view by health area (single choice) | Row of **radio cards**: icon + label, selected one gets a soft fill and dark border. First option is "All data". | Segment profile, Segmentation overview |
| Switch between views of the same data | **Outlined button group**, selected segment filled | "All segments / Rural 4 / Urban 4", "By vulnerability / By urban/rural / By size" |
| Turn an optional layer on or off | **Toggle** with a label on its left | "Standard error", "Statistical differences" |
| Pick several items from a long list | **Checkbox list items**, grouped in **plain accordions** by category, with a soft search input above | Data browser, Comparison tool |
| One choice from a few options in a modal | **Radio list**: radio, bold label, optional muted hint ("· best for…") | Export format |
| One choice where options need detail | **Radio cards** in a list, selected card gets a dark border; add a soft success chip for "Recommended" | Data source |
| Filter a list of content | Outlined "Filters" button → menu of checkboxes with "Clear" (outlined) and "Apply" (solid). Show applied filters as **soft chips** under the heading. On phones the menu is a full-screen sheet with stacked full-width buttons. | Blog |
| Act on a selection | Plain "Clear selection" + solid primary with a count: "Compare across segments (3) →" | All data points |
| Show what's selected | Panel titled "Selected data" with a "Clear all" link, an empty state ("No data selected") and a solid "Compare →" at the bottom | Comparison tool |
| Choose from a set list in a filter bar | **Outlined select** (TextField) | Prevalence map geography |
| Search | **Soft input** with a search icon | Data browser list, Comparison tool |
| Explain a term or number | Info icon with a **solid tooltip** | Data browser |
| Tag or status on a card or table row | **Soft chip** | Segmentation overview tables |
| Download or share from a tool | Plain or soft button with icon in the filter bar or page header | Prevalence map, Data browser |
| Close a modal or sheet | Plain icon button (✕) top right | All modals |
| Page through results | Plain icon-button arrows + number nav items, "…" for long ranges | Blog |
| Carousel | Outlined icon buttons | Welcome |
| No results | Illustration + one-line message | Data browser list, Comparison tool |
| Form | Labelled inputs, error text under the field ("Please enter a valid email address"), solid submit. Success: illustration, "Message sent", plain button. | Contact |
| Navigate a long page | `AnchorNav` ("On this page") in a sticky column on the right; the section in view is highlighted | Segment profile |
| Long article | Parent/child nav on the left, `AnchorNav` on the right (H2s only), attachment items at the end, captions with a thin left rule | Resource article |
| Hero band | Light beige band ending in the wave divider | Resources, Blog, Segmentations |

## Data tools

| Component | Use |
|---|---|
| `data-browser/PageHeader` | Tool header: title, description, Download/Compare, standard-error toggle, health area chips. Collapses to an **Actions ⋮** menu below 900px. |
| `data-browser/DataCategoryPanel` | Searchable indicator list by category and subcategory, with checkboxes to pick indicators. |
| `data-browser/ChartViewerPanel` | The data browser's chart panel. Uses the chart kit (`src/components/charts/`); see [dataviz.md](dataviz.md). |
| `data-browser/PopulationSegmentsAlt` | Segment overview (size, level, urban/rural) on the overview page. Use this, not the older `PopulationSegments`. |
| `data-browser/*Modal` | Data source, source data, technical notes and urban/rural definition modals. |
| `compare-segments/AddDataModal` | Pick indicators to add to a comparison. |

## Segment profile

| Component | Use |
|---|---|
| `segment-profile/SegmentHeader` | Segment name, level chip and size. |
| `segment-profile/KeyDataPoints`, `AllDataPoints` | One segment's values against the sample average. |
| `segment-profile/DetailedDemographics` | Demographic breakdown. |
| `segment-profile/PrevalenceMap` | Map of where a segment is most prevalent. |
| `segment-profile/WalkInHerShoes` | Narrative persona section. |
| `segment-profile/ExportFlowModal` | Export a profile or charts as PNG, PDF or XLSX. |

## In Storybook, not built here yet

Match the story before building: [Explainer card](https://storybook.withpathways.org/?path=/story/components-cards-explainer-card--default), [Geography card](https://storybook.withpathways.org/?path=/story/components-cards-geography-card--default), [Legend](https://storybook.withpathways.org/?path=/story/components-legend--vulnerability-levels).

## Patterns inside pages

Hero band with wave (`NewsPage`, `ResourcesPage`), newsletter CTA (`.welcome-newsletter`), article card, filters menu and pagination (`NewsPage.tsx`), tag pill (`.news-page__tag`). Extract into `common/` if you reuse one.
