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
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.95,
        stagger: 0.12,
        ease: 'power2.out',
      }
    );

    const underlayTween = gsap.to(contentRef.current, {
      '--hero-underlay-opacity': 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'top+=55% top',
        scrub: true,
      },
    });

    return () => {
      animation.kill();
      underlayTween.kill();
    };
  }, [ready]);

  return (
    <section className="space-section hero-shell" id="hero" aria-label="Hero">
      <div className="hero-grid">
        <div
          className="hero-copy-shell"
          ref={contentRef}
          style={{ maxWidth: '44rem', paddingTop: 'clamp(2rem, 4vh, 4rem)' }}
        >
          <p
            className="eyebrow"
            style={{ color: 'var(--earth-blue)' }}
            data-hero-item
          >
            Earth Orbit / Portfolio Transmission
          </p>
          <h1 className="hero-title" data-hero-item>
            <span>Mani</span>
            <span
              style={{
                background:
                  'linear-gradient(135deg, var(--star-white) 0%, var(--earth-blue) 38%, #b3bfff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Dodla
            </span>
          </h1>
          <p
            className="font-mono"
            style={{
              margin: 0,
              fontSize: 'clamp(0.8rem, 1.8vw, 0.94rem)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--earth-blue)',
            }}
            data-hero-item
          >
            {about.title} / spatial web experiences
          </p>
          <p className="hero-kicker" data-hero-item>
            I design and build immersive, high-end web experiences.
          </p>
          <div
            style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}
            data-hero-item
          >
            <a className="primary-button" href="#projects">
              Explore Projects
            </a>
            <a className="outline-button" href="#contact">
              Start a Mission
            </a>
          </div>

          <div className="hero-orbit-line" data-hero-item>
            <span
              className="font-mono"
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--text-dim)',
              }}
            >
              Scroll to leave Earth orbit
            </span>
            <span aria-hidden="true" />
          </div>
        </div>

      </div>
    </section>
  );
}
