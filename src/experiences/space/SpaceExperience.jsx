import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGpuTier } from './hooks/useGpuTier';
import { useScrollCamera } from './hooks/useScrollCamera';
import BigBang from './canvas/effects/BigBang';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';
import HeroSection from './sections/HeroSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import TestimonialsSection from './sections/TestimonialsSection';

gsap.registerPlugin(ScrollTrigger);

const SpaceCanvas = lazy(() => import('./canvas/SpaceCanvas'));

function getReducedMotionPreference() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function SpaceExperience() {
  const gpuTier = useGpuTier();
  const lenisRef = useRef(null);
  const rafRef = useRef(null);
  const [introComplete, setIntroComplete] = useState(getReducedMotionPreference);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getReducedMotionPreference
  );
  const [orbitState, setOrbitState] = useState({
    active: false,
    angle: 0,
    focused: false,
  });
  const scrollProgressRef = useScrollCamera(!prefersReducedMotion);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
      if (event.matches) {
        setIntroComplete(true);
      }
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.18,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      lerp: 0.08,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    rafRef.current = raf;
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (rafRef.current) {
        gsap.ticker.remove(rafRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined;
    }

    if (!introComplete) {
      lenisRef.current?.stop();
      return undefined;
    }

    lenisRef.current?.start();
    const refreshTimeout = window.setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => window.clearTimeout(refreshTimeout);
  }, [introComplete, prefersReducedMotion]);

  const overlayStyle = useMemo(
    () => ({
      pointerEvents: introComplete ? 'auto' : 'none',
      opacity: introComplete ? 1 : 0,
      transition: 'opacity 700ms ease',
    }),
    [introComplete]
  );

  return (
    <div className="space-scroll-root">
      <a className="space-skip-link" href="#main-content">
        Skip to content
      </a>

      {!prefersReducedMotion && <BigBang onComplete={() => setIntroComplete(true)} />}

      <Suspense fallback={null}>
        <SpaceCanvas
          gpuTier={gpuTier}
          scrollProgressRef={scrollProgressRef}
          orbitState={orbitState}
          reducedMotion={prefersReducedMotion}
        />
      </Suspense>

      <main
        id="main-content"
        className="space-dom-overlay"
        style={overlayStyle}
      >
        <div id="space-scroll-container">
          <HeroSection ready={introComplete} />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection
            reducedMotion={prefersReducedMotion}
            onOrbitStateChange={setOrbitState}
          />
          <TestimonialsSection />
          <ContactSection />

          <footer className="space-footer">
            <button
              type="button"
              className="ghost-button"
              onClick={() => {
                if (prefersReducedMotion) {
                  window.scrollTo({ top: 0, behavior: 'auto' });
                  return;
                }

                lenisRef.current?.scrollTo(0, { duration: 2 });
              }}
            >
              Back to Earth
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}
