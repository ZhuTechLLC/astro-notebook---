# Case 01 Real Evidence Snapshot v1

**As-of:** 2026-10-02 completed U.S. session  
**Authority:** research and simulation comparison only; no causal, trading, sizing, or execution authority.

## Observed structure

The synchronized universe is SPY, QQQ, NVDA, AMD, AVGO, MU, AMAT, and LRCX. All price series use the same 21 completed sessions from 2026-09-03 through 2026-10-02.

| Observation | Value |
|---|---:|
| Semiconductor equal-weight return, 1D | +1.63% |
| Positive breadth, 1D | 5 / 6 |
| Excess vs SPY, 1D | +0.89 pp |
| Equal-weight return, 5D | +4.34% |
| Excess vs SPY, 5D | +4.56 pp |
| Equal-weight return, 20D | +15.94% |
| Excess vs SPY, 20D | +16.39 pp |
| Excess vs QQQ, 20D | +11.49 pp |
| First common-mode share, 20 daily returns | 68.30% |

The common-mode estimate is evidence of common movement only. It is not a Crowding measure.

## Cross-sectional dispersion

| Asset | 20D return | Excess vs theme |
|---|---:|---:|
| AMD | +38.97% | +23.03 pp |
| AMAT | +23.89% | +7.95 pp |
| LRCX | +18.74% | +2.80 pp |
| MU | +12.18% | -3.75 pp |
| NVDA | +2.41% | -13.53 pp |
| AVGO | -0.57% | -16.50 pp |

The useful compressed description is:

\[
\text{strong common theme structure}
+
\text{large stock-level dispersion}
+
\text{leadership rotation}
\]

This is more informative than “semiconductors all rose together.”

## Micron event path

Micron released FY2026 Q4 results after the 2026-09-30 session. The frozen price path is:

\[
Sep30
\rightarrow
Oct1\ (+3.03\%)
\rightarrow
Oct2\ (-2.05\%)
\]

The event is useful precisely because strong operating evidence did not produce a monotonic price path. Business strength, expectation revision, and stock return are separate objects.

## Evidence governance

The build also exposes backend gaps:

- AVGO has a primary IR release while the current TRQuant structured fundamentals packet is unavailable.
- MU structured evidence still exposes FY2026 Q3 while a newer FY2026 Q4 primary release exists.
- LRCX structured evidence is annual while the primary event evidence used here is quarterly.
- current-only structured evidence is not historical PIT evidence.

Event-driven research therefore needs both structured facts and primary event/guidance evidence.

## Mechanism status

Observed:

- market/theme/stock decomposition;
- 1D/5D/20D path persistence;
- breadth;
- dispersion;
- common-mode movement.

Unresolved:

- theme information repricing: no synchronized revision panel or price-implied expectation reconstruction;
- common theme flow: no theme ETF flow, signed flow, or OFI;
- trend feedback: no return-to-future-flow evidence;
- liquidity amplification: no depth, spread, or impact-per-unit-flow evidence;
- leader propagation: no event-aligned intraday lead-lag plus identified economic channel.

Missing evidence remains UNKNOWN rather than being filled by narrative.

## Comparison boundary

The real snapshot can be compared with the deterministic simulator on path persistence, breadth, dispersion, and market/theme/stock decomposition.

It cannot yet be compared on permanent reference-anchor contribution, exogenous-flow share, participant mix, post-flow recovery time, or model network contribution.

Case 01 now has three distinct layers: a deep research contract, a deterministic counterfactual engine, and a synchronized real evidence snapshot.
