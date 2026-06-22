# AI_USAGE

An honest account of how AI was used while building the project.

## Tools

- **Claude Code** — the main driver: FSD architecture, component code, domain logic,
  SCSS styling, and configs.
- **`claude_design` MCP** — imported the reference design (`Crypto Markets.dc.html`). Design
  **tokens** (colours, spacing, radii, typography, gain/loss colours) were extracted into
  `shared/config/styles/tokens.scss`, then the layout was **rebuilt as FSD components** rather than
  pasted in as one monolithic blob.
- **Playwright MCP** — visual verification of each phase in the browser against real data
  (screenshots of the table, search, sort, freshness badge, empty state, modal, density).
- **Multi-agent review workflow** — after the data layer, an adversarial review was run
  (4 parallel dimensions: FSD boundaries, correctness, design fidelity, test coverage), with each
  finding independently verified.

## Purpose, and what was accepted / changed / rejected

**Accepted as-is:** the design token values and the formatting/geometry formulas — matched 1:1
against the source `.dc.html` (price tiers, compact magnitudes, sparkline points, area chart).

**Changed from a naive generation:**
- Instead of the monogram circles from the mock — **real CoinGecko logos** with a monogram-circle
  fallback.
- The data layer was reworked after review: a single `mapMarketEntries` (one mapping site for live
  and mock), corruption → a typed `parse` error instead of a raw `TypeError`; the `preferences`
  selectors were decoupled from `RootState` to remove an upward `entities → app` import and a cycle.
