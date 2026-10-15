# Design and delivery report

## Direction

**The specimen catalogue**, seed **1770032229**. The visual structure places a large statement beside a PCB mosaic, then moves through manufacturing evidence, an interactive board specimen, technical geometry, equipment, gallery, customers and a direct quote action.

Idea: **Prototech’s published 2–12 layer range and Pune equipment inventory become an engineering specimen catalogue.** The live feature selects an actual board construction, updates the URL and prefills a quote request.

Two formal redraws were made. The original docked-panel hero conflicted with the requested headline and sticky navigation; it was replaced with the statement-and-mosaic hero. The warm serif typography conflicted with the modern industrial brief; the second dealt pairing was a grotesk/serif system. External font downloads were unavailable, so the implementation uses a single local Arial/Helvetica family. Content uses five shared type roles, with a separate large footer wordmark.

The colour system uses the brief’s industrial green, charcoal and warm white. Copper was darkened for the keyboard-focus outline. The brief’s seven main navigation links take precedence over the skill’s shorter navigation preference.

## Visual review

These are self-assessment scores, not an independent Awwwards rating.

### ROUND 1

Seen in one second: a large green PCB macro and a manufacturing statement.

Idea: an engineering specimen catalogue of the company’s boards and equipment.

Live thing: board construction selection and quote prefill.

Layout words by section: hero=split mosaic / highlights=type row / introduction=statement / boards=interactive specimen / geometry=asymmetric field / machinery=preview index / products=uneven gallery / customers=names / contact=colour band / footer=wordmark.

Scores: design 6.0 · usability 7.0 · creativity 6.5 · content 6.0 → overall 6.4.

Caps applied: unresolved inspector failures cap the overall score at 6.0.

Top three problems:

1. Failed image elements and missing factory content appeared in the desktop sheets. Keep readable source-linked information visible while checking remote images.
2. Phone customer grids overflowed. Constrain tracks with `minmax(0, 1fr)` and remove conflicting image aspect-ratio minimums.
3. A long closing heading and redundant image caption interrupted the mobile hierarchy. Shorten the authored line breaks and remove the caption.

### ROUND 2

Seen in one second: the PCB artwork and headline hold the first screen.

Idea: an engineering specimen catalogue with specific board geometry and equipment.

Live thing: board construction selection and quote prefill.

Layout words by section: hero=split mosaic / highlights=type row / introduction=statement / boards=interactive specimen / geometry=asymmetric field / machinery=preview index / products=uneven gallery / customers=names / contact=colour band / footer=wordmark.

Scores: design 6.5 · usability 8.0 · creativity 6.5 · content 6.0 → overall 6.9.

Caps applied: missing original photography limits design and content confidence.

Top three problems:

1. Factory imagery remained unavailable in the desktop and phone sheets. Use an intentional green fallback with the verified equipment description and original-image link; downloading the photograph remains necessary.
2. Thirteen measured font sizes weakened consistency. Consolidate headings, statistics and statements into the shared token system.
3. Mobile menu dismissal interrupted a route change, and modal focus could leave the control loop. Use Next Link’s `onNavigate` and explicit first/last focus wrapping.

### ROUND 3

Seen in one second: the physical detail of the board, balanced against a short two-line headline.

Idea: published manufacturing detail becomes a navigable specimen catalogue.

Live thing: board selection updates a shareable URL and carries the choice into the RFQ form.

Layout words by section: hero=split mosaic / highlights=type row / introduction=statement / boards=interactive specimen / geometry=asymmetric field / machinery=preview index / products=uneven gallery / customers=names / contact=colour band / footer=wordmark.

Scores: design 6.5 · usability 8.5 · creativity 6.5 · content 6.0 → overall 7.1.

Caps applied: this remains a category-level concept with limited distinct imagery. Authentic factory and product photography is missing locally; the generated PCB artwork is reused in several crops. These scores intentionally do not treat the visual brief as fully satisfied.

Remaining three limitations:

1. Original product, machinery and logo assets need an unrestricted download. Run `npm run assets:sync` and rebuild. Genuine company photographs should replace the repeated artwork where appropriate.
2. The source did not provide a verified company film. The bounded four-second hero-image drift supplies the moving-picture layer; no stock factory film was substituted.
3. Typography uses the local system family because external fonts were unavailable. The layout is complete, but a licensed brand font can be considered once original brand assets are installed.

## Verification

- Next.js production build and `npm start` succeeded.
- TypeScript and ESLint passed.
- Twelve server/validation tests passed.
- Fifteen browser tests passed against the production server.
- Browser checks covered 360, 390, 768, 1440 and 1920px widths, all routes, metadata, original-route redirects, mobile focus/navigation, board selection, lightbox controls/deep links, form errors/success, RFQ dimensions, file removal and reduced motion.
- `design-taste-frontend` source lint passed with no failures or warnings.
- The real-browser inspector passed at 1440, 768 and 390px with no failures. One remaining warning concerns absent footage, defended above. Six sizes were measured on desktop: the five content roles plus the footer wordmark.
- Desktop, tablet and mobile screenshots were inspected directly. The review notes and source audit are in `docs/interface-review.md`.
- Email transport was mocked for successful delivery tests. No live email was sent. No Lighthouse scores were measured.

## Image provenance

Credits are accessible from every page through **Image credits** in the footer, at `/credits`. No third-party stock imagery or video was used.

### Included artwork

| Asset | Creator / origin | Use |
| --- | --- | --- |
| `pcb-artwork.png` and `pcb-artwork.webp` | OpenAI imagegen, generated for this project | Hero, about image and illustrative gallery |
| `pcb-detail.webp` | Crop of the same generated artwork | Hero mosaic and inline detail |
| `pcb-edge.webp` | Crop of the same generated artwork | Hero mosaic and product overview |
| `board-green.svg` | Project-created technical drawing | Double-sided construction selector and gallery |
| `board-black.svg` | Project-created technical drawing | Multilayer construction selector and gallery |
| `board-blue.svg` | Project-created technical drawing | Single-sided construction selector and gallery |

These are illustrations. They are not specific manufactured Prototech products or electrically validated designs. The generated source artifact is retained in the repository; no stock-image licence is asserted.

### Original assets referenced

The source does not identify individual photographers or designers, and provides no open licence. Rights must be confirmed with Prototech and the relevant mark owners. The assets are referenced for the authorised company redesign; they could not be downloaded in this execution environment.

| Description | Original file | Source page |
| --- | --- | --- |
| Prototech logo | `Capture (1).JPG` | [Capabilities header](https://protomlb.in/capabilities) |
| Pluritec Multistation CNC drilling | `IMG_20220301_131936.jpg` | [Machinery](https://protomlb.in/machinery) |
| Pluritec Minima drilling/routing | `IMG_20220301_180918-0001.jpg` | [Machinery](https://protomlb.in/machinery) |
| MANIA Speedy flying probe testing | `IMG_20220302_133330.jpg` | [Machinery](https://protomlb.in/machinery) |
| Local routing machine | `IMG_20220301_130230.jpg` | [Machinery](https://protomlb.in/machinery) |
| Lead-free HASL machine | `IMG_20220302_164206.jpg` | [Machinery](https://protomlb.in/machinery) |
| Anger lamination equipment | `IMG_20220301_175533.jpg` | [Machinery](https://protomlb.in/machinery) |
| Screen printing machine | `IMG_20220301_175548.jpg` | [Machinery](https://protomlb.in/machinery) |
| Semi-automatic screen printing | `IMG_20220301_173629.jpg` | [Machinery](https://protomlb.in/machinery) |
| Etching equipment | `IMG_20220302_151205-0001.jpg` | [Machinery](https://protomlb.in/machinery) |
| Developing equipment | `IMG_20220302_151402.jpg` | [Machinery](https://protomlb.in/machinery) |
| Brushing equipment | `PSX_20230221_142912.jpg` | [Machinery](https://protomlb.in/machinery) |
| Orbotech optical inspection | `1000146519.jpg` | [Machinery](https://protomlb.in/machinery) |
| Schneider Electric logo | `Img.gif` | [Customers](https://protomlb.in/our-customers) |
| BHEL logo | `CorporateFilm.png` | [Customers](https://protomlb.in/our-customers) |
| Uno Minda logo | `Minda-Industries-board-approves-acquisition-of.jpg` | [Customers](https://protomlb.in/our-customers) |
| Rishabh logo | `blob-4342900.png` | [Customers](https://protomlb.in/our-customers) |
| Star Engineers logo | `star_engineers_india_private_limited_logo.jpeg` | [Customers](https://protomlb.in/our-customers) |
| TATA Autocomp logo | `tata-autocomp-systems-launches-vrla-batteries.webp` | [Customers](https://protomlb.in/our-customers) |

Customer image crops preserve the coordinates used on the original customer page. Any photographs discovered by the sync command remain attributed to the [original product gallery](https://protomlb.in/our-products).

## Before launch

Configure Resend credentials and a verified sender, complete original asset sync, confirm live email acceptance/delivery, and review the written legal policy with the business. A shared Redis rate limiter is available for deployments with multiple server instances. No file-storage credential is required because uploads travel as email attachments.

No customer testimonial, certification, additional capacity, delivery guarantee or business statistic was invented. No sample proof needs replacement. The illustrations, original image availability and current legal/contact information need review before publication.

## Brand asset revision - 15 October 2026

Kept the specimen catalogue direction and mapped its palette roles onto the supplied blue company mark. Primary actions and the closing field use #141482; technical sections use #101a42. Green remains in PCB artwork. Header, mobile menu and footer now include the supplied mark. The six supplied customer logos render locally. BHEL and TATA AutoComp use navy grounds to preserve their white lettering; Schneider receives a CSS crop to account for padding inside its source. Rishabh and TATA use the supplied SVG versions because their WebP copies contain SVG data. No supplied file was overwritten.

Machinery copy now lists each function once, retains distinct models and spindle specifications, and removes generic descriptions and repeated local-manufacture labels. Unavailable photos do not create duplicate textual image panels. The customer endorsement disclaimer was removed as requested. Motion for React controls menu and gallery transitions alongside existing reveals and previews, under a global reduced-motion policy.

Visual round 1 found invisible white lettering on the TATA and BHEL logos; navy grounds resolved it. Review covers homepage, machinery, customers and the mobile menu at phone, tablet and desktop sizes. Machinery and product photos remain an external asset dependency.

Final production review: TypeScript, ESLint and build passed. Homepage, machinery and customers were inspected at 360, 390, 768 and 1440 pixels: no horizontal overflow, broken loaded images or browser runtime errors. All six local customer logos load. Mobile menu Escape, gallery arrows and reduced-motion rendering were checked. The real-browser design inspector reports 0 failures and 1 warning for absent footage; no authentic company clip was supplied. Automated test suites and Lighthouse were not rerun for this revision. Round 2 confirms readable logos, consistent blue fields, preserved navigation and shorter machinery copy. Design 7.5, usability 8.5, creativity 6.5, content 7: weighted self-assessment 7.55/10; missing authentic factory/product photos remains the largest visual limitation.

Final logo-row correction: the homepage transparent-media rule overrode navy grounds on the two white logos. Increased the existing selector specificity; both local images now load against rgb(16, 26, 66), confirmed in the browser and a section screenshot.

## Homepage motion revision - 15 October 2026

Added one-shot viewport counters for the hero layer count, founding year, layer range, electrical-testing percentage and three manufacturing dimensions. Decimal precision is preserved. Figure widths use the final value as a hidden measuring layer, avoiding movement of adjacent units. Screen readers and pages without JavaScript receive the published final values. Reduced-motion users see final figures without counting.

Kept the specimen catalogue direction. Hero detail images, product images and customer logos now arrive with staggered scale/opacity entrances. Machinery preview controls gain short hover and press feedback. Primary links use Motion press feedback; board controls, the CTA copy and footer receive distinct motion. Entrances play once, content is present before animation, and no new continuous loop was added.

Motion verification: TypeScript, ESLint, production build and source design lint passed. Browser samples at 360, 390, 768 and 1440 pixels showed intermediate counter values followed by exact final figures (1999, 2-12, 100%, 0.15, 0.25, 460). No browser errors or horizontal overflow occurred. Reduced-motion and JavaScript-disabled pages displayed final values immediately. Screenshots confirm unchanged figure sizes and adjacent unit alignment. The design inspector reports 0 failures and the existing no-footage warning; no authentic company clip is available. Final visual critique retains the specimen hierarchy, image proportions and mobile layout; score remains 7.55/10 with factory/product photography the main limitation. Automated test suites and Lighthouse were not rerun.

Visual correction: a later mobile caption rule reduced the counter glyphs to caption size. Scoped the counter inheritance rule to the highlight section; all animated figures now render at the intended 33.15px on a 390px phone, in the full ink colour. Confirmed with computed styles and a fresh section screenshot.

## PCB scroll revision � 15 October 2026

The reference video supplied in `public/videoref.mp4` informed the isometric hero, dark construction chapter and PCB extending over the closing quote panel. The existing blue brand and working quote/board-selection flows are retained.

The homepage now uses a procedurally built Three.js PCB, with GSAP ScrollTrigger controlling rotation, copper/FR4 separation and reassembly. Desktop uses a sticky scene; mobile hands the same scene from the hero to a space between the chapter copy and specifications. Graphics render on changes rather than through an endless animation loop. Resize observers, GSAP contexts, textures, geometry, materials and the WebGL context are released on unmount.

`public/media/pcb-isometric.webp` is a transparent 55 KB image captured from the same model. It supplies the no-JavaScript/no-WebGL fallback and the closing quote illustration. The model and layer stack are illustrations, not fabrication drawings or photographs of actual products. No new business claims, sample customers or external imagery were introduced.

The existing specimen-catalogue direction and seed 1770032229 were retained; the requested reference supplies the composition for the revised sections. Idea: Prototech's multilayer capability becomes a board visitors can look inside as they scroll. The board selector remains the interactive construction/quote feature.

Visual review at 360, 390, 768 and 1440 pixels found no horizontal overflow; all revised headings remain within two lines. The last mobile pass shortened an empty handoff and placed the model below the copy. Self-assessment: design 7.5, usability 8, creativity 7.5, content 8 (weighted 7.7); this is not an independent rating. The PCB uses deliberate flat materials and does not aim for photographic realism.

The production build, TypeScript and ESLint pass. Browser checks cover the existing board selector and quote prefill, layouts at 390/1440 pixels, scroll movement and reversal, return navigation with one canvas, reduced motion, WebGL failure, and mobile model placement. A separate browser sweep found no runtime page errors and confirmed the static fallback with JavaScript disabled.

HyperFrames was requested and its CLI skill was read. The CLI is not installed or cached; installation failed with network EACCES, and FFmpeg is absent. Consequently no HyperFrames project, Studio preview or video render was produced. The frontend design inspector also failed to start its CDP page session (`Page.enable` timeout); browser screenshots and direct DOM measurements supplied the visual review instead.
