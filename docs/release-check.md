# Release check — 15 October 2026

Preview deployment is ready. Public launch needs production email configuration and the outstanding checks below. Hosting configuration was not available for inspection; missing local variables do not establish whether the hosting account already has them.

## Passed

- ESLint, standalone TypeScript check, and optimized Next.js production build.
- All 12 unit/server tests, including validation, attachments, provider failure, request size, origin checks, and rate limiting. Email provider responses are mocked.
- All 21 browser tests against `next start`, using installed Chrome. Coverage includes all main routes, unique titles/canonicals, layouts at 360/390/768/1440/1920 pixels, navigation and keyboard focus, board selection/reload/quote prefill, gallery deep links, forms, reduced motion, PCB assembly/reversal/remounting, WebGL fallback, and current first-load artwork. The growing-copy mobile check also covers 320 pixels.
- Additional production smoke audit: 13 page visits across 11 routes, including reduced motion; 29 internal URLs resolved successfully; unknown route returned 404. No broken rendered images, missing image alt attributes, duplicate IDs, or uncaught browser errors were found. These are basic accessibility checks, not a complete WCAG audit.
- Security headers verified on rendered pages: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- Actual production endpoint responses: cross-origin request 403, unsupported content type 415, invalid form 422, valid enquiry without email configuration 503. Error responses used `Cache-Control: no-store`.
- Legacy redirects, sitemap, robots, and Open Graph image passed browser-suite checks.
- Installed top-level dependencies match their declared versions. A targeted source/public/script scan found no private-key markers or matching common credential patterns; this is not a comprehensive secret audit.

## Changes during this check

- Added Next.js 16's documented `data-scroll-behavior="smooth"` opt-in so route transitions can scroll instantly while in-page links retain smooth scrolling.
- Corrected the local board-selection regression to exclude Next.js link prefetch requests. The production trace confirmed both unexpected requests were prefetches, not selection navigations.
- Made the first-load poster test block a PCB texture as well as the development scene chunk, so it also exercises fallback behavior with production chunk names.

The final production build and complete browser suite passed after these changes. Earlier lag measurements and visual review are recorded in `../.taste-skill/reference/performance-review.md`.

## Before public launch

1. Configure `RESEND_API_KEY` and `MAIL_FROM` on the production host. Verify the sender domain in Resend. Set `MAIL_TO` explicitly to the intended recipient and `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain, then rebuild/redeploy. Only `.env.example` is present locally; the required sender/key are absent from the local environment.
2. Perform an authorized enquiry and quote delivery check on the deployed site, including an attachment. Verify receipt/provider delivery logs. No real email was sent during this audit.
3. For serverless or multiple application instances, configure both Upstash Redis variables. Confirm the hosting proxy sanitizes `X-Forwarded-For`; the default limiter is per instance.
4. Complete a dependency vulnerability scan from an environment with npm registry access. `npm audit --omit=dev --json` failed to reach the advisory endpoint here, so vulnerability status remains unknown.
5. Verify deployed HTTPS, final-domain redirects/canonicals, production secrets, and form behavior after deployment. Local tests cannot validate the hosting account or DNS.
6. Obtain content-owner sign-off for current company details, legal pages, and product imagery. The current product-photo manifest is empty; illustrations are labeled, and the README records original product photography as a launch prerequisite.

## Limits and artifacts

Testing used headless Chrome on Windows. Physical phones, Safari/Firefox, Lighthouse scores, and field Core Web Vitals were not measured. Chrome emitted one Three.js shader floating-point precision warning; compilation/rendering and PCB behavior tests passed.

Raw smoke results: `../.taste-skill/reference/release-audit.json`. Local smoke script: `../.taste-skill/reference/release-audit.mjs`; it requires email to be unconfigured to avoid sending a real message. Production browser config: `../.taste-skill/reference/playwright.release.ts`, using localhost port 3105.

Commands used:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run start -- --hostname 127.0.0.1 --port 3105
# In another terminal:
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
npx playwright test --config .taste-skill/reference/playwright.release.ts --timeout 90000
node .taste-skill/reference/release-audit.mjs
npm audit --omit=dev --json
```
