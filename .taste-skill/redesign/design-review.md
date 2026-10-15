# Prototech homepage redesign

## Agreed direction

Light engineering studio; a travelling PCB; homepage and shared header/footer. The user's later clarification determines the signature motion: separated layers align and come together as the visitor scrolls, and reopen on reverse scrolling.

Direction: **The object, large**, seed **667557872**. The three initial alternatives favoured typographic posters; the direction was explicitly changed because the brief prioritises a clearly visible 3D product. The supplied video determines the light-to-dark transition and spatial movement. Brand blue and the existing company/customer assets are retained. Manrope is self-hosted, with its SIL Open Font License in `public/fonts/`.

Idea: Prototech's white company symbol travels with its PCB from separate copper and FR4 sheets to a single bonded board. The existing board selector remains the live interaction and carries the selected construction into the quote form.

## Content and argument

- The first screen introduces PCB manufacturing in Pune since 1999 and shows the construction at large scale.
- The moving stack explains alignment and bonding; the adjacent specifications reproduce existing capabilities.
- Existing published history, layer capability, electrical testing and material establish manufacturing scope.
- The introduction connects the customer's design with a physical board.
- The construction selector supports the visitor's next quote decision.
- Original equipment photographs substantiate the factory section.
- PCB close-ups show illustrative circuit detail; existing customer logos provide the customer list.
- The quote action and the light footer close the sequence.

No customers, testimonials, certification, pricing or production claims were invented. The six-sheet model is a construction illustration, not an exact fabrication stack-up. No sample business content requires confirmation.

## Assets and attribution

- Company symbol: existing `public/media/original/logo.webp`; its actual pixels are converted to white silkscreen in the canvas texture. No text substitute or newly invented logo.
- `pcb-stack-poster.png` and `pcb-finished-poster.png`: rendered from the actual Three.js scene, including its logo. These support WebGL fallback and the closing composition.
- Existing `pcb-detail.webp`, `pcb-artwork.webp`, and `pcb-edge.webp`: previously generated illustrative PCB artwork; retained and identified as illustrations.
- Four original company photographs were downloaded from the URLs already recorded in the repository: CNC drilling (`IMG_20220301_131936.jpg`), lamination (`IMG_20220301_175533.jpg`), flying probe testing (`IMG_20220302_133330.jpg`), and optical inspection (`1000146519.jpg`). Source: https://protomlb.in/machinery ; creator/rights holder: the company or its original photographer, not independently established. No open licence is asserted. Attribution remains on `/credits`.
- The six supplied customer logos are retained. No archive or stock pictures were introduced.
- The supplied logistics video is reference material only. A stock manufacturing clip was deliberately omitted: the interactive Three.js assembly is the moving product demonstration. The inspector's no-video warning is therefore an acknowledged exception.

## Visual review

ROUND 1

Seen in one second: a separated PCB with a white company symbol.

Idea: the actual branded object travels through its construction sequence.

Live thing: scroll to bond the stack; choose board construction and quote that selection.

Layout words by section: hero=large object / construction=opposite split / facts=figures / intro=image split / selector=interactive specimen / factory=index with preview / gallery=unequal close-ups / customers=logo field / quote=colour field / footer=large wordmark.

Top three problems and fixes:

1. The dark chapter caption crossed the specifications in the first desktop screenshot. Raise the caption while the dark chapter is active.
2. The hero scroll prompt crossed the travelling object at intermediate scroll positions, especially on phones. Put the phone prompt into document flow and fade it before the board reaches it.
3. The initial static fallback and closing image used the older unbranded board. Render matching posters from the actual new scene.

ROUND 2

Seen in one second: the branded six-sheet PCB, with the assembly story clear on both desktop and phone.

Scores: design 8.0 · usability 8.0 · creativity 7.5 · content 8.0 → overall 7.9, subject to the final inspector having no failures.

Remaining limitation: the illustration deliberately simplifies fabrication; company photography has the lighting and resolution of the original factory images. No unrelated stock footage has been added.

## Verification

Final results: production build and ESLint pass; all 12 unit tests and all 18 production browser tests pass. The final real-browser design inspection reports **0 failures and 1 acknowledged no-video warning** at 1440, 768 and 390 pixels. The final screenshots were visually reviewed. Final critique score: **7.9/10** (design 8.0, usability 8.0, creativity 7.5, content 8.0), with no failure cap.

Supporting visual artifacts are in this directory. The browser regression verifies assembly, reverse scrolling, horizontal travel, a single canvas after navigation, reduced motion, WebGL fallback, mobile composition, quote prefill, forms, gallery, SEO and responsive layouts at 360, 390, 768, 1440 and 1920 pixels. The animation uses GSAP's documented [ScrollTrigger scrub](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and [matchMedia lifecycle](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/).
