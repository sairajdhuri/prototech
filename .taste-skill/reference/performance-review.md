# Lag investigation

Compared production builds in headless Chrome at 1440 and 390 CSS pixels, device pixel ratio 2, with 4× CPU throttling. Each scroll phase sampled 150 animation frames. Controls were selected three times each. Raw samples are in `performance-baseline.json`, `performance-after.json`, `controls-baseline.json`, and `controls-after.json`.

Measured bottlenecks:

- PCB animation replaced identical status text on every update, triggering roughly one layout per frame.
- Variance shadow maps and their blur passes were unnecessarily large during continuous PCB scrolling.
- Board selection performed a server navigation for local UI state.
- Board and machinery images waited for outgoing animations before mounting the new selection.

Fixes: update status text only when its label changes; halve shadow-map dimensions and blur samples while retaining the same blur extent; use Next.js-supported native history updates for board selection; mount selected previews immediately with a short entrance animation. Existing materials, artwork, assembly behavior, navigation, and logo are retained.

| Local measurement | Before | After |
| --- | ---: | ---: |
| Desktop PCB median frame interval | 26.6 ms | 13.4 ms |
| Desktop PCB p95 frame interval | 40.1 ms | 26.7 ms |
| Desktop PCB frames over 25 ms | 94 / 149 | 23 / 149 |
| Desktop PCB layouts | 156 | 16 |
| Mobile PCB frames over 25 ms | 56 / 149 | 13 / 149 |
| Mobile PCB layouts | 155 | 12 |
| Board selection to new preview DOM | 278–394 ms | 29–60 ms |
| Machinery selection to new caption DOM | 303–312 ms | 15–54 ms |

Production build, ESLint, and 11 focused browser regressions passed. A new regression verifies local board selection without an RSC navigation, preservation of other query parameters, and selection persistence on reload. Gallery keyboard behavior, quote prefill, navigation, reduced motion, PCB animation/reversal/remounting, current fallback artwork, and mobile placement remain covered.

Desktop and mobile screenshots were opened and reviewed. Navigation markup matches the saved baseline. The local samples demonstrate an improvement; physical-phone GPU performance was not measured.
