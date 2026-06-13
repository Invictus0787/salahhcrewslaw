# [Firm Name] — Albany Injury Law Landing Page

A single-page, zero-dependency landing page for an Albany, Georgia personal-injury law firm. Designed to feel calm, confident, and rooted in place — with Ray Charles Plaza setting the mood in the hero and the Welcome-to-Albany sign anchoring the local-pride section further down.

All copy is intentionally **placeholder** (look for `[Firm Name]`, `(229) 000-0000`, `[Street Address]`, etc.). Swap these once the firm's brand details are finalized.

---

## Stack

- **Plain HTML / CSS / JS.** No framework, no build step, no bundler.
- One stylesheet (`styles.css`), one script (`script.js`), one document (`index.html`).
- ~5 KB of JavaScript (gz), ~12 KB of CSS (gz). First paint is effectively instant on a modern device.

This choice is deliberate: framework overhead would be measurable on the marketing-page scale, and a vanilla setup makes editing copy/colors trivial for a non-developer.

---

## File map

```
lawlandingpage/
├── index.html              ← markup (semantic, single-file)
├── styles.css              ← design tokens + every component
├── script.js               ← interactions (loader, parallax, counters, …)
├── assets/
│   ├── ray-charles-plaza.png    (hero backdrop)
│   └── welcome-to-albany.png    (rooted-in-Albany section)
└── README.md
```

---

## Run locally

Open `index.html` in a browser. That's it.

For best results (so that the fonts and module-style scripts cache properly), serve from a tiny local server:

```bash
# Python 3
python -m http.server 5173

# Node (one-time install)
npx serve .
```

Then visit `http://localhost:5173`.

---

## Design system (tokens)

All design values are CSS variables on `:root` in `styles.css`. Tune the brand by editing this block — every component will follow.

| Token            | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| `--bg`           | Page background (midnight navy)                  |
| `--accent`       | Primary accent — gold from Ray Charles Plaza tile|
| `--plum / --rust`| Sunset secondary accents                         |
| `--f-serif`      | Display type — Fraunces                          |
| `--f-sans`       | UI / body type — Inter                           |
| `--f-mono`       | Labels, eyebrows — JetBrains Mono                |
| `--pad / --max`  | Layout rhythm                                    |
| `--ease-out`     | Default motion curve                             |

---

## Sections (and what each is doing)

1. **Hero** — Albany backdrop (Ray Charles Plaza), darkened with a layered veil + film grain. The headline rotates the final word every 3 s. Mouse-parallax shifts the image subtly; scroll adds vertical parallax. Three animated stats sit on a hairline divider.
2. **The 25% Difference** — A custom bar comparison that visualizes industry-standard vs. firm rate. Bars animate in on scroll; numbers count up; the delta highlights the dollar difference.
3. **Practice Areas** — Six cards in a tight 3-column grid that share a single 1-px line system. Each card has a cursor-tracked spotlight and a small 3-D tilt on hover.
4. **Process** — A vertical, numbered timeline with a glowing dot that lights as you scroll past it.
5. **Rooted in Albany** — The Welcome-to-Albany sign, treated like a portrait inside a thin gold-toned frame, beside a definitions list (office, hours, service area).
6. **Voices** — A serif-quote carousel that auto-advances, pauses on hover, and has accessible dot navigation.
7. **Contact** — A two-column panel: contact info (phone / email / address) and a 2×2 form with floating labels, animated focus lines, and a client-side success state.
8. **Footer** — Brand block + three columns + legal disclaimer.

---

## Interactions (`script.js`)

| Module                  | Notes                                                                  |
| ----------------------- | ---------------------------------------------------------------------- |
| Curtain loader          | Tiny stripe + monogram while document loads; lifts on `window load`.   |
| Custom cursor           | Ring + dot, `mix-blend-mode: difference`. Fine-pointer only.           |
| Magnetic elements       | Any element with `data-magnetic` drifts toward the cursor.             |
| Card tilt + spotlight   | Any element with `data-tilt` gets perspective rotation + radial glow.  |
| Reveal-on-scroll        | `IntersectionObserver` adds `.is-in` to anything with `data-reveal`.   |
| Counter animation       | `data-count`, with optional `data-prefix` / `data-suffix`. Eased.      |
| Hero parallax           | Mouse + scroll. `requestAnimationFrame`-driven, single transform.      |
| Word rotator            | Hero headline final word cycles every 3 s, width-locked to widest.     |
| Quotes carousel         | Auto-advance every 5.5 s, pauses on hover, click to jump.              |
| Active nav indicator    | `IntersectionObserver` highlights current section in the top nav.      |
| Form submit             | Client-only success state — wire to your back-end / form service.      |

All motion respects `prefers-reduced-motion: reduce`. The custom cursor is hidden on touch devices and reduced-motion users.

---

## What to swap before going live

- [ ] Firm name (`[Firm Name]` appears in nav, hero, footer, etc.)
- [ ] Phone number (`(229) 000-0000`)
- [ ] Email (`hello@[firmname].law`)
- [ ] Street address
- [ ] Year established
- [ ] Real client quotes in the **Voices** section (or remove if not yet permitted by your jurisdiction's ad rules)
- [ ] Bar-association disclosures in the footer if required
- [ ] Wire the `<form id="contactForm">` submit to a form service (Formspree, Basin, or your back-end). Right now it shows a friendly local "Got it" state and disables the inputs.
- [ ] Add `og:image`, `og:title`, `og:description` and a favicon when brand assets exist.

---

## Performance notes

- The hero backdrop is `preload`-hinted with `fetchpriority="high"`, so it starts downloading before the parser reaches the `<img>` tag.
- Fonts are pulled from Google Fonts with `preconnect`. If long-term performance matters, self-host them and `font-display: swap` them.
- Animations use compositor-only properties (`transform`, `opacity`) and `requestAnimationFrame`. Nothing reads/writes layout in the scroll loop.
- The grain texture is an inline SVG turbulence filter (no extra request).

---

## Accessibility

- Landmark elements (`<header>`, `<main>`, `<footer>`, labelled `<section>`s).
- Visible focus ring via `:focus-visible`.
- Form labels are real `<label>`s tied to inputs (floating-label style with `:placeholder-shown`).
- Motion is gated by `prefers-reduced-motion`.
- The custom cursor only enables on `pointer: fine`.
- Color contrast: body text ≥ 7:1 on the dark surface, accent gold ≥ 4.5:1 on dark.
