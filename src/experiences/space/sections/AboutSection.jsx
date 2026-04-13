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
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
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
      <div className="section-shell about-shell">
        <div className="about-head about-animate">
          <p className="eyebrow" style={{ color: 'var(--mars-red)' }}>
            Mars / About
          </p>
          <h2>Explorer energy, product discipline.</h2>
          <p>
            I like work that feels ambitious in the right ways: spatial interaction,
            bold visual rhythm, and frontend systems that stay reliable under real
            product pressure.
          </p>
        </div>

        <div className="about-layout">
          <article className="about-manifest about-animate">
            <ul className="about-pillars">
              <li>Creative direction anchored by engineering reality.</li>
              <li>Performance-minded motion over ornamental animation.</li>
              <li>Interfaces that can pitch, persuade, and still ship.</li>
            </ul>
            <p>{about.bio}</p>
          </article>

          <aside className="about-aside about-animate">
            <div className="about-status">
              <p className="eyebrow">Current status</p>
              <p>{about.availability}</p>
              <p className="font-mono">Based in {about.location}</p>
            </div>

            <div className="about-stats-grid">
              {about.highlights.map((highlight, index) => (
                <div className="about-stat" key={highlight.label}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{highlight.value}</strong>
                  <p>{highlight.label}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
