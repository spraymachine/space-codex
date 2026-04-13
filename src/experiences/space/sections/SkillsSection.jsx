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
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
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
    <section ref={sectionRef} className="space-section" id="skills" aria-label="Skills">
      <div className="section-shell">
        <div className="section-head">
          <p className="eyebrow" style={{ color: 'var(--jupiter-amber)' }}>
            Jupiter / Skills
          </p>
          <h2>Built for breadth without losing sharpness.</h2>
          <p>
            The largest planet maps to the widest part of the stack. This is
            where interface craft, backend fluency, and delivery rigor sit in
            the same orbit.
          </p>
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
              <p
                style={{
                  margin: '0 0 1.05rem',
                  color: 'var(--text-dim)',
                  lineHeight: 1.65,
                }}
              >
                {category.summary}
              </p>

              <div style={{ display: 'grid', gap: '0.95rem' }}>
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <SkillPill name={skill.name} accent={category.accent} />
                      <span
                        className="font-mono"
                        style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}
                      >
                        {skill.level}%
                      </span>
                    </div>
                    <div className="skill-bar" aria-hidden="true">
                      <span
                        style={{
                          width: `${skill.level}%`,
                          background: `linear-gradient(90deg, ${category.accent}, rgba(255,255,255,0.72))`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
