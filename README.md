# Ashwin — Design × Development

A complete Next.js 14 App Router portfolio with TypeScript, Tailwind, Framer Motion and the requested `@studio-freight/lenis` package. All résumé content is in `src/data/profile.json`; the original PDF and supplied 10.005-second video are included in `public/`.

## Run locally

Use Node.js 22.18+ or 24 LTS.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4178. This dedicated port avoids service-worker caches from unrelated applications on port 3000.

```sh
npm run typecheck
npm run lint
npm test
npm run build:release
npm start -- --listen 4179
```

`build:release` validates the résumé data and local assets before producing `out/`. Deploy that folder to a static host. `npm start` serves the exported files, not a Next.js application server. Development and production use separate cache directories so a build will not disrupt the preview.

## Content provenance

Source: `public/ashwin-resume.pdf` (Ashwin Issac Shaji).

- All six professional roles and three academic milestones are included, newest first.
- Six Meta courses appear in the 3D professional-development gallery.
- Hero counters count documented roles, qualifications and courses. CGPA, coding-platform totals and project totals are absent from the résumé and are not invented.
- The résumé describes design, frontend and marketing experience, so the eyebrow reflects that identity rather than claiming full-stack/AI engineering.
- Selected work summarizes responsibilities at Techbox, Winnersoft and graphic-design roles. Illustrations are original CSS compositions, not screenshots or claims of named client projects.
- GitHub/live-demo fields are supported by `Projects.tsx`; links appear only when provided. The actual résumé lists Portfolio, LinkedIn and Behance, which are linked.
- No backend, database or cloud expertise is added without evidence. The skill taxonomy supports those groups when applicable.
- Course issue dates, certificate IDs and issuer-verification links are not provided. The inspection modal explicitly reports that fact. It computes a real SHA-256 digest of the displayed course record and labels it as a **record fingerprint**, not credential authenticity. Set `sha256` only to a digest of a real certificate file; set `verifiedAt` only after checking issuer evidence.
- "Open to opportunities" follows the requested portfolio brief. Location and willingness to relocate come from the résumé.

## Video engine

`src/components/CinematicVideo.tsx` loads `/video/portfolio-background.mp4` without autoplay or looping. Metadata initializes the paused video at zero. The RAF loop uses the requested 0.10 LERP and 0.001-second seek threshold, with guarded seeks and no readyState gate. The most recent cursor or scroll input maps across the full clip. Pointer events and a mousemove fallback support embedded browsers and hybrid devices. LERP advances on every RAF, while seeks are serialized until the previous frame decodes, preventing repeated seeks from starving the decoder. The 0.001-second threshold is compared to the actual video playhead. Pointer X/Y also control gentle 3D parallax and a red spotlight. There are static vignette/scanline overlays, animated SVG grain, and a 2px progress bar.

The motion control pauses video/parallax interaction. OS reduced-motion disables video movement, smooth scrolling, cursor animation, auto-spin and decorative CSS animation. Text remains usable if video loading fails. The included MP4 has been re-encoded from the original source using H.264 (`-g 1 -keyint_min 1 -crf 20 -preset veryfast -movflags +faststart`). All 240 video frames are independently decodable keyframes; the output is 7.54 MB at 1280 × 720 and 24 fps. For a replacement MP4, use H.264 and short keyframe intervals (ideally all-intra) plus fast-start metadata for responsive random seeking. Never overwrite the supplied source without retaining the original.

## Gallery and accessibility

`Certifications.tsx` uses the camera pull-back `translateZ(-R) rotateY(angle)` and `rotateY(i × step) translateZ(R)` cards. Radii are 480/380/275px. Backface culling and cosine visibility hide reverse faces. Pointer capture, recent movement samples, 0.945 inertia decay and 0.06°/frame idle spin use a single animation loop. Unchanged frames skip DOM writes.

Drag horizontally or use previous/next buttons and pagination. Select a side card to center it; select the centered card to inspect it. Arrow keys navigate the ring. Auto-spin pauses while a card has keyboard focus, while the modal is open and while the section is offscreen. The native dialog traps focus, supports Escape and returns focus on close. The gallery keeps `touch-action: pan-y` for vertical scrolling.

Navigation has a skip link, active-section pill and keyboard-operable mobile drawer. Timeline filters announce result counts. Contact inputs have persistent labels, required/email validation and character limits. Email copying reports success or gives a manual fallback.

## Contact behavior

The contact form opens a prefilled draft in the visitor's email application. It does not claim to send email, collect data on a server or rely on an unconfigured service. Visitors can also use the visible email, phone and social links. A transactional-email endpoint can be integrated separately if direct delivery is required.

## Deployment limitation

Next.js 14 and `@studio-freight/lenis` are retained to match the requested stack. Next.js 14 is end-of-life and its dependency audit reports vulnerabilities; this must not be represented as a fully supported production stack. The project intentionally exports static HTML/CSS/JS and contains no server actions, middleware or API routes. For a maintained public deployment, upgrade Next.js and its lint configuration to a supported, patched release, use the maintained `lenis` package, and rerun the checks. Do not deploy the Next.js 14 development server publicly.

Four Google Fonts load with `display=swap` from the App Router root layout; system fallbacks remain usable offline. Fonts are requested at browser runtime so the static build does not depend on Google connectivity. `@next/next/no-page-custom-font` is disabled because its Pages Router `_document` recommendation does not apply to this root-layout link setup.

Security release: https://vercel.com/changelog/next-js-may-2026-security-release


