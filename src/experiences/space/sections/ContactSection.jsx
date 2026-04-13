import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactForm from '../../../components/shared/ContactForm';
import GlassCard from '../../../components/shared/GlassCard';
import { about } from '../data/about';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_ICONS = {
  github: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="2"
        y="9"
        width="4"
        height="12"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4" cy="4" r="2" strokeWidth="1.8" />
    </svg>
  ),
  twitter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  mail: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export default function ContactSection() {
  const sectionRef = useRef(null);
  const [signalActive, setSignalActive] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-animate',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.72,
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

  useEffect(() => {
    if (!signalActive) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setSignalActive(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [signalActive]);

  return (
    <section ref={sectionRef} className="space-section" id="contact" aria-label="Contact">
      <div className="section-shell" style={{ position: 'relative' }}>
        {signalActive && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: '4%',
              top: '10%',
              width: '2px',
              height: '56%',
              background:
                'linear-gradient(180deg, rgba(61,95,196,0), rgba(61,95,196,0.85), rgba(255,255,255,0))',
              boxShadow: '0 0 24px rgba(61,95,196,0.65)',
              transform: 'rotate(-26deg)',
              transformOrigin: 'center',
            }}
          />
        )}

        <div className="section-head contact-animate">
          <p className="eyebrow" style={{ color: 'var(--neptune-blue)' }}>
            Neptune / Contact
          </p>
          <h2>Send a signal into deep space.</h2>
          <p>
            The portfolio ends at the edge of the solar system. If the work
            feels like the right fit, this is where the next mission begins.
          </p>
        </div>

        <div className="two-column-grid">
          <GlassCard accent="var(--neptune-blue)" className="contact-animate">
            <ContactForm onSubmitSuccess={() => setSignalActive(true)} />
          </GlassCard>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <GlassCard accent="var(--neptune-blue)" className="contact-animate">
              <p className="eyebrow">Resume</p>
              <h3 style={{ margin: '0.7rem 0 0.6rem', fontSize: '1.5rem' }}>
                Download placeholder packet
              </h3>
              <p style={{ margin: 0, lineHeight: 1.8, color: 'var(--text-dim)' }}>
                A placeholder PDF is included now so the portfolio flow is
                complete and ready for real content later.
              </p>
              <div style={{ marginTop: '1rem' }}>
                <a className="outline-button" href={about.resumeUrl} download>
                  Download Resume
                </a>
              </div>
            </GlassCard>

            <GlassCard accent="var(--neptune-blue)" className="contact-animate">
              <p className="eyebrow">Socials</p>
              <p style={{ margin: '0.8rem 0 0', color: 'var(--text-dim)', lineHeight: 1.8 }}>
                Placeholder destinations are wired into the UI, ready to be
                swapped with your live profiles.
              </p>
              <div className="contact-socials">
                {about.socials.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.platform}
                  >
                    {SOCIAL_ICONS[social.icon]}
                  </a>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
