import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { about } from '../data/about';

export default function HeroSection({ ready = false }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!ready || !contentRef.current) {
      return undefined;
    }

    const animation = gsap.fromTo(
      contentRef.current.querySelectorAll('[data-hero-item]'),
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.out',
      }
    );

    return () => animation.kill();
  }, [ready]);

  return (
    <section className="space-section hero-shell" id="hero" aria-label="Hero">
      <div className="hero-grid">
        <div className="hero-copy-shell" ref={contentRef}>
          <p className="eyebrow hero-callout" data-hero-item>
            Earth orbit
          </p>
          <h1 className="hero-title" data-hero-item>
            {about.name}
          </h1>
          <p className="hero-role font-mono" data-hero-item>
            {about.title}
          </p>
          <p className="hero-kicker" data-hero-item>
            Spatial, restrained, and built to move well.
          </p>
          <div className="hero-action-row" data-hero-item>
            <a className="primary-button" href="#projects">
              Projects
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
