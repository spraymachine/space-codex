# Space Portfolio — Design Spec

**Author:** Mani Dodla
**Date:** 2026-04-11
**Status:** Approved

---

## 1. Overview

A space-themed portfolio website that takes the visitor on a cinematic scroll-driven voyage through the solar system. Each planet maps to a portfolio section. The site delivers an awe-inspiring, "how did he do this" experience while being mobile-first and performance-optimized.

**Name:** Mani Dodla
**Content status:** All content is placeholder except the name. Real projects, bio, testimonials, and resume to be added later.

### Core Concept

The visitor loads into Earth orbit. As they scroll, they leave Earth behind and travel outward through the solar system. Each planet is a section of the portfolio. The sun grows smaller behind them. They end at Neptune — the edge of the solar system — where the Contact section lives, like sending a signal into deep space.

---

## 2. Planet-to-Section Mapping

| Planet | Section | Why It Fits |
|--------|---------|-------------|
| **Earth** | Hero / Intro | Home — where the visitor starts |
| **Mars** | About Me | The red planet — personal, explorer energy |
| **Jupiter** | Skills | Biggest planet — breadth of abilities |
| **Saturn** | Projects (6-10) | Rings = projects orbiting around core work |
| **Uranus** | Testimonials | Distant but impactful — others' voices |
| **Neptune** | Contact + Resume | The edge — sending a signal into the void |

---

## 3. Architecture

### 3.1 Approach: Hybrid Canvas + DOM

The page is primarily DOM-based (HTML/CSS sections with GSAP scroll animations). Key "wow" moments use a Three.js canvas overlay — specifically the Big Bang intro, the continuous planet voyage, and the interactive Saturn orbit. The rest (About, Skills, Testimonials, Contact) is beautifully animated DOM content with cosmic CSS effects (gradients, glassmorphism, particles) that look great but render fast.

### 3.2 Tech Stack

- **React 19 + Vite** — fast dev, fast builds
- **React Three Fiber + Drei** — 3D planets and space scene (code-split, lazy-loaded)
- **GSAP + ScrollTrigger** — scroll-driven camera movement and DOM animations
- **Lenis** — smooth scroll
- **Tailwind CSS v4** — styling
- **Custom GLSL shaders** — planet atmospheres, sun glow, starfield, nebula backgrounds
- **detect-gpu** — GPU tier classification (~2KB)

### 3.3 Component Architecture

```
App
├── ExperienceSelector          ← route: / (picks Space, Max, Min)
├── SpaceExperience             ← route: /space
│   ├── SpaceCanvas (fixed)     ← R3F canvas, renders planets + stars + sun
│   │   ├── Starfield           ← instanced mesh, tiered star count
│   │   ├── Sun                 ← emissive sphere + bloom (mid/high tier)
│   │   ├── PlanetSystem        ← Earth, Mars, Jupiter, Saturn, Uranus, Neptune
│   │   └── CameraRig           ← scroll-driven camera position via GSAP
│   │
│   ├── DOMOverlay (scrollable) ← HTML content layered over the canvas
│   │   ├── HeroSection         ← "Mani Dodla" + subtitle, Earth visible behind
│   │   ├── AboutSection        ← Mars zone — bio, photo, story
│   │   ├── SkillsSection       ← Jupiter zone — tech stack, proficiencies
│   │   ├── ProjectsSection     ← Saturn zone — interactive orbit
│   │   ├── TestimonialsSection ← Uranus zone — quote cards
│   │   └── ContactSection      ← Neptune zone — form + resume download
│   │
│   └── SpaceAudioToggle       ← optional ambient space sound (off by default)
│
├── MaximalistExperience        ← future (route: /max)
└── MinimalistExperience        ← future (route: /min)
```

### 3.4 File Structure

```
src/
├── App.jsx                      ← router: /, /space, /max, /min
├── components/
│   ├── ExperienceSelector.jsx
│   └── shared/                  ← components used across all experiences
│       ├── GlassCard.jsx
│       ├── SkillPill.jsx
│       └── ContactForm.jsx
├── experiences/
│   ├── space/                   ← self-contained space experience
│   │   ├── SpaceExperience.jsx
│   │   ├── canvas/              ← all R3F/3D code
│   │   │   ├── SpaceCanvas.jsx
│   │   │   ├── CameraRig.jsx
│   │   │   ├── Starfield.jsx
│   │   │   ├── planets/
│   │   │   │   ├── Earth.jsx
│   │   │   │   ├── Mars.jsx
│   │   │   │   ├── Jupiter.jsx
│   │   │   │   ├── Saturn.jsx
│   │   │   │   ├── Uranus.jsx
│   │   │   │   └── Neptune.jsx
│   │   │   └── effects/
│   │   │       ├── BigBang.jsx
│   │   │       ├── SunGlow.jsx
│   │   │       └── NebulaFog.jsx
│   │   ├── sections/            ← DOM overlay sections
│   │   │   ├── HeroSection.jsx
│   │   │   ├── AboutSection.jsx
│   │   │   ├── SkillsSection.jsx
│   │   │   ├── ProjectsSection.jsx
│   │   │   ├── TestimonialsSection.jsx
│   │   │   └── ContactSection.jsx
│   │   ├── hooks/
│   │   │   ├── useScrollCamera.js
│   │   │   ├── useOrbitControls.js
│   │   │   └── useGpuTier.js
│   │   └── data/
│   │       └── projects.js      ← placeholder project data
│   ├── maximalist/              ← future, empty for now
│   └── minimalist/              ← future, empty for now
├── styles/
│   └── globals.css
└── utils/
    └── gpuDetect.js
```

### 3.5 Dev Mode Bypass

During development, the Experience Selector is bypassed to go straight to Space:

```jsx
const DEV_DEFAULT_EXPERIENCE = '/space'; // set to null when ready to show selector
```

---

## 4. The Voyage — Detailed Section Breakdown

### 4.0 Big Bang Intro (Pre-scroll, Time-based)

**Trigger:** First load only (once per session, tracked via `sessionStorage`). On reload within the same session, skip to a 1-second fade-in at Earth orbit.

**Duration:** 3-4 seconds total. A "Skip" button fades in after 1 second.

**Sequence:**
1. **0-0.5s:** Pure black. A single white point appears center screen, pulsing.
2. **0.5-1.5s:** The point detonates — particles/light rays blast outward radially. Screen floods with white/gold energy. Subtle camera shake.
3. **1.5-3s:** Energy dissipates, stars scatter into place, a warm glow coalesces into the Sun in the distance. Nebula wisps fade in.
4. **3-4s:** Camera settles at Earth orbit. Earth fades in. DOM content (name, subtitle) fades up. Scroll control activates.

**Implementation:** The Big Bang itself is a lightweight Canvas2D or CSS animation (not Three.js) to avoid loading the full 3D pipeline before it's needed. The R3F canvas lazy-loads during the Big Bang and is ready by the time it ends.

### 4.1 Earth Orbit — Hero (0-15% scroll)

- **3D:** Earth fills ~40% of the viewport, slowly rotating. Sun visible in the distance as a bright glow. Starfield everywhere.
- **DOM:** "Mani Dodla" in large type + "Web Developer" subtitle + subtle "scroll to explore" indicator. Text positioned to the side of Earth (not covering it).
- **Scroll behavior:** Camera pulls away from Earth. Earth shrinks behind you. Sun is at your back.
- **Mobile:** Earth slightly smaller, text centered above it. Single-column layout.

### 4.2 Mars — About Me (15-30% scroll)

- **3D:** Mars drifts into view, reddish surface rotating. Earth is a small dot behind you.
- **DOM:** Bio text, placeholder headshot, personal story. Content fades/slides in as Mars approaches. Styled with warm Mars-red accent colors.
- **Interactive moment:** Mars has subtle atmospheric glow. On hover/tap, rotates faster briefly.
- **Mobile:** Content stacks vertically. Mars visible at top of section, content below.

### 4.3 Jupiter — Skills (30-50% scroll)

- **3D:** Jupiter looms in — it's BIG. Great Red Spot visible. Subtle band animation on surface (shader-driven).
- **DOM:** Skill categories as cards/pills. Each skill group (Frontend, Backend, Tools, etc.) animates in with stagger. Proficiency shown via clean bar or dot indicators.
- **Interactive moment:** Hovering/tapping a skill category causes Jupiter's bands to shift color slightly toward that category's accent.
- **Mobile:** Skills in a scrollable grid. Jupiter large but positioned behind content with reduced opacity for readability.

### 4.4 Saturn — Projects (50-75% scroll) [CENTERPIECE]

**The "how did he do this" moment.**

1. **Scroll into Saturn zone:** Saturn grows from the distance. Its rings become visible — each ring segment is a glowing orb/node representing one of the 6-10 projects.

2. **Scroll pins (pauses):** When Saturn is centered, GSAP ScrollTrigger pins the page. Prompt appears: "Drag to orbit / Tap a project." DOM content fades to minimal HUD overlay.

3. **Orbit mode:** User drags (or swipes on mobile) to rotate camera around Saturn. Projects orbit at different radii and speeds. Each project node has:
   - A small glowing orb (color-coded by tech stack)
   - A floating label (project name) that fades in when facing camera

4. **Select a project:** Clicking/tapping a project node:
   - Camera smoothly zooms toward that node
   - Glassmorphism detail panel slides in (right on desktop, bottom on mobile)
   - Panel contains: project name, description, screenshot placeholder, tech stack pills, "View Live" + "GitHub" buttons
   - Rest of the ring dims slightly

5. **Close & continue:** Closing panel zooms camera back. User can explore more or scroll down to continue (unpins scroll).

**Mobile adaptations:**
- Orbit via swipe gesture (touch drag)
- Project nodes 50% larger for easier tap targets
- Detail panel is a bottom sheet (70vh) with drag handle
- 3-4 nodes visible at once (others fade in as you orbit)
- Haptic feedback on tap (if supported)

**Performance:**
- Saturn is a single sphere with ring shader (not individual geometry per ring)
- Project nodes are instanced sprites
- Orbit camera uses simple spherical coordinates — no physics engine
- Entire interactive system dormant when not in Saturn zone

### 4.5 Uranus — Testimonials (75-85% scroll)

- **3D:** Uranus with tilted axis and icy blue tone. Space feels darker, colder — fewer stars, deeper colors.
- **DOM:** Testimonial cards with quote marks, names, roles. Scroll-triggered reveal with stagger. Cool blue/teal accents.
- **Mobile:** Vertical stack of testimonial cards, swipeable.

### 4.6 Neptune — Contact + Resume (85-100% scroll)

- **3D:** Neptune, deep blue, at the edge of the solar system. Beyond it — void and distant stars.
- **DOM:** Contact form (name, email, message), resume download button, social links (GitHub, LinkedIn, etc.).
- **Interactive moment:** On form submit, a signal/beam animation shoots from Neptune into deep space.
- **Mobile:** Form fields stack vertically. Resume download prominent. Social links as icon row.

### 4.7 The Void — Footer (100% scroll)

Past Neptune, darkness. A small "Back to Earth" link that smooth-scrolls to top with a reverse warp animation.

---

## 5. Visual Design System

### 5.1 Color Palette

Each section's accent matches its planet. The palette shifts from warm (Sun/Earth/Mars) to cool (Uranus/Neptune) as you voyage outward — creating an unconscious sense of distance.

| Token | Hex | Usage |
|-------|-----|-------|
| `--void-black` | `#000000` | Base background |
| `--star-white` | `#E8F4F8` | Primary text |
| `--sun-gold` | `#FFD700` | Sun glow, accents, CTAs |
| `--earth-blue` | `#4B9CD3` | Hero section accent |
| `--mars-red` | `#C1440E` | About section accent |
| `--jupiter-amber` | `#C88B3A` | Skills section accent |
| `--saturn-gold` | `#EAD6A6` | Projects section accent |
| `--uranus-teal` | `#73C2BE` | Testimonials accent |
| `--neptune-blue` | `#3D5FC4` | Contact section accent |
| `--nebula-purple` | `#B794F6` | Subtle background glows |
| `--text-dim` | `rgba(232,244,248,0.5)` | Secondary text |

### 5.2 Typography

- **Headings:** Inter, 700-900 weight, tight letter-spacing
- **Body:** Inter, 400-500 weight, line-height 1.6
- **Monospace accents:** JetBrains Mono — labels, tags, small UI elements
- **Scale:** `clamp()` fluid typography throughout, mobile-first

### 5.3 Glass Card Style

```css
background: rgba(255, 255, 255, 0.03);
border: 1px solid rgba(255, 255, 255, 0.06);
backdrop-filter: blur(12px);
border-radius: 16px;
```

On hover: border brightens to section's planet accent, subtle inner glow appears.

### 5.4 Buttons

- **Primary (CTA):** Solid `--sun-gold` background, black text, pill shape, hover glow
- **Outline:** Transparent with subtle white border, pill shape
- **Ghost:** Text-only with underline-on-hover, monospace, gold accent

### 5.5 Skill Pills

Monospace text, pill-shaped, border matching category accent color (blue for frontend, purple for backend, teal for tools). Subtle hover lift.

### 5.6 Animation Philosophy

- Only animate `transform` and `opacity` — no layout-triggering properties
- `will-change` applied sparingly, removed after animation completes
- `prefers-reduced-motion`: disables Big Bang, disables planet rotation, scroll works but without 3D camera movement — content fades in statically

---

## 6. Performance Strategy (Mobile-First)

### 6.1 GPU Tier Detection

Using `detect-gpu` library (~2KB) on load to classify into 3 tiers:

| Tier | Criteria | Treatment |
|------|----------|-----------|
| **Low** | Integrated GPU, old phones, <4GB RAM | 2k stars, low-poly planets, no post-processing, no bloom, simpler shaders |
| **Mid** | Decent mobile, mid-range laptop | 4k stars, medium-poly planets, subtle bloom on sun only |
| **High** | Discrete GPU, modern desktop/laptop | 8k stars, detailed planets with atmosphere shaders, bloom + god rays on sun |

### 6.2 Performance Rules

- **Instanced meshes** for all stars (one draw call for thousands)
- **LOD (Level of Detail)** on planets — high-poly when close, low-poly when distant
- **Frustum culling** — don't render off-screen planets
- **DPR cap:** 1.0 low, 1.5 mid, 2.0 high (never device native on 3x screens)
- **Lazy-load R3F canvas** — Big Bang is Canvas2D/CSS, Three.js downloads during intro
- **Code-split per section** — Saturn orbit logic loads only when reaching Saturn
- **RAF throttling** — distant planets tick at 15fps instead of 60fps
- **Mobile defaults:** design for mobile first, enhance for desktop
- **Touch gestures:** swipe to orbit Saturn (not just mouse drag)

---

## 7. Experience Selector & Future-Proofing

### 7.1 Experience Selector (route: `/`)

- Three cards on dark background — Space is interactive, Max and Min show "Coming Soon"
- Space card has mini animated starfield preview
- Selection stored in `localStorage` for returning visitors
- Dev mode bypasses selector (`DEV_DEFAULT_EXPERIENCE = '/space'`)

### 7.2 Extensibility

Each experience is a self-contained folder under `src/experiences/`. Adding Maximalist or Minimalist later means creating their folder with their own components — no changes to Space code. Shared components (GlassCard, SkillPill, ContactForm) live in `src/components/shared/`.

---

## 8. Content Structure

All content is placeholder. Data lives in dedicated files for easy swapping:

**`src/experiences/space/data/projects.js`** — array of 6-10 project objects:
```js
{
  id: string,
  name: string,
  description: string,
  screenshot: string,     // path or URL
  techStack: string[],
  liveUrl: string,
  githubUrl: string,
  orbitRadius: number,    // position in Saturn's rings
  color: string,          // node glow color
}
```

**About, Testimonials, Social links** — similar data files with placeholder content.

---

## 9. Accessibility

- All DOM content is native HTML — selectable, screen-reader friendly
- ARIA labels on interactive 3D elements
- Keyboard navigation: Tab through sections, Enter to select projects in orbit mode
- `prefers-reduced-motion` respected throughout
- Skip link to main content
- Sufficient color contrast on all text (WCAG AA)
- Focus indicators on all interactive elements

---

## 10. Browser Support

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- iOS Safari 14+
- Chrome Android 90+

WebGL 2 required for 3D features. Fallback: static planet images + CSS animations if WebGL unavailable.
