# Design Specification: hits.sh Analytics Dashboard

## 1. Design Direction & Philosophy

- **Mode**: Operate (Developer Dashboard & Badge Studio)
- **Aesthetic**: Minimalist, Developer-Oriented, Clean, Restrained Precision (Linear / GitHub / Vercel style)
- **Principles**:
  1. **Truth in Data**: Never synthesize or extrapolate false metrics. Highlight real-time daily, weekly, monthly, and lifetime numbers directly from the API.
  2. **Dual-Theme First-Class Citizenship**: Seamless Light / Dark modes powered by semantic design tokens and user preference persistence with system fallback.
  3. **High Information Density with Visual Breathing Room**: Replace bulky empty cards with well-aligned grids, crisp borders, and subtle typographic hierarchy.
  4. **Responsive Resilience**: Flawless experience across 375px (mobile), 768px (tablet), and 1440px+ (desktop) without text collisions or horizontal scroll blowout.

---

## 2. Design Tokens & Palette

### 2.1 Color System

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `bg-app` | `#F8FAFC` (Slate-50) | `#0B0F19` / `#0F172A` (Slate-950) | Full page background |
| `bg-surface` | `#FFFFFF` (White) | `#1E293B` (Slate-800) | Primary cards, panels, dropdowns |
| `bg-surface-subtle` | `#F1F5F9` (Slate-100) | `#0F172A` (Slate-900) | Code blocks, inputs, sub-containers |
| `border-primary` | `#E2E8F0` (Slate-200) | `rgba(255, 255, 255, 0.08)` | Card borders, dividers |
| `border-focus` | `#3B82F6` (Blue-500) | `#60A5FA` (Blue-400) | Focus rings, active inputs |
| `text-primary` | `#0F172A` (Slate-900) | `#F8FAFC` (Slate-50) | Headlines, primary numbers |
| `text-secondary` | `#475569` (Slate-600) | `#94A3B8` (Slate-400) | Card labels, subtitles, table headers |
| `text-muted` | `#94A3B8` (Slate-400) | `#64748B` (Slate-500) | Helper text, secondary badges, hints |
| `accent-primary` | `#2563EB` (Blue-600) | `#3B82F6` (Blue-500) | Primary actions, branding accents |
| `accent-emerald` | `#10B981` (Emerald-500) | `#34D399` (Emerald-400) | Positive stats, copy success feedback |

### 2.2 Typography
- **Font Stack**:
  - UI / Body: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - Code / Numbers / Urn: `ui-monospace, "SF Mono", "Cascadia Code", "Roboto Mono", Menlo, Consolas, monospace`
- **Scale**:
  - Hero Urn: `text-2xl sm:text-3xl font-bold tracking-tight`
  - Key Metrics: `text-3xl sm:text-4xl font-extrabold tracking-tight font-mono`
  - Section Headings: `text-base font-semibold tracking-tight`
  - Body: `text-sm leading-relaxed`
  - Captions / Meta: `text-xs font-medium`

### 2.3 Shapes, Shadows & Motion
- **Corner Radius**:
  - Cards: `rounded-xl` (12px)
  - Inputs & Buttons: `rounded-lg` (8px)
  - Badges & Pills: `rounded-full`
- **Shadows**:
  - Light mode: `shadow-sm` (`0 1px 2px 0 rgb(0 0 0 / 0.05)`)
  - Dark mode: `shadow-none` with subtle border contrast (`border-white/10`)
- **Transitions**:
  - Duration: `150ms ~ 200ms ease-out`
  - Respects `@media (prefers-reduced-motion: reduce)`

---

## 3. Structural Layout & Component Specifications

### 3.1 Global Header
- **Branding**: Official Hits SVG logo + subtle `Analytics` badge.
- **Context Pill**: Displays target name (e.g., `github.com/OrdoAbChao7`) with an external link icon directly pointing to the user's GitHub profile.
- **Theme Switcher**: One-click toggle between Light and Dark mode with icon feedback (Sun / Moon) and `localStorage` persistence.
- **Navigation Links**: Clean text links (About, Docs, Showcase, Changelog, FAQ) + Mobile hamburger drawer.

### 3.2 Target Hero & Breadcrumb
- Breadcrumb with domain icon (GitHub octocat / generic globe).
- Monospace URN display with easy "Copy Link" button.
- "Visit Target" button for instant jump to `https://{urn}`.

### 3.3 Core Metrics Grid (4 Key Metric Cards)
1. **Total Hits** (`total`): Cumulative all-time views.
2. **Monthly Hits** (`monthly`): Rolling 30-day view count.
3. **Weekly Hits** (`weekly`): Rolling 7-day view count.
4. **Today's Hits** (`today`): Extracted accurately from `items[].data` where `day === today`. If today has no hits yet, displays `0` cleanly.
- *Bonus Stat*: "Peak Daily Hits" (highest hits recorded in a single day, computed from actual dataset).
- *Strict Rule*: No fake percentages, no fabricated growth rates, no invented unique visitors.

### 3.4 Visit Trends & Activity Visualization
- **Dual Visual Modes**:
  1. **Daily Activity Bar Chart (Recent 14 / 30 Days)**:
     - Clear daily bars showing hits per day.
     - Hover tooltip showing exact date (`YYYY-MM-DD`) and hit count.
     - Clean baseline and date labels.
     - Full responsiveness across all screen sizes.
  2. **Yearly Heatmap (GitHub Contribution Style)**:
     - Responsive container with horizontal scroll handling on mobile to prevent squishing.
     - Light/Dark theme color palette (Light: `#ebedf0` to `#216e39`/`#2563eb`; Dark: `#161b22` to `#39d353`/`#38bdf8`).
     - Tooltips styled to match the active theme.

### 3.5 Badge Studio & Embed Code Generator
- **Real-Time Live Preview**:
  - High-visibility preview box showing the rendered SVG badge.
  - Clicking the badge navigates to the target page.
  - Option to open the direct SVG link in a new tab.
- **Configurator Panel**:
  - **View Type**: `total` / `today-total`
  - **Style**: `flat`, `flat-square`, `for-the-badge`, `plastic`
  - **Label**: Custom label text (default: `hits`)
  - **Extra Count**: Initial offset count
  - **Color & Label Color**: Accessible preset swatches + hex input + ColorPicker popup that adapts to light/dark themes
  - **Logo**: Simple-icons slug or base64 icon support
- **Embed Code Tabs & Copy Cards**:
  - Markdown, HTML, and Direct Image URL.
  - Syntax-highlighted code container with clear copy button and accessible "Copied!" notification.

### 3.6 States & Feedback
- **Loading State**: Clean skeleton shimmer cards for stats and charts while fetching `/api/urns/...`.
- **Empty State**: Friendly illustration/message if a target has no recorded hits yet, prompting the user to embed the badge.
- **Error State**: Informative error card with retry button if API fails.
- **Accessibility**: Keyboard navigable, proper ARIA attributes, semantic HTML.
