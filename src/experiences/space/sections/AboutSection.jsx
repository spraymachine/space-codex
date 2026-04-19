import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { about } from '../data/about';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-animate',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 74%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="space-section about-section"
      id="about"
      aria-label="About"
    >
      <div className="section-shell orbital-copy-shell about-shell">
        <div className="about-head about-animate">
          <p className="eyebrow" style={{ color: 'var(--mars-red)' }}>
            Mars / About
          </p>
          <h2>Less noise. More control.</h2>
          <p>{about.bio}</p>
        </div>

        <div className="about-layout">
          <article className="about-manifest about-animate">
            <p>{about.story}</p>
          </article>

          <aside className="about-aside about-animate">
            <div className="about-status">
              <p className="eyebrow">Status</p>
              <p>{about.availability}</p>
              <p className="font-mono">{about.location}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
