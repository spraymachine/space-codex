# Space Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a space-themed portfolio that takes visitors on a cinematic scroll-driven voyage through the solar system, with each planet mapping to a portfolio section and an interactive Saturn orbit as the centerpiece.

**Architecture:** Hybrid Canvas + DOM approach — a fixed R3F canvas renders the 3D space scene (starfield, sun, planets) while DOM content scrolls over it. GSAP ScrollTrigger drives the 3D camera position based on scroll progress. The Big Bang intro is a lightweight Canvas2D animation that plays while Three.js lazy-loads. Saturn's interactive orbit mode pauses scroll and switches to pointer-driven camera control.

**Tech Stack:** React 19, Vite, React Three Fiber + Drei, GSAP + ScrollTrigger, Lenis, Tailwind CSS v4, custom GLSL shaders, detect-gpu

---

## File Structure

```
space/
├── index.html                              ← entry HTML, loads fonts
├── package.json                            ← dependencies & scripts
├── vite.config.js                          ← Vite config with React plugin
├── postcss.config.js                       ← PostCSS with Tailwind
├── eslint.config.js                        ← ESLint flat config
├── public/
│   └── resume-placeholder.pdf              ← placeholder resume
├── src/
│   ├── main.jsx                            ← React entry point
│   ├── App.jsx                             ← router with dev bypass
│   ├── hooks/
│   │   └── useRoute.js                     ← hash-based routing
│   ├── utils/
│   │   └── gpuDetect.js                    ← GPU tier detection wrapper
│   ├── styles/
│   │   └── globals.css                     ← CSS variables, Tailwind, base styles
│   ├── components/
│   │   ├── ExperienceSelector.jsx          ← landing page with 3 experience cards
│   │   └── shared/
│   │       ├── GlassCard.jsx               ← glassmorphism card component
│   │       ├── SkillPill.jsx               ← tech stack pill component
│   │       └── ContactForm.jsx             ← contact form with submit animation
│   └── experiences/
│       ├── space/
│       │   ├── SpaceExperience.jsx         ← orchestrator: canvas + DOM + scroll
│       │   ├── canvas/
│       │   │   ├── SpaceCanvas.jsx         ← R3F Canvas wrapper with lighting
│       │   │   ├── CameraRig.jsx           ← scroll-driven camera positions
│       │   │   ├── Starfield.jsx           ← instanced star mesh
│       │   │   ├── planets/
│       │   │   │   ├── BasePlanet.jsx      ← reusable planet sphere with atmosphere
│       │   │   │   ├── Earth.jsx           ← Earth with blue marble shader
│       │   │   │   ├── Mars.jsx            ← Mars with red surface
│       │   │   │   ├── Jupiter.jsx         ← Jupiter with band shader
│       │   │   │   ├── Saturn.jsx          ← Saturn with ring + project nodes
│       │   │   │   ├── Uranus.jsx          ← Uranus with tilted axis
│       │   │   │   └── Neptune.jsx         ← Neptune deep blue
│       │   │   └── effects/
│       │   │       ├── BigBang.jsx         ← Canvas2D intro animation
│       │   │       └── SunGlow.jsx         ← emissive sun with bloom
│       │   ├── sections/
│       │   │   ├── HeroSection.jsx         ← "Mani Dodla" + scroll prompt
│       │   │   ├── AboutSection.jsx        ← bio, headshot placeholder
│       │   │   ├── SkillsSection.jsx       ← skill categories with pills
│       │   │   ├── ProjectsSection.jsx     ← Saturn orbit HUD + detail panel
│       │   │   ├── TestimonialsSection.jsx ← quote cards
│       │   │   └── ContactSection.jsx      ← form + resume + socials
│       │   ├── hooks/
│       │   │   ├── useScrollCamera.js      ← GSAP ScrollTrigger camera sync
│       │   │   ├── useOrbitControls.js     ← drag/swipe orbit for Saturn
│       │   │   └── useGpuTier.js           ← React hook wrapping gpuDetect
│       │   └── data/
│       │       ├── projects.js             ← 8 placeholder projects
│       │       ├── skills.js               ← skill categories
│       │       ├── testimonials.js         ← 3 placeholder testimonials
│       │       └── about.js                ← bio + social links
│       ├── maximalist/
│       │   └── .gitkeep                    ← future
│       └── minimalist/
│           └── .gitkeep                    ← future
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.js`, `postcss.config.js`, `eslint.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/styles/globals.css`

- [ ] **Step 1: Initialize the project with Vite**

```bash
cd /Users/mani/Desktop/space
npm create vite@latest . -- --template react
```

Select "React" and "JavaScript" when prompted. This creates `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, and some defaults.

- [ ] **Step 2: Install all dependencies**

```bash
npm install react@^19 react-dom@^19 @react-three/fiber @react-three/drei @react-three/postprocessing three gsap @studio-freight/lenis detect-gpu
npm install -D tailwindcss@^4 @tailwindcss/postcss postcss autoprefixer @eslint/js eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals
```

- [ ] **Step 3: Configure PostCSS for Tailwind v4**

Replace `postcss.config.js`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 4: Write `index.html`**

Replace the Vite-generated `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mani Dodla — Web Developer</title>
    <meta name="description" content="Space-themed portfolio of Mani Dodla, web developer." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <style>
      /* Critical: prevent flash of unstyled content */
      html, body { margin: 0; padding: 0; background: #000; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Write `src/styles/globals.css`**

```css
@import "tailwindcss";

/* ── Design System Variables ── */
:root {
  --void-black: #000000;
  --star-white: #E8F4F8;
  --sun-gold: #FFD700;
  --earth-blue: #4B9CD3;
  --mars-red: #C1440E;
  --jupiter-amber: #C88B3A;
  --saturn-gold: #EAD6A6;
  --uranus-teal: #73C2BE;
  --neptune-blue: #3D5FC4;
  --nebula-purple: #B794F6;
  --text-dim: rgba(232, 244, 248, 0.5);
}

/* ── Base Reset ── */
* { margin: 0; padding: 0; box-sizing: border-box; }

html {
  scroll-behavior: auto; /* Lenis handles smooth scroll */
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--void-black);
  color: var(--star-white);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Typography utilities ── */
.font-mono {
  font-family: 'JetBrains Mono', monospace;
}

/* ── Glass card base ── */
.glass {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ── Scrollbar styling ── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(232, 244, 248, 0.1); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(232, 244, 248, 0.2); }
```

- [ ] **Step 6: Write `src/main.jsx`**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 7: Write `src/App.jsx` with dev bypass**

```jsx
import { lazy, Suspense } from 'react';
import { useRoute } from './hooks/useRoute';

const SpaceExperience = lazy(() => import('./experiences/space/SpaceExperience'));
const ExperienceSelector = lazy(() => import('./components/ExperienceSelector'));

// Dev bypass: set to '/space' to skip selector during development.
// Set to null when ready to show the experience selector.
const DEV_DEFAULT_EXPERIENCE = '/space';

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.7rem',
        letterSpacing: '0.3em',
        color: 'rgba(232,244,248,0.3)',
        textTransform: 'uppercase',
      }}>
        Loading...
      </p>
    </div>
  );
}

export default function App() {
  const { route, navigate } = useRoute();

  const effectiveRoute = route === '/' && DEV_DEFAULT_EXPERIENCE
    ? DEV_DEFAULT_EXPERIENCE
    : route;

  return (
    <Suspense fallback={<LoadingScreen />}>
      {effectiveRoute === '/space' && <SpaceExperience navigate={navigate} />}
      {effectiveRoute === '/' && <ExperienceSelector navigate={navigate} />}
    </Suspense>
  );
}
```

- [ ] **Step 8: Write `src/hooks/useRoute.js`**

```js
import { useState, useEffect, useCallback } from 'react';

export function useRoute() {
  const getHash = () => window.location.hash.replace('#', '') || '/';

  const [route, setRoute] = useState(getHash);

  useEffect(() => {
    const onHashChange = () => setRoute(getHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path;
  }, []);

  return { route, navigate };
}
```

- [ ] **Step 9: Create placeholder files for future experiences**

```bash
mkdir -p src/experiences/maximalist src/experiences/minimalist
touch src/experiences/maximalist/.gitkeep src/experiences/minimalist/.gitkeep
```

- [ ] **Step 10: Create placeholder ExperienceSelector**

Write `src/components/ExperienceSelector.jsx`:

```jsx
export default function ExperienceSelector({ navigate }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <button
        onClick={() => navigate('/space')}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8rem',
          letterSpacing: '0.2em',
          color: '#E8F4F8',
          background: 'transparent',
          border: '1px solid rgba(232,244,248,0.15)',
          padding: '1rem 2rem',
          borderRadius: '100px',
          cursor: 'pointer',
        }}
      >
        ENTER SPACE
      </button>
    </div>
  );
}
```

- [ ] **Step 11: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite starts on `http://localhost:5173`, page shows black screen (dev bypass goes to `/space` which doesn't exist yet — that's fine, just verify no crash). Hit Ctrl+C.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: project scaffolding — Vite + React + Tailwind + dependencies"
```

---

## Task 2: GPU Detection & Utility Layer

**Files:**
- Create: `src/utils/gpuDetect.js`, `src/experiences/space/hooks/useGpuTier.js`

- [ ] **Step 1: Write `src/utils/gpuDetect.js`**

This wraps `detect-gpu` and returns a tier object that the rest of the app uses:

```js
import { getGPUTier } from 'detect-gpu';

// Tiers: 0 = low, 1 = mid, 2 = high
// Each tier defines rendering quality parameters.
const TIER_CONFIG = {
  0: {
    tier: 'low',
    starCount: 2000,
    planetDetail: 16,       // sphere segments
    dpr: [1, 1],
    bloom: false,
    postProcessing: false,
    shaderComplexity: 'low',
  },
  1: {
    tier: 'mid',
    starCount: 4000,
    planetDetail: 32,
    dpr: [1, 1.5],
    bloom: true,
    postProcessing: false,
    shaderComplexity: 'mid',
  },
  2: {
    tier: 'high',
    starCount: 8000,
    planetDetail: 64,
    dpr: [1, 2],
    bloom: true,
    postProcessing: true,
    shaderComplexity: 'high',
  },
};

let cachedResult = null;

export async function detectGpuTier() {
  if (cachedResult) return cachedResult;

  try {
    const gpuTier = await getGPUTier();
    // detect-gpu returns tier 0-3, we map to 0-2
    const tier = Math.min(gpuTier.tier, 2);
    cachedResult = { ...TIER_CONFIG[tier], raw: gpuTier };
  } catch {
    // Fallback to low tier on error
    cachedResult = { ...TIER_CONFIG[0], raw: null };
  }

  return cachedResult;
}
```

- [ ] **Step 2: Write `src/experiences/space/hooks/useGpuTier.js`**

```js
import { useState, useEffect } from 'react';
import { detectGpuTier } from '../../../utils/gpuDetect';

const DEFAULT_TIER = {
  tier: 'low',
  starCount: 2000,
  planetDetail: 16,
  dpr: [1, 1],
  bloom: false,
  postProcessing: false,
  shaderComplexity: 'low',
};

export function useGpuTier() {
  const [config, setConfig] = useState(DEFAULT_TIER);

  useEffect(() => {
    detectGpuTier().then(setConfig);
  }, []);

  return config;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/utils/gpuDetect.js src/experiences/space/hooks/useGpuTier.js
git commit -m "feat: GPU tier detection with tiered rendering config"
```

---

## Task 3: Placeholder Data Files

**Files:**
- Create: `src/experiences/space/data/projects.js`, `src/experiences/space/data/skills.js`, `src/experiences/space/data/testimonials.js`, `src/experiences/space/data/about.js`

- [ ] **Step 1: Write `src/experiences/space/data/projects.js`**

```js
export const projects = [
  {
    id: 'project-1',
    name: 'Nebula Dashboard',
    description: 'A real-time analytics dashboard with live data visualization and WebSocket updates.',
    screenshot: null, // placeholder
    techStack: ['React', 'Node.js', 'D3.js', 'WebSocket'],
    liveUrl: '#',
    githubUrl: '#',
    orbitRadius: 1.0,
    color: '#4B9CD3',
  },
  {
    id: 'project-2',
    name: 'Stellar Commerce',
    description: 'Full-stack e-commerce platform with cart, checkout, and payment integration.',
    screenshot: null,
    techStack: ['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind'],
    liveUrl: '#',
    githubUrl: '#',
    orbitRadius: 1.3,
    color: '#C88B3A',
  },
  {
    id: 'project-3',
    name: 'Cosmos Chat',
    description: 'Real-time messaging app with rooms, file sharing, and end-to-end encryption.',
    screenshot: null,
    techStack: ['React', 'Socket.io', 'MongoDB', 'Express'],
    liveUrl: '#',
    githubUrl: '#',
    orbitRadius: 1.6,
    color: '#73C2BE',
  },
  {
    id: 'project-4',
    name: 'Orbit CMS',
    description: 'Headless CMS with visual editor, API generation, and multi-tenant support.',
    screenshot: null,
    techStack: ['Next.js', 'GraphQL', 'PostgreSQL', 'Docker'],
    liveUrl: '#',
    githubUrl: '#',
    orbitRadius: 1.1,
    color: '#B794F6',
  },
  {
    id: 'project-5',
    name: 'Pulsar Tasks',
    description: 'Project management tool with Kanban boards, time tracking, and team collaboration.',
    screenshot: null,
    techStack: ['React', 'Node.js', 'Redis', 'PostgreSQL'],
    liveUrl: '#',
    githubUrl: '#',
    orbitRadius: 1.4,
    color: '#FFD700',
  },
  {
    id: 'project-6',
    name: 'Quasar Auth',
    description: 'Authentication microservice with OAuth, MFA, and session management.',
    screenshot: null,
    techStack: ['Node.js', 'JWT', 'Redis', 'Docker'],
    liveUrl: '#',
    githubUrl: '#',
    orbitRadius: 1.7,
    color: '#C1440E',
  },
  {
    id: 'project-7',
    name: 'Nova Weather',
    description: 'Weather app with beautiful animations, 7-day forecast, and location search.',
    screenshot: null,
    techStack: ['React', 'OpenWeather API', 'Framer Motion'],
    liveUrl: '#',
    githubUrl: '#',
    orbitRadius: 1.2,
    color: '#3D5FC4',
  },
  {
    id: 'project-8',
    name: 'Void Notes',
    description: 'Markdown note-taking app with real-time sync, offline support, and collaboration.',
    screenshot: null,
    techStack: ['React', 'PouchDB', 'CouchDB', 'Tailwind'],
    liveUrl: '#',
    githubUrl: '#',
    orbitRadius: 1.5,
    color: '#EAD6A6',
  },
];
```

- [ ] **Step 2: Write `src/experiences/space/data/skills.js`**

```js
export const skillCategories = [
  {
    name: 'Frontend',
    accent: 'var(--earth-blue)',
    skills: [
      { name: 'React', level: 90 },
      { name: 'Next.js', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'Three.js', level: 75 },
      { name: 'GSAP', level: 80 },
    ],
  },
  {
    name: 'Backend',
    accent: 'var(--nebula-purple)',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 85 },
      { name: 'PostgreSQL', level: 75 },
      { name: 'MongoDB', level: 70 },
      { name: 'GraphQL', level: 65 },
    ],
  },
  {
    name: 'Tools & DevOps',
    accent: 'var(--uranus-teal)',
    skills: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 70 },
      { name: 'Figma', level: 75 },
      { name: 'Vercel', level: 85 },
      { name: 'CI/CD', level: 70 },
    ],
  },
];
```

- [ ] **Step 3: Write `src/experiences/space/data/testimonials.js`**

```js
export const testimonials = [
  {
    id: 'testimonial-1',
    quote: 'Working with Mani was like watching someone build a rocket in real time. He turned our vague ideas into a polished, performant product that exceeded every expectation.',
    name: 'Jane Doe',
    role: 'CTO, Placeholder Inc.',
  },
  {
    id: 'testimonial-2',
    quote: 'Mani has a rare ability to balance creative vision with technical execution. Our platform performance improved by 40% after his optimizations.',
    name: 'John Smith',
    role: 'Lead Engineer, Sample Corp.',
  },
  {
    id: 'testimonial-3',
    quote: 'The attention to detail in the UI was extraordinary. Every animation, every transition — it all felt intentional and polished.',
    name: 'Sarah Chen',
    role: 'Product Manager, Demo Labs',
  },
];
```

- [ ] **Step 4: Write `src/experiences/space/data/about.js`**

```js
export const about = {
  name: 'Mani Dodla',
  title: 'Web Developer',
  bio: 'I build digital experiences that push the boundaries of what\'s possible in the browser. With a passion for creative coding and performance optimization, I craft interfaces that are both visually stunning and buttery smooth.',
  photo: null, // placeholder — will be a path or URL
  resumeUrl: '/resume-placeholder.pdf',
  socials: [
    { platform: 'GitHub', url: '#', icon: 'github' },
    { platform: 'LinkedIn', url: '#', icon: 'linkedin' },
    { platform: 'Twitter', url: '#', icon: 'twitter' },
    { platform: 'Email', url: 'mailto:hello@manidodla.com', icon: 'mail' },
  ],
};
```

- [ ] **Step 5: Create placeholder resume**

```bash
mkdir -p public
echo "Placeholder resume" > public/resume-placeholder.pdf
```

- [ ] **Step 6: Commit**

```bash
git add src/experiences/space/data/ public/resume-placeholder.pdf
git commit -m "feat: add placeholder data files for projects, skills, testimonials, about"
```

---

## Task 4: Shared UI Components

**Files:**
- Create: `src/components/shared/GlassCard.jsx`, `src/components/shared/SkillPill.jsx`, `src/components/shared/ContactForm.jsx`

- [ ] **Step 1: Write `src/components/shared/GlassCard.jsx`**

```jsx
import { useState } from 'react';

export default function GlassCard({ children, accent, className = '', style = {} }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`glass ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 'clamp(1.25rem, 3vw, 1.75rem)',
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        borderColor: hovered && accent ? accent.replace(')', ', 0.2)').replace('rgb', 'rgba') : undefined,
        boxShadow: hovered && accent ? `0 8px 32px ${accent.replace(')', ', 0.08)').replace('rgb', 'rgba')}` : undefined,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/shared/SkillPill.jsx`**

```jsx
export default function SkillPill({ name, accent }) {
  return (
    <span
      className="font-mono"
      style={{
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        padding: '0.4rem 0.9rem',
        borderRadius: '100px',
        border: `1px solid ${accent || 'rgba(255,255,255,0.08)'}`,
        background: 'rgba(255,255,255,0.03)',
        color: accent || 'var(--star-white)',
        transition: 'all 0.3s ease',
        cursor: 'default',
        display: 'inline-block',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
      }}
    >
      {name}
    </span>
  );
}
```

- [ ] **Step 3: Write `src/components/shared/ContactForm.jsx`**

```jsx
import { useState, useCallback } from 'react';

export default function ContactForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setStatus('sending');
    // Placeholder: simulate send
    setTimeout(() => {
      setStatus('sent');
      onSubmitSuccess?.();
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  }, [onSubmitSuccess]);

  const inputStyle = {
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: 'var(--star-white)',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  const labelStyle = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
    display: 'block',
    marginBottom: '0.4rem',
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>Name</label>
        <input
          name="name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(61,95,196,0.4)';
            e.target.style.boxShadow = '0 0 20px rgba(61,95,196,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>Email</label>
        <input
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(61,95,196,0.4)';
            e.target.style.boxShadow = '0 0 20px rgba(61,95,196,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>Message</label>
        <textarea
          name="message"
          placeholder="Send a signal into the cosmos..."
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(61,95,196,0.4)';
            e.target.style.boxShadow = '0 0 20px rgba(61,95,196,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          padding: '0.75rem 1.75rem',
          border: 'none',
          borderRadius: '100px',
          background: status === 'sent' ? 'var(--uranus-teal)' : 'var(--sun-gold)',
          color: '#000',
          cursor: status === 'sending' ? 'wait' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: status === 'sending' ? 0.7 : 1,
        }}
      >
        {status === 'idle' && 'Transmit Message'}
        {status === 'sending' && 'Transmitting...'}
        {status === 'sent' && 'Signal Sent!'}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/
git commit -m "feat: shared UI components — GlassCard, SkillPill, ContactForm"
```

---

## Task 5: Starfield & Space Canvas

**Files:**
- Create: `src/experiences/space/canvas/Starfield.jsx`, `src/experiences/space/canvas/SpaceCanvas.jsx`

- [ ] **Step 1: Write `src/experiences/space/canvas/Starfield.jsx`**

Uses instanced meshes for thousands of stars in a single draw call:

```jsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Starfield({ count = 2000 }) {
  const meshRef = useRef();

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute in a large sphere around the scene
      const radius = 50 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = Math.random() * 0.15 + 0.02;
    }

    return { positions, sizes };
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Set initial positions
  useMemo(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      dummy.scale.setScalar(sizes[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, positions, sizes, dummy]);

  // Subtle twinkle effect — vary opacity by cycling alpha
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    // Only update a subset of stars each frame for performance
    const batchSize = Math.floor(count / 10);
    const offset = Math.floor(time * 2) % 10;

    for (let i = offset * batchSize; i < (offset + 1) * batchSize && i < count; i++) {
      dummy.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      // Subtle scale pulsing for twinkle
      const twinkle = 0.8 + 0.2 * Math.sin(time * 2 + i * 0.5);
      dummy.scale.setScalar(sizes[i] * twinkle);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  );
}
```

- [ ] **Step 2: Write `src/experiences/space/canvas/SpaceCanvas.jsx`**

```jsx
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import Starfield from './Starfield';

export default function SpaceCanvas({ gpuTier }) {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 500 }}
      dpr={gpuTier.dpr}
      frameloop="always"
      performance={{ min: 0.5 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 1);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
      gl={{
        antialias: gpuTier.tier !== 'low',
        powerPreference: 'high-performance',
      }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 5, 5]} intensity={1.5} />

      <Suspense fallback={null}>
        <Starfield count={gpuTier.starCount} />
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/experiences/space/canvas/
git commit -m "feat: SpaceCanvas with GPU-tiered instanced Starfield"
```

---

## Task 6: Sun Glow Effect

**Files:**
- Create: `src/experiences/space/canvas/effects/SunGlow.jsx`

- [ ] **Step 1: Write `src/experiences/space/canvas/effects/SunGlow.jsx`**

The sun sits far behind the camera starting position, providing a warm backlight:

```jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SunGlow({ position = [0, 0, -100] }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Subtle pulsing
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      {/* Core sun sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>

      {/* Glow halo — uses additive blending for light effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial
          color="#FF6B35"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Point light emanating from sun */}
      <pointLight
        color="#FFD700"
        intensity={50}
        distance={300}
        decay={2}
      />
    </group>
  );
}
```

- [ ] **Step 2: Add SunGlow to SpaceCanvas**

Add the import and component to `src/experiences/space/canvas/SpaceCanvas.jsx`:

```jsx
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import Starfield from './Starfield';
import SunGlow from './effects/SunGlow';

export default function SpaceCanvas({ gpuTier }) {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 500 }}
      dpr={gpuTier.dpr}
      frameloop="always"
      performance={{ min: 0.5 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 1);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
      gl={{
        antialias: gpuTier.tier !== 'low',
        powerPreference: 'high-performance',
      }}
    >
      <ambientLight intensity={0.3} />

      <Suspense fallback={null}>
        <Starfield count={gpuTier.starCount} />
        <SunGlow position={[0, 0, -100]} />
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/experiences/space/canvas/
git commit -m "feat: SunGlow effect with pulsing halo and point light"
```

---

## Task 7: Base Planet Component & All Planets

**Files:**
- Create: `src/experiences/space/canvas/planets/BasePlanet.jsx`, `Earth.jsx`, `Mars.jsx`, `Jupiter.jsx`, `Saturn.jsx`, `Uranus.jsx`, `Neptune.jsx`

- [ ] **Step 1: Write `src/experiences/space/canvas/planets/BasePlanet.jsx`**

Reusable planet sphere with atmosphere glow:

```jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function BasePlanet({
  position = [0, 0, 0],
  radius = 1,
  color = '#ffffff',
  emissive = '#000000',
  emissiveIntensity = 0,
  atmosphereColor = null,
  atmosphereScale = 1.15,
  rotationSpeed = 0.1,
  segments = 32,
  axialTilt = 0,
  children,
}) {
  const meshRef = useRef();
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, 0, axialTilt]}>
      {/* Planet sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, segments, segments]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Atmosphere glow */}
      {atmosphereColor && (
        <mesh scale={atmosphereScale}>
          <sphereGeometry args={[radius, segments, segments]} />
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={0.08}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {children}
    </group>
  );
}
```

- [ ] **Step 2: Write `src/experiences/space/canvas/planets/Earth.jsx`**

```jsx
import BasePlanet from './BasePlanet';

export default function Earth({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet
      position={position}
      radius={1.2}
      color="#2B6CB0"
      emissive="#1A365D"
      emissiveIntensity={0.1}
      atmosphereColor="#4B9CD3"
      atmosphereScale={1.12}
      rotationSpeed={0.08}
      segments={segments}
    >
      {/* Land mass hints via a second smaller sphere with green patches */}
      <mesh rotation={[0.2, 0, 0.1]}>
        <sphereGeometry args={[1.201, segments, segments]} />
        <meshStandardMaterial
          color="#2F855A"
          transparent
          opacity={0.4}
          roughness={0.9}
        />
      </mesh>
    </BasePlanet>
  );
}
```

- [ ] **Step 3: Write `src/experiences/space/canvas/planets/Mars.jsx`**

```jsx
import BasePlanet from './BasePlanet';

export default function Mars({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet
      position={position}
      radius={0.9}
      color="#C1440E"
      emissive="#8B2500"
      emissiveIntensity={0.05}
      atmosphereColor="#E07040"
      atmosphereScale={1.08}
      rotationSpeed={0.07}
      segments={segments}
    />
  );
}
```

- [ ] **Step 4: Write `src/experiences/space/canvas/planets/Jupiter.jsx`**

```jsx
import BasePlanet from './BasePlanet';

export default function Jupiter({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet
      position={position}
      radius={2.0}
      color="#C88B3A"
      emissive="#8B6914"
      emissiveIntensity={0.05}
      atmosphereColor="#DAA520"
      atmosphereScale={1.06}
      rotationSpeed={0.12}
      segments={segments}
    >
      {/* Band detail — rings of slightly different color at the equator */}
      <mesh>
        <torusGeometry args={[2.01, 0.08, 8, 64]} />
        <meshStandardMaterial
          color="#A0703C"
          transparent
          opacity={0.3}
          roughness={1}
        />
      </mesh>
      <mesh rotation={[0.1, 0, 0]}>
        <torusGeometry args={[2.01, 0.06, 8, 64]} />
        <meshStandardMaterial
          color="#B8860B"
          transparent
          opacity={0.2}
          roughness={1}
        />
      </mesh>
    </BasePlanet>
  );
}
```

- [ ] **Step 5: Write `src/experiences/space/canvas/planets/Saturn.jsx`**

```jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import BasePlanet from './BasePlanet';

export default function Saturn({ position = [0, 0, 0], segments = 32 }) {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.02;
    }
  });

  return (
    <BasePlanet
      position={position}
      radius={1.6}
      color="#EAD6A6"
      emissive="#C4A96A"
      emissiveIntensity={0.05}
      atmosphereColor="#EAD6A6"
      atmosphereScale={1.08}
      rotationSpeed={0.1}
      segments={segments}
      axialTilt={0.47} // ~27 degrees
    >
      {/* Ring system */}
      <group ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        {/* Inner ring */}
        <mesh>
          <ringGeometry args={[2.0, 2.4, 64]} />
          <meshBasicMaterial
            color="#EAD6A6"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Middle ring */}
        <mesh>
          <ringGeometry args={[2.5, 2.9, 64]} />
          <meshBasicMaterial
            color="#D4BE8E"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Outer ring */}
        <mesh>
          <ringGeometry args={[3.0, 3.3, 64]} />
          <meshBasicMaterial
            color="#C4A96A"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </BasePlanet>
  );
}
```

- [ ] **Step 6: Write `src/experiences/space/canvas/planets/Uranus.jsx`**

```jsx
import BasePlanet from './BasePlanet';

export default function Uranus({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet
      position={position}
      radius={1.1}
      color="#73C2BE"
      emissive="#4A9994"
      emissiveIntensity={0.05}
      atmosphereColor="#73C2BE"
      atmosphereScale={1.1}
      rotationSpeed={0.06}
      segments={segments}
      axialTilt={1.71} // ~98 degrees — Uranus rolls on its side
    />
  );
}
```

- [ ] **Step 7: Write `src/experiences/space/canvas/planets/Neptune.jsx`**

```jsx
import BasePlanet from './BasePlanet';

export default function Neptune({ position = [0, 0, 0], segments = 32 }) {
  return (
    <BasePlanet
      position={position}
      radius={1.0}
      color="#3D5FC4"
      emissive="#2A4290"
      emissiveIntensity={0.08}
      atmosphereColor="#3D5FC4"
      atmosphereScale={1.1}
      rotationSpeed={0.09}
      segments={segments}
    />
  );
}
```

- [ ] **Step 8: Add all planets to SpaceCanvas**

Update `src/experiences/space/canvas/SpaceCanvas.jsx`:

```jsx
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import Starfield from './Starfield';
import SunGlow from './effects/SunGlow';
import Earth from './planets/Earth';
import Mars from './planets/Mars';
import Jupiter from './planets/Jupiter';
import Saturn from './planets/Saturn';
import Uranus from './planets/Uranus';
import Neptune from './planets/Neptune';

// Planet positions along the Z-axis (camera travels along negative Z)
// These spread planets out so the camera visits each one during scroll.
const PLANET_POSITIONS = {
  earth:   [2, 0, 0],
  mars:    [1.5, -0.5, -30],
  jupiter: [-2, 0.5, -65],
  saturn:  [0, 0, -110],
  uranus:  [2, -0.3, -150],
  neptune: [-1.5, 0.2, -190],
};

export default function SpaceCanvas({ gpuTier }) {
  const seg = gpuTier.planetDetail;

  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 500 }}
      dpr={gpuTier.dpr}
      frameloop="always"
      performance={{ min: 0.5 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 1);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
      gl={{
        antialias: gpuTier.tier !== 'low',
        powerPreference: 'high-performance',
      }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 5, 5]} intensity={1.5} />

      <Suspense fallback={null}>
        <Starfield count={gpuTier.starCount} />
        <SunGlow position={[0, 2, 20]} />

        <Earth position={PLANET_POSITIONS.earth} segments={seg} />
        <Mars position={PLANET_POSITIONS.mars} segments={seg} />
        <Jupiter position={PLANET_POSITIONS.jupiter} segments={seg} />
        <Saturn position={PLANET_POSITIONS.saturn} segments={seg} />
        <Uranus position={PLANET_POSITIONS.uranus} segments={seg} />
        <Neptune position={PLANET_POSITIONS.neptune} segments={seg} />
      </Suspense>
    </Canvas>
  );
}

export { PLANET_POSITIONS };
```

- [ ] **Step 9: Commit**

```bash
git add src/experiences/space/canvas/
git commit -m "feat: all planets with BasePlanet component, rings, and atmosphere glow"
```

---

## Task 8: Camera Rig — Scroll-Driven Camera

**Files:**
- Create: `src/experiences/space/hooks/useScrollCamera.js`, `src/experiences/space/canvas/CameraRig.jsx`

- [ ] **Step 1: Write `src/experiences/space/canvas/CameraRig.jsx`**

This component reads a `scrollProgress` ref (0-1) and interpolates the camera through predefined waypoints aligned with planet positions:

```jsx
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PLANET_POSITIONS } from './SpaceCanvas';

// Camera waypoints: where the camera should be at each scroll percentage.
// Each waypoint is [position, lookAt].
const WAYPOINTS = [
  { at: 0.00, pos: [0, 0, 5],    look: PLANET_POSITIONS.earth },
  { at: 0.10, pos: [0, 0, 2],    look: PLANET_POSITIONS.earth },
  { at: 0.15, pos: [-1, 1, -10], look: PLANET_POSITIONS.mars },
  { at: 0.25, pos: [0, 0, -25],  look: PLANET_POSITIONS.mars },
  { at: 0.30, pos: [1, 1, -40],  look: PLANET_POSITIONS.jupiter },
  { at: 0.45, pos: [0, 0, -60],  look: PLANET_POSITIONS.jupiter },
  { at: 0.50, pos: [-1, 0.5, -80], look: PLANET_POSITIONS.saturn },
  { at: 0.65, pos: [0, 1, -105], look: PLANET_POSITIONS.saturn },
  { at: 0.75, pos: [1, 0, -130], look: PLANET_POSITIONS.uranus },
  { at: 0.82, pos: [0, 0.5, -145], look: PLANET_POSITIONS.uranus },
  { at: 0.85, pos: [-0.5, 0, -165], look: PLANET_POSITIONS.neptune },
  { at: 1.00, pos: [0, 0, -185], look: PLANET_POSITIONS.neptune },
];

function lerpWaypoints(progress) {
  // Find the two waypoints we're between
  let i = 0;
  while (i < WAYPOINTS.length - 1 && WAYPOINTS[i + 1].at <= progress) {
    i++;
  }

  if (i >= WAYPOINTS.length - 1) {
    return { pos: WAYPOINTS[WAYPOINTS.length - 1].pos, look: WAYPOINTS[WAYPOINTS.length - 1].look };
  }

  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  const t = (progress - a.at) / (b.at - a.at);
  // Smooth interpolation
  const smooth = t * t * (3 - 2 * t);

  const pos = a.pos.map((v, idx) => v + (b.pos[idx] - v) * smooth);
  const look = a.look.map((v, idx) => v + (b.look[idx] - v) * smooth);

  return { pos, look };
}

export default function CameraRig({ scrollProgressRef }) {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    const progress = scrollProgressRef.current;
    const { pos, look } = lerpWaypoints(progress);

    // Smoothly move camera
    camera.position.lerp(
      new THREE.Vector3(pos[0], pos[1], pos[2]),
      0.08
    );

    // Smoothly look at target
    lookAtTarget.current.lerp(
      new THREE.Vector3(look[0], look[1], look[2]),
      0.08
    );
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
```

- [ ] **Step 2: Write `src/experiences/space/hooks/useScrollCamera.js`**

This hook uses GSAP ScrollTrigger to track scroll progress as a value from 0 to 1:

```js
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollCamera() {
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '#space-scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return scrollProgressRef;
}
```

- [ ] **Step 3: Add CameraRig to SpaceCanvas**

Update `SpaceCanvas.jsx` to accept and pass `scrollProgressRef`:

Add to imports:
```jsx
import CameraRig from './CameraRig';
```

Add `scrollProgressRef` to the component props:
```jsx
export default function SpaceCanvas({ gpuTier, scrollProgressRef }) {
```

Add inside `<Suspense>`, after planets:
```jsx
<CameraRig scrollProgressRef={scrollProgressRef} />
```

- [ ] **Step 4: Commit**

```bash
git add src/experiences/space/canvas/CameraRig.jsx src/experiences/space/hooks/useScrollCamera.js src/experiences/space/canvas/SpaceCanvas.jsx
git commit -m "feat: scroll-driven CameraRig with waypoint interpolation"
```

---

## Task 9: DOM Sections — Hero, About, Skills

**Files:**
- Create: `src/experiences/space/sections/HeroSection.jsx`, `src/experiences/space/sections/AboutSection.jsx`, `src/experiences/space/sections/SkillsSection.jsx`

- [ ] **Step 1: Write `src/experiences/space/sections/HeroSection.jsx`**

```jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { about } from '../data/about';

export default function HeroSection() {
  const contentRef = useRef();

  useEffect(() => {
    const el = contentRef.current;
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 1.2, delay: 3.5, ease: 'power2.out',
    });
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 5vw, 3rem)',
        position: 'relative',
      }}
    >
      <div ref={contentRef} style={{ textAlign: 'center', opacity: 0 }}>
        <p
          className="font-mono"
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--text-dim)',
            marginBottom: '1rem',
          }}
        >
          Welcome aboard
        </p>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            marginBottom: '0.75rem',
            background: 'linear-gradient(135deg, var(--star-white) 0%, var(--earth-blue) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {about.name}
        </h1>

        <p
          className="font-mono"
          style={{
            fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--earth-blue)',
          }}
        >
          {about.title}
        </p>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(2rem, 5vh, 3rem)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
            }}
          >
            Scroll to explore
          </span>
          <div
            style={{
              width: '1px',
              height: '24px',
              background: 'linear-gradient(180deg, var(--earth-blue), transparent)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write `src/experiences/space/sections/AboutSection.jsx`**

```jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { about } from '../data/about';
import GlassCard from '../../../components/shared/GlassCard';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef();

  useEffect(() => {
    const els = sectionRef.current.querySelectorAll('.about-animate');
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'top 30%',
        toggleActions: 'play none none reverse',
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem)',
      }}
    >
      <div style={{ maxWidth: '700px', width: '100%' }}>
        <p
          className="font-mono about-animate"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            color: 'var(--mars-red)',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          Mars / About Me
        </p>

        <h2
          className="about-animate"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            marginBottom: '1.5rem',
          }}
        >
          About Me
        </h2>

        <GlassCard accent="rgb(193, 68, 14)" className="about-animate">
          <div style={{
            display: 'flex',
            gap: 'clamp(1rem, 3vw, 2rem)',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            {/* Photo placeholder */}
            <div
              style={{
                width: 'clamp(80px, 15vw, 120px)',
                height: 'clamp(80px, 15vw, 120px)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--mars-red), #8B2500)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '2rem' }}>M</span>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <p style={{
                fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
                lineHeight: 1.7,
                color: 'var(--text-dim)',
              }}>
                {about.bio}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Write `src/experiences/space/sections/SkillsSection.jsx`**

```jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillCategories } from '../data/skills';
import SkillPill from '../../../components/shared/SkillPill';

gsap.registerPlugin(ScrollTrigger);

export default function SkillsSection() {
  const sectionRef = useRef();

  useEffect(() => {
    const categories = sectionRef.current.querySelectorAll('.skill-category');
    categories.forEach((cat) => {
      gsap.fromTo(cat, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: {
          trigger: cat,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem)',
      }}
    >
      <div style={{ maxWidth: '700px', width: '100%' }}>
        <p
          className="font-mono"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            color: 'var(--jupiter-amber)',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          Jupiter / Skills
        </p>

        <h2
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            marginBottom: '2rem',
          }}
        >
          Technical Arsenal
        </h2>

        {skillCategories.map((category) => (
          <div
            key={category.name}
            className="skill-category"
            style={{ marginBottom: '2rem' }}
          >
            <p
              className="font-mono"
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                color: category.accent,
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              {category.name}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {category.skills.map((skill) => (
                <SkillPill
                  key={skill.name}
                  name={skill.name}
                  accent={category.accent}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/experiences/space/sections/HeroSection.jsx src/experiences/space/sections/AboutSection.jsx src/experiences/space/sections/SkillsSection.jsx
git commit -m "feat: Hero, About, Skills DOM sections with GSAP scroll animations"
```

---

## Task 10: DOM Sections — Testimonials, Contact

**Files:**
- Create: `src/experiences/space/sections/TestimonialsSection.jsx`, `src/experiences/space/sections/ContactSection.jsx`

- [ ] **Step 1: Write `src/experiences/space/sections/TestimonialsSection.jsx`**

```jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { testimonials } from '../data/testimonials';
import GlassCard from '../../../components/shared/GlassCard';

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const sectionRef = useRef();

  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll('.testimonial-card');
    gsap.fromTo(cards, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem)',
      }}
    >
      <div style={{ maxWidth: '700px', width: '100%' }}>
        <p
          className="font-mono"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            color: 'var(--uranus-teal)',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          Uranus / Testimonials
        </p>

        <h2
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            marginBottom: '2rem',
          }}
        >
          Voices from Afar
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {testimonials.map((t) => (
            <GlassCard
              key={t.id}
              accent="rgb(115, 194, 190)"
              className="testimonial-card"
              style={{ position: 'relative' }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  left: '1rem',
                  fontSize: '3rem',
                  color: 'var(--uranus-teal)',
                  opacity: 0.2,
                  lineHeight: 1,
                  fontFamily: 'serif',
                }}
              >
                &ldquo;
              </span>

              <p style={{
                fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
                fontStyle: 'italic',
                lineHeight: 1.7,
                color: 'rgba(232,244,248,0.8)',
                marginBottom: '1rem',
                paddingTop: '0.5rem',
              }}>
                {t.quote}
              </p>

              <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.name}</p>
              <p
                className="font-mono"
                style={{
                  fontSize: '0.6rem',
                  color: 'var(--text-dim)',
                  letterSpacing: '0.1em',
                }}
              >
                {t.role}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write `src/experiences/space/sections/ContactSection.jsx`**

```jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { about } from '../data/about';
import ContactForm from '../../../components/shared/ContactForm';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_ICONS = {
  github: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  ),
  twitter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
  mail: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

export default function ContactSection() {
  const sectionRef = useRef();

  useEffect(() => {
    const els = sectionRef.current.querySelectorAll('.contact-animate');
    gsap.fromTo(els, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem)',
      }}
    >
      <div style={{ maxWidth: '700px', width: '100%' }}>
        <p
          className="font-mono contact-animate"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            color: 'var(--neptune-blue)',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          Neptune / Contact
        </p>

        <h2
          className="contact-animate"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}
        >
          Send a Signal
        </h2>

        <p
          className="contact-animate"
          style={{
            color: 'var(--text-dim)',
            fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}
        >
          You've reached the edge of the solar system. Let's build something across the cosmos.
        </p>

        <div className="contact-animate">
          <ContactForm />
        </div>

        {/* Resume download */}
        <div className="contact-animate" style={{ marginTop: '2rem' }}>
          <a
            href={about.resumeUrl}
            download
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 500,
              padding: '0.7rem 1.7rem',
              border: '1px solid rgba(232,244,248,0.15)',
              borderRadius: '100px',
              color: 'var(--star-white)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(232,244,248,0.35)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(232,244,248,0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Download Resume
          </a>
        </div>

        {/* Social links */}
        <div
          className="contact-animate"
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          {about.socials.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.platform}
              style={{
                color: 'var(--text-dim)',
                transition: 'color 0.3s ease, transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--neptune-blue)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-dim)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {SOCIAL_ICONS[s.icon]}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/experiences/space/sections/TestimonialsSection.jsx src/experiences/space/sections/ContactSection.jsx
git commit -m "feat: Testimonials and Contact DOM sections with scroll animations"
```

---

## Task 11: Projects Section — Saturn Orbit HUD & Detail Panel

**Files:**
- Create: `src/experiences/space/sections/ProjectsSection.jsx`, `src/experiences/space/hooks/useOrbitControls.js`

- [ ] **Step 1: Write `src/experiences/space/hooks/useOrbitControls.js`**

Handles drag/swipe to orbit camera around a point:

```js
import { useRef, useEffect, useCallback } from 'react';

export function useOrbitControls(containerRef, { enabled = false, onAngleChange }) {
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const angle = useRef(0);

  const handleStart = useCallback((clientX) => {
    if (!enabled) return;
    isDragging.current = true;
    lastX.current = clientX;
  }, [enabled]);

  const handleMove = useCallback((clientX) => {
    if (!isDragging.current || !enabled) return;
    const delta = (clientX - lastX.current) * 0.005;
    angle.current += delta;
    lastX.current = clientX;
    onAngleChange?.(angle.current);
  }, [enabled, onAngleChange]);

  const handleEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    // Mouse events
    const onMouseDown = (e) => handleStart(e.clientX);
    const onMouseMove = (e) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();

    // Touch events
    const onTouchStart = (e) => handleStart(e.touches[0].clientX);
    const onTouchMove = (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleEnd();

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [containerRef, enabled, handleStart, handleMove, handleEnd]);

  return angle;
}
```

- [ ] **Step 2: Write `src/experiences/space/sections/ProjectsSection.jsx`**

This is the Saturn zone with the pinned scroll, orbit prompt, and project detail panel:

```jsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';
import { useOrbitControls } from '../hooks/useOrbitControls';
import GlassCard from '../../../components/shared/GlassCard';
import SkillPill from '../../../components/shared/SkillPill';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const sectionRef = useRef();
  const orbitContainerRef = useRef();
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAngleChange = useCallback((newAngle) => {
    setOrbitAngle(newAngle);
  }, []);

  useOrbitControls(orbitContainerRef, {
    enabled: isOrbiting && !selectedProject,
    onAngleChange: handleAngleChange,
  });

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200%',
      pin: true,
      onEnter: () => setIsOrbiting(true),
      onLeave: () => setIsOrbiting(false),
      onEnterBack: () => setIsOrbiting(true),
      onLeaveBack: () => setIsOrbiting(false),
    });

    return () => trigger.kill();
  }, []);

  // Position projects in a circle based on orbit angle
  const getProjectPosition = (index, total) => {
    const baseAngle = (index / total) * Math.PI * 2 + orbitAngle;
    const radius = 38; // % of container width
    const x = 50 + Math.cos(baseAngle) * radius;
    const y = 50 + Math.sin(baseAngle) * radius * 0.4; // squash vertically for perspective
    const scale = 0.6 + 0.4 * ((Math.sin(baseAngle) + 1) / 2); // larger when "in front"
    const zIndex = Math.round(scale * 10);
    const opacity = 0.3 + 0.7 * scale;

    return { x, y, scale, zIndex, opacity };
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Section label */}
      <div style={{
        position: 'absolute',
        top: 'clamp(1.5rem, 4vh, 3rem)',
        left: 'clamp(1.5rem, 4vw, 3rem)',
        zIndex: 20,
      }}>
        <p
          className="font-mono"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            color: 'var(--saturn-gold)',
            textTransform: 'uppercase',
          }}
        >
          Saturn / Projects
        </p>
        <h2 style={{
          fontSize: 'clamp(1.25rem, 3vw, 2rem)',
          fontWeight: 700,
          marginTop: '0.25rem',
        }}>
          Orbital Works
        </h2>
      </div>

      {/* Orbit interaction area */}
      <div
        ref={orbitContainerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          cursor: isOrbiting ? 'grab' : 'default',
          touchAction: 'none',
        }}
      >
        {/* Orbit prompt */}
        {isOrbiting && !selectedProject && (
          <p
            className="font-mono"
            style={{
              position: 'absolute',
              bottom: 'clamp(2rem, 5vh, 3rem)',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              zIndex: 20,
            }}
          >
            Drag to orbit &middot; Tap a project
          </p>
        )}

        {/* Project nodes arranged in orbit */}
        {projects.map((project, i) => {
          const pos = getProjectPosition(i, projects.length);

          return (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%) scale(${pos.scale})`,
                zIndex: pos.zIndex,
                opacity: pos.opacity,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'opacity 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
              }}
            >
              {/* Glowing orb */}
              <div
                style={{
                  width: 'clamp(32px, 5vw, 48px)',
                  height: 'clamp(32px, 5vw, 48px)',
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 30% 30%, ${project.color}, ${project.color}88)`,
                  boxShadow: `0 0 20px ${project.color}44, 0 0 40px ${project.color}22`,
                }}
              />
              {/* Label */}
              <span
                className="font-mono"
                style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.1em',
                  color: 'var(--star-white)',
                  whiteSpace: 'nowrap',
                  textShadow: '0 0 10px rgba(0,0,0,0.8)',
                }}
              >
                {project.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Project detail panel */}
      {selectedProject && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 'clamp(300px, 40vw, 450px)',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            padding: 'clamp(1rem, 3vw, 2rem)',
          }}
        >
          <GlassCard accent={selectedProject.color} style={{ width: '100%' }}>
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
              aria-label="Close project detail"
            >
              &times;
            </button>

            <p
              className="font-mono"
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                color: selectedProject.color,
                marginBottom: '0.5rem',
              }}
            >
              PROJECT
            </p>

            <h3 style={{
              fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}>
              {selectedProject.name}
            </h3>

            {/* Screenshot placeholder */}
            <div
              style={{
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${selectedProject.color}22, ${selectedProject.color}08)`,
                border: '1px solid rgba(255,255,255,0.04)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                Screenshot
              </span>
            </div>

            <p style={{
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: 'var(--text-dim)',
              marginBottom: '1rem',
            }}>
              {selectedProject.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
              {selectedProject.techStack.map((tech) => (
                <SkillPill key={tech} name={tech} accent={selectedProject.color} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '100px',
                  background: selectedProject.color,
                  color: '#000',
                  textDecoration: 'none',
                }}
              >
                View Live
              </a>
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '100px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--star-white)',
                  textDecoration: 'none',
                }}
              >
                GitHub
              </a>
            </div>
          </GlassCard>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/experiences/space/sections/ProjectsSection.jsx src/experiences/space/hooks/useOrbitControls.js
git commit -m "feat: ProjectsSection with orbit controls and detail panel"
```

---

## Task 12: Big Bang Intro Animation

**Files:**
- Create: `src/experiences/space/canvas/effects/BigBang.jsx`

- [ ] **Step 1: Write `src/experiences/space/canvas/effects/BigBang.jsx`**

Uses Canvas2D for the particle explosion (lightweight, no Three.js dependency). Renders as an overlay that fades out when complete:

```jsx
import { useRef, useEffect, useState, useCallback } from 'react';

const PARTICLE_COUNT = 200;
const DURATION = 3500; // ms

export default function BigBang({ onComplete }) {
  const canvasRef = useRef();
  const [visible, setVisible] = useState(true);
  const [skipped, setSkipped] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  // Check if already played this session
  const alreadyPlayed = sessionStorage.getItem('bigBangPlayed') === 'true';

  const finish = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem('bigBangPlayed', 'true');
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (alreadyPlayed) {
      finish();
      return;
    }

    // Show skip button after 1 second
    const skipTimer = setTimeout(() => setShowSkip(true), 1000);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Set canvas to full screen
    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    // Generate particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      return {
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        alpha: 1,
        color: Math.random() > 0.3 ? '#FFFFFF' : (Math.random() > 0.5 ? '#FFD700' : '#FF6B35'),
      };
    });

    const startTime = performance.now();

    function animate(now) {
      if (skipped) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, w(), h());

      const cx = w() / 2;
      const cy = h() / 2;

      if (progress < 0.15) {
        // Phase 1: pulsing point
        const pulse = 1 + Math.sin(elapsed * 0.02) * 0.3;
        const pointSize = 3 * pulse;
        ctx.beginPath();
        ctx.arc(cx, cy, pointSize, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Subtle glow
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30 * pulse);
        glow.addColorStop(0, 'rgba(255,255,255,0.4)');
        glow.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, 30 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      } else if (progress < 0.45) {
        // Phase 2: explosion — particles fly outward
        const explodeProgress = (progress - 0.15) / 0.3;

        // Flash
        if (explodeProgress < 0.15) {
          const flashAlpha = (1 - explodeProgress / 0.15) * 0.8;
          ctx.fillStyle = `rgba(255, 248, 220, ${flashAlpha})`;
          ctx.fillRect(0, 0, w(), h());
        }

        particles.forEach((p) => {
          p.x = cx + p.vx * explodeProgress * 80;
          p.y = cy + p.vy * explodeProgress * 80;
          p.alpha = 1 - explodeProgress * 0.5;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - explodeProgress * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      } else {
        // Phase 3: particles settle into star positions, fade
        const settleProgress = (progress - 0.45) / 0.55;

        particles.forEach((p, i) => {
          // Settle toward final position
          const targetX = (Math.sin(i * 137.5) * 0.5 + 0.5) * w();
          const targetY = (Math.cos(i * 137.5) * 0.5 + 0.5) * h();
          const currentX = cx + p.vx * 80;
          const currentY = cy + p.vy * 80;

          p.x = currentX + (targetX - currentX) * settleProgress;
          p.y = currentY + (targetY - currentY) * settleProgress;
          p.alpha = 1 - settleProgress;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.8;
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Overall fade out
        if (settleProgress > 0.7) {
          const fadeAlpha = (settleProgress - 0.7) / 0.3;
          ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
          ctx.fillRect(0, 0, w(), h());
        }
      }

      if (progress >= 1) {
        finish();
        return;
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    return () => {
      clearTimeout(skipTimer);
      window.removeEventListener('resize', resize);
    };
  }, [alreadyPlayed, finish, skipped]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        pointerEvents: 'auto',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {showSkip && (
        <button
          onClick={() => {
            setSkipped(true);
            finish();
          }}
          className="font-mono"
          style={{
            position: 'absolute',
            bottom: 'clamp(1.5rem, 4vh, 2.5rem)',
            right: 'clamp(1.5rem, 4vw, 2.5rem)',
            background: 'transparent',
            border: '1px solid rgba(232,244,248,0.15)',
            borderRadius: '100px',
            padding: '0.4rem 1rem',
            color: 'var(--text-dim)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            cursor: 'pointer',
            zIndex: 10000,
            transition: 'border-color 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(232,244,248,0.35)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(232,244,248,0.15)'}
        >
          SKIP
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/experiences/space/canvas/effects/BigBang.jsx
git commit -m "feat: BigBang Canvas2D intro animation with skip and session tracking"
```

---

## Task 13: SpaceExperience Orchestrator

**Files:**
- Create: `src/experiences/space/SpaceExperience.jsx`

- [ ] **Step 1: Write `src/experiences/space/SpaceExperience.jsx`**

This is the main component that ties everything together — Big Bang, canvas, Lenis, scroll sections:

```jsx
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGpuTier } from './hooks/useGpuTier';
import { useScrollCamera } from './hooks/useScrollCamera';
import BigBang from './canvas/effects/BigBang';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);

const SpaceCanvas = lazy(() => import('./canvas/SpaceCanvas'));

export default function SpaceExperience({ navigate }) {
  const gpuTier = useGpuTier();
  const scrollProgressRef = useScrollCamera();
  const [introComplete, setIntroComplete] = useState(false);
  const lenisRef = useRef(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Prevent scroll during Big Bang
  useEffect(() => {
    if (!introComplete && lenisRef.current) {
      lenisRef.current.stop();
    } else if (introComplete && lenisRef.current) {
      lenisRef.current.start();
    }
  }, [introComplete]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Big Bang intro overlay */}
      <BigBang onComplete={() => setIntroComplete(true)} />

      {/* 3D Canvas — fixed behind everything */}
      <Suspense fallback={null}>
        <SpaceCanvas gpuTier={gpuTier} scrollProgressRef={scrollProgressRef} />
      </Suspense>

      {/* Scrollable DOM content */}
      <div
        id="space-scroll-container"
        style={{
          position: 'relative',
          zIndex: 2,
          pointerEvents: introComplete ? 'auto' : 'none',
          opacity: introComplete ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <TestimonialsSection />
        <ContactSection />

        {/* Footer void — "Back to Earth" */}
        <footer
          style={{
            minHeight: '30vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => {
              lenisRef.current?.scrollTo(0, { duration: 2 });
            }}
            className="font-mono"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--star-white)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            &larr; Back to Earth
          </button>
        </footer>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```

Expected: The site loads, Big Bang plays (or skips if already seen), then the space experience appears with starfield, planets, and all DOM sections. Scrolling should move the camera through the solar system. Verify on `http://localhost:5173`.

- [ ] **Step 3: Commit**

```bash
git add src/experiences/space/SpaceExperience.jsx
git commit -m "feat: SpaceExperience orchestrator — ties BigBang, canvas, Lenis, and all sections"
```

---

## Task 14: Mobile Responsiveness Pass

**Files:**
- Modify: `src/experiences/space/sections/ProjectsSection.jsx`, `src/styles/globals.css`

- [ ] **Step 1: Add mobile styles to `globals.css`**

Append to `src/styles/globals.css`:

```css
/* ── Mobile-first section spacing ── */
section {
  padding: clamp(1rem, 5vw, 4rem);
}

/* ── Mobile project detail panel ── */
@media (max-width: 768px) {
  .project-detail-panel {
    position: fixed !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    top: auto !important;
    width: 100% !important;
    max-height: 70vh;
    border-radius: 20px 20px 0 0;
    overflow-y: auto;
  }
}

/* ── Ensure touch targets are 44px+ ── */
@media (max-width: 768px) {
  button, a {
    min-height: 44px;
    min-width: 44px;
  }
}
```

- [ ] **Step 2: Update ProjectsSection for mobile bottom sheet**

In `src/experiences/space/sections/ProjectsSection.jsx`, update the detail panel wrapper to add the `project-detail-panel` class and adjust for mobile:

Replace the detail panel container's style object (the `<div>` wrapping the `<GlassCard>` for selectedProject) with:

```jsx
<div
  className="project-detail-panel"
  style={{
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 'clamp(300px, 40vw, 450px)',
    zIndex: 30,
    display: 'flex',
    alignItems: 'center',
    padding: 'clamp(1rem, 3vw, 2rem)',
  }}
>
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/globals.css src/experiences/space/sections/ProjectsSection.jsx
git commit -m "feat: mobile responsiveness — bottom sheet panel, touch targets, fluid spacing"
```

---

## Task 15: Accessibility & Reduced Motion

**Files:**
- Modify: `src/experiences/space/SpaceExperience.jsx`, `src/styles/globals.css`

- [ ] **Step 1: Add skip-to-content link**

In `src/experiences/space/SpaceExperience.jsx`, add at the top of the return, before `<BigBang>`:

```jsx
{/* Skip to content link */}
<a
  href="#about"
  style={{
    position: 'fixed',
    top: '-100px',
    left: '1rem',
    zIndex: 99999,
    background: 'var(--sun-gold)',
    color: '#000',
    padding: '0.5rem 1rem',
    borderRadius: '0 0 8px 8px',
    fontWeight: 600,
    fontSize: '0.8rem',
    textDecoration: 'none',
    transition: 'top 0.3s ease',
  }}
  onFocus={(e) => e.currentTarget.style.top = '0'}
  onBlur={(e) => e.currentTarget.style.top = '-100px'}
>
  Skip to content
</a>
```

- [ ] **Step 2: Add `prefers-reduced-motion` check**

In `SpaceExperience.jsx`, add a check that bypasses the Big Bang and disables canvas animations for users who prefer reduced motion:

After the state declarations, add:

```jsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Update the BigBang rendering:

```jsx
{!prefersReducedMotion && <BigBang onComplete={() => setIntroComplete(true)} />}
```

And if reduced motion, set intro as already complete:

```jsx
useEffect(() => {
  if (prefersReducedMotion) {
    setIntroComplete(true);
  }
}, [prefersReducedMotion]);
```

- [ ] **Step 3: Add ARIA labels to planet orbit project nodes**

In `ProjectsSection.jsx`, add `aria-label` to each project button:

```jsx
aria-label={`View project: ${project.name}`}
```

- [ ] **Step 4: Commit**

```bash
git add src/experiences/space/SpaceExperience.jsx src/experiences/space/sections/ProjectsSection.jsx
git commit -m "feat: accessibility — skip link, reduced motion, ARIA labels"
```

---

## Task 16: Final Build Verification

**Files:**
- No new files

- [ ] **Step 1: Run the dev server and visual check**

```bash
npm run dev
```

Walk through the entire site:
1. Big Bang plays on first load
2. Hero section shows "Mani Dodla" with Earth visible
3. Scroll moves camera to Mars (About section appears)
4. Continue to Jupiter (Skills section)
5. Saturn zone pins — drag/swipe to orbit, click project nodes to see detail panel
6. Continue to Uranus (Testimonials)
7. Neptune (Contact form, resume download, social links)
8. "Back to Earth" button works
9. Reload — Big Bang should skip (session storage)

- [ ] **Step 2: Test mobile viewport**

Open Chrome DevTools, toggle device toolbar, test at 375px width:
- All text is readable
- Project nodes are tappable
- Detail panel appears as bottom sheet
- Scroll is smooth
- No horizontal overflow

- [ ] **Step 3: Run production build**

```bash
npm run build
npm run preview
```

Expected: Build succeeds with no errors. Preview serves the production build correctly.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: verify build and mobile responsiveness"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Project scaffolding | `package.json`, `App.jsx`, `globals.css` |
| 2 | GPU tier detection | `gpuDetect.js`, `useGpuTier.js` |
| 3 | Placeholder data | `projects.js`, `skills.js`, `testimonials.js`, `about.js` |
| 4 | Shared UI components | `GlassCard.jsx`, `SkillPill.jsx`, `ContactForm.jsx` |
| 5 | Starfield & Canvas | `Starfield.jsx`, `SpaceCanvas.jsx` |
| 6 | Sun glow effect | `SunGlow.jsx` |
| 7 | All planets | `BasePlanet.jsx`, `Earth.jsx` through `Neptune.jsx` |
| 8 | Scroll-driven camera | `CameraRig.jsx`, `useScrollCamera.js` |
| 9 | Hero, About, Skills sections | `HeroSection.jsx`, `AboutSection.jsx`, `SkillsSection.jsx` |
| 10 | Testimonials, Contact sections | `TestimonialsSection.jsx`, `ContactSection.jsx` |
| 11 | Saturn orbit + detail panel | `ProjectsSection.jsx`, `useOrbitControls.js` |
| 12 | Big Bang intro | `BigBang.jsx` |
| 13 | Space experience orchestrator | `SpaceExperience.jsx` |
| 14 | Mobile responsiveness | `globals.css`, `ProjectsSection.jsx` |
| 15 | Accessibility | `SpaceExperience.jsx`, `ProjectsSection.jsx` |
| 16 | Build verification | — |
