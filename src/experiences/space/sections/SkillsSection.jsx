import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlassCard from '../../../components/shared/GlassCard';
import SkillPill from '../../../components/shared/SkillPill';
import { skillCategories } from '../data/skills';

gsap.registerPlugin(ScrollTrigger);

function CategoryLogo({ type }) {
  if (type === 'backend') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <ellipse cx="12" cy="6" rx="7.5" ry="2.8" />
        <path d="M4.5 6v5c0 1.5 3.3 2.8 7.5 2.8s7.5-1.3 7.5-2.8V6" />
        <path d="M4.5 11v5c0 1.5 3.3 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-5" />
      </svg>
    );
  }

  if (type === 'delivery') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 17h16" />
        <path d="M6.5 17v-7.5L12 6l5.5 3.5V17" />
        <circle cx="8.5" cy="17" r="1.5" />
        <circle cx="15.5" cy="17" r="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v12H4z" />
      <path d="M9 9h6" />
      <path d="M8 13l2-2" />
      <path d="M16 13l-2-2" />
      <path d="M11 15h2" />
    </svg>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef(null);
  const [openLogo, setOpenLogo] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.skills-card',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
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
    <section ref={sectionRef} className="space-section" id="skills" aria-label="Skills">
      <div className="section-shell orbital-copy-shell">
        <div className="section-head">
          <p className="eyebrow" style={{ color: 'var(--jupiter-amber)' }}>
            Jupiter / Skills
          </p>
          <h2>Clear core stack.</h2>
          <p>Just the tools that actually shape the work.</p>
        </div>

        <div className="skills-category-grid">
          {skillCategories.map((category) => (
            <GlassCard
              key={category.name}
              accent={category.accent}
              className="skills-card"
            >
              <div className="skills-card-head">
                <div className="skills-logo-wrap">
                  <button
                    type="button"
                    className="skills-logo-button"
                    onClick={() =>
                      setOpenLogo((current) =>
                        current === category.name ? null : category.name
                      )
                    }
                    aria-label={`Show ${category.logoLabel} label`}
                    aria-expanded={openLogo === category.name}
                    style={{ color: category.accent }}
                  >
                    <CategoryLogo type={category.logo} />
                  </button>
                  {openLogo === category.name && (
                    <span className="skills-logo-pop">{category.logoLabel}</span>
                  )}
                </div>
                <p className="eyebrow" style={{ color: category.accent }}>
                  {category.name}
                </p>
              </div>
              <p className="skills-summary">{category.summary}</p>
              <div className="skills-pill-row">
                {category.skills.map((skill) => (
                  <SkillPill key={skill.name} name={skill.name} accent={category.accent} />
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
