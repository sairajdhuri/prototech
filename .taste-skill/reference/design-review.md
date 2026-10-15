# PCB reference restyle

The user-supplied `public/pcbref.png` provides the design direction. Its warm studio lighting, green and gold board, cream internal sheets, lighter typography, and blue follow-on section take priority over choosing a new direction.

The landing page keeps its real capabilities, board selector, quote links, original customer content, navigation, and company logo. Home-page palette changes are scoped under `.home-page`; header and brand source are untouched. No dependencies or external images were added.

The existing Three.js illustration now uses finer gold traces, etched surface detail, a wider board, aligned layers, studio reflections, cream cores with circuit detail, and softer lighting. Scrolling assembles the board on the right beside the blue chapter's copy. Reduced motion keeps the separated stack stationary. Static fallback and finished-board posters were rendered from the updated scene.

Visual checks at 1440, 768, 390, and 360 pixels confirm readable two-line headings, no horizontal overflow, and a visible board in both chapters. The navbar's markup was compared with the saved baseline. Screenshots in this directory were opened and reviewed. The board is still a stylized construction illustration; the reference has more photographic surface complexity.

Critique: design 7.5, usability 8, creativity 7, content 8. The main improvement over the previous page is a coherent material and lighting treatment. The remaining visual gap is photographic realism in the procedural circuitry.

The standard design inspector failed twice with `CDP timeout: Page.enable`. Browser-based screenshots and Playwright checks were used instead; no inspector pass is claimed.

Verification: production build, TypeScript, and ESLint passed. The eleven relevant browser checks passed across the initial run and targeted reruns. These cover five responsive widths, mobile navigation, quote prefill, reduced motion, scroll assembly and reversal, remounting, WebGL fallback, and mobile model placement. The initial 360-pixel test timed out while compiling routes; its rerun passed. A reduced-motion screenshot regression exposed an obsolete caption offset; removing that offset resolved it.
