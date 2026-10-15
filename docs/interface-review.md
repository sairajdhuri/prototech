# Interface review

Reviewed against the [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), fetched on 14 October 2026.

## src/components/header.tsx

Pass: semantic navigation, current-page state, skip link, named menu controls, Escape, modal focus containment and working route changes.

## src/components/gallery.tsx

Pass: real buttons, image descriptions, modal focus containment, previous/next controls, arrow keys, Escape, focus restoration and deep-link state.

## src/components/enquiry-form.tsx

Pass: labelled controls, appropriate input types, autocomplete, first-error focus, inline errors, live feedback, a loading state, file removal and unsaved-change warnings. Delivery is never presented as successful without a provider acceptance ID.

## src/components/reveal.tsx

Pass: transform/opacity motion, reduced-motion handling and visible initial content. The hero image animation ends in four seconds.

## src/app/globals.css

Pass: visible focus, readable body text, responsive grid layouts, intentional touch handling, modal overscroll containment, reduced motion, theme colour compatibility and safe-area handling.

## src/app/layout.tsx and route metadata

Pass: language, semantic landmarks, structured data, descriptive per-route metadata, canonicals, social images and a CDN preconnect. Next Image reserves image space through explicit dimensions or sized parent containers.

## Resolved findings

- `src/components/header.tsx:32`: closing the mobile menu in `onClick` interrupted navigation. Close through `onNavigate`.
- `src/components/dialog-focus.ts:3`: explicitly wrap focus between the first and last modal controls.
- `src/app/globals.css:230`: constrain customer grids with `minmax(0, 1fr)` to prevent phone overflow.
- `src/components/media.tsx:12`: retain readable content while checking external images; do not render failed image elements.
- `src/app/api/submissions/route.ts:17`: account for the browser-facing Host origin when Next uses an internal hostname.

The design uses sentence case as required by design-taste-frontend. Fixed published engineering specifications retain the source’s notation; no locale-sensitive price calculator or date display was introduced. Machinery hover previews are temporary; the board selector and gallery image are shareable URL state.

This is a code and browser review, not a complete accessibility certification. Original company image delivery and live email delivery still require external access and configuration. Lighthouse was not run.

## Brand revision - 15 October 2026

Reviewed updated header, logo media, machinery catalogue and gallery against the current Web Interface Guidelines. Supplied logos have reserved dimensions and descriptive alternatives; the decorative company mark accompanies the visible wordmark. Native dialog keyboard and focus handling is retained. Motion uses transform/opacity and respects reduced motion globally and in imperative menu animation. Customer assets render locally without a download manifest. No new form or backend behavior was introduced.
