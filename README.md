# Prototech

A responsive Next.js website for Prototech, the PCB manufacturer in Narhe, Pune. Company content is based on the publicly accessible pages at [protomlb.in](https://protomlb.in), researched on 14 October 2026.

## Run locally

Requires Node.js 22.18 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production commands:

```sh
npm run build
npm start
```

## Email configuration

Copy `.env.example` to `.env.local`, then configure:

```dotenv
NEXT_PUBLIC_SITE_URL=https://protomlb.in
RESEND_API_KEY=your-server-side-key
MAIL_FROM=Prototech Website <website@your-verified-domain.in>
MAIL_TO=sales@protomlb.in
```

Verify the sending domain in [Resend](https://resend.com/docs/dashboard/domains/introduction), including its required DNS records. The app uses the [Resend email API](https://resend.com/docs/api-reference/emails/send-email) directly. Restart the server after configuring environment variables.

Without the key or sender, valid submissions return HTTP 503 and the UI explicitly says that the message has not been sent. A successful response requires an email acceptance ID. Acceptance does not guarantee delivery; monitor the provider’s delivery logs. No live email was sent during development.

Optional design files are sent as email attachments. No separate storage account is needed. Files are limited to 5 MB; ZIP, PDF, Gerber and drill files are accepted and validated by extension and signature. The endpoint bounds the entire request before parsing, checks origin, applies rate limits, and keeps credentials on the server.

The default limit is five attempts per 15 minutes per network address, per server instance. For multiple instances, configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Your hosting proxy must set and sanitise `X-Forwarded-For`. The distributed limiter fails closed when its service is unavailable.

## Original company assets

The supplied company logo and six customer logos in `public/media/original/` are used directly through `src/lib/assets.ts`, independently of the download manifest. The two SVG logos use their `.svg` versions because the supplied `.webp` copies contain SVG data. Machinery and product photographs still use the original company site when reachable. The machinery catalogue shows equipment specifications without repeated unavailable-image labels.

The brand palette uses blue and navy alongside green PCB imagery. Animations use Motion for React (formerly Framer Motion), with a global reduced-motion policy, scroll reveals, board and machinery previews, mobile menu entrance and gallery transitions.

Run this command with internet access:

```sh
npm run assets:sync
npm run build
```

The command downloads the original logo, twelve equipment photographs and six customer logos into `public/media/original/`. It also reads the original product gallery and saves discovered photographs. Successful downloads are recorded in `public/media/original-assets.json`; product photographs are recorded in `public/media/products.json`. Rebuild after syncing so the manifest and product gallery are included.

If the source gallery markup changes, the command reports that no photographs were discovered. Add verified original photographs to the local gallery manifest with `id`, `name`, and `image` properties; do not assign an unverified board type to a photograph.

The included green PCB macro artwork is generated editorial imagery. The green, blue and charcoal board drawings are technical illustrations. They are labelled and credited, and are never presented as photographs of Prototech products. See `/credits` and `docs/design-report.md`. Product photography remains a launch prerequisite.

## Pages and structure

All main routes are implemented: `/`, `/about`, `/capabilities`, `/machinery`, `/products`, `/customers`, `/contact`, `/quote`. Supporting routes include privacy, terms, image credits, sitemap, robots and Open Graph image.

Company information and manufacturing specifications are centralised in `src/lib/company.ts`. Shared validation lives in `src/lib/validation.ts`. The server submission endpoint is `src/app/api/submissions/route.ts`. Colour, typography and spacing tokens are in `src/app/globals.css`.

Interactive board selection updates the URL and prefills the quote form. The gallery supports deep links, keyboard navigation, Escape and focus restoration. Mobile navigation uses a modal dialog with keyboard focus containment. Forms provide inline errors, submission states and an unsaved-data warning. Motion respects reduced-motion preferences, and content remains readable without animation.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Browser tests require Chromium:

```sh
npx playwright install chromium
```

To use an existing installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable path. Tests cover routes, metadata, 360/390/768/1440/1920px layouts, navigation, board selection, lightboxes, form validation, unavailable email delivery and reduced motion. Server tests cover validation, file signatures, attachment forwarding, origin checks, request limits, rate limiting and provider responses; the email provider is mocked.

Lighthouse scores have not been measured. No analytics, CRM, account system, fabricated testimonials or certifications were added. Confirm the written privacy policy, legal terms, current company information, original images and live email delivery before publishing.
