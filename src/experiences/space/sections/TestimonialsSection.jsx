import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlassCard from '../../../components/shared/GlassCard';
import { testimonials } from '../data/testimonials';

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonial-card',
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.72,
          stagger: 0.14,
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
      className="space-section"
      id="testimonials"
      aria-label="Testimonials"
    >
      <div className="section-shell">
        <div className="section-head">
          <p className="eyebrow" style={{ color: 'var(--uranus-teal)' }}>
            Uranus / Testimonials
          </p>
          <h2>Signals from past collaborators.</h2>
          <p>
            Out past Saturn, the tone shifts colder and quieter. This section
            carries other people&apos;s words instead of mine.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {testimonials.map((testimonial) => (
            <GlassCard
              key={testimonial.id}
              accent="var(--uranus-teal)"
              className="testimonial-card"
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '1.04rem',
                  lineHeight: 1.9,
                  color: 'rgba(232,244,248,0.88)',
                }}
              >
                “{testimonial.quote}”
              </p>
              <div style={{ marginTop: '1.1rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>
                  {testimonial.name}
                </strong>
                <span className="eyebrow" style={{ color: 'var(--text-dim)' }}>
                  {testimonial.role}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
