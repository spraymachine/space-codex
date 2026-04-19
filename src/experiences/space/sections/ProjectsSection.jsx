import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlassCard from '../../../components/shared/GlassCard';
import SkillPill from '../../../components/shared/SkillPill';
import { projects } from '../data/projects';
import { useOrbitControls } from '../hooks/useOrbitControls';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection({
  onOrbitStateChange,
  reducedMotion = false,
}) {
  const sectionRef = useRef(null);
  const orbitRef = useRef(null);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const deferredProject = useDeferredValue(selectedProject);

  useOrbitControls(orbitRef, {
    enabled: isOrbiting && !selectedProject && !reducedMotion,
    onAngleChange: setOrbitAngle,
  });

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: reducedMotion ? false : 0.3,
      onEnter: () => setIsOrbiting(true),
      onEnterBack: () => setIsOrbiting(true),
      onLeave: () => {
        setIsOrbiting(false);
        setSelectedProject(null);
      },
      onLeaveBack: () => {
        setIsOrbiting(false);
        setSelectedProject(null);
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  useEffect(() => {
    onOrbitStateChange?.({
      active: isOrbiting && !reducedMotion,
      angle: orbitAngle,
      focused: Boolean(selectedProject),
    });
  }, [isOrbiting, onOrbitStateChange, orbitAngle, reducedMotion, selectedProject]);

  useEffect(() => {
    return () => {
      onOrbitStateChange?.({
        active: false,
        angle: 0,
        focused: false,
      });
    };
  }, [onOrbitStateChange]);

  const getNodePlacement = (project, index) => {
    const baseAngle = (index / projects.length) * Math.PI * 2 + orbitAngle;
    const radius = 31 + project.orbitRadius * 7;
    const x = 50 + Math.cos(baseAngle) * radius;
    const y = 50 + Math.sin(baseAngle) * radius * 0.36;
    const frontFactor = (Math.sin(baseAngle) + 1) / 2;
    const scale = 0.72 + frontFactor * 0.58;
    const opacity = 0.32 + frontFactor * 0.68;

    return {
      x,
      y,
      scale,
      opacity,
      zIndex: Math.round(frontFactor * 20),
    };
  };

  const handleSelect = (project) => {
    setSelectedProject(project);
    window.navigator.vibrate?.(12);
  };

  return (
    <section
      ref={sectionRef}
      className="space-section"
      id="projects"
      aria-label="Projects"
      style={{ overflow: 'hidden' }}
    >
      <div className="section-shell project-orbit-shell" style={{ minHeight: '100%', width: '100%' }}>
        <div
          style={{
            position: 'absolute',
            top: 'clamp(1rem, 4vh, 2rem)',
            left: 'clamp(1rem, 4vw, 2rem)',
            zIndex: 6,
            width: 'min(100%, 26rem)',
          }}
        >
          <p className="eyebrow" style={{ color: 'var(--saturn-gold)' }}>
            Saturn / Projects
          </p>
          <h2
            style={{
              margin: '0.6rem 0 0.8rem',
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.05em',
            }}
          >
            Orbital works.
          </h2>
          <p style={{ margin: 0, color: 'var(--text-dim)', lineHeight: 1.7, maxWidth: '18rem' }}>
            Drag the ring. Select a mission. Scroll onward.
          </p>
        </div>

        <div
          ref={orbitRef}
          tabIndex={0}
          aria-label="Project orbit interaction zone"
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            cursor: isOrbiting && !selectedProject ? 'grab' : 'default',
            touchAction: 'none',
            outline: 'none',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '14% 12%',
              borderRadius: '50%',
              border: '1px dashed rgba(234, 214, 166, 0.12)',
              filter: 'blur(0.2px)',
            }}
          />

          {!selectedProject && (
            <p
              className="font-mono"
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 'clamp(1.5rem, 4vh, 2.5rem)',
                transform: 'translateX(-50%)',
                margin: 0,
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--text-dim)',
                zIndex: 5,
                textAlign: 'center',
              }}
            >
              {reducedMotion
                ? 'Tap a mission to inspect it.'
                : 'Drag to orbit. Tap to inspect.'}
            </p>
          )}

          {projects.map((project, index) => {
            const placement = getNodePlacement(project, index);

            return (
              <button
                key={project.id}
                type="button"
                aria-label={`View project: ${project.name}`}
                onClick={() => handleSelect(project)}
                onPointerDown={(event) => event.stopPropagation()}
                onPointerUp={(event) => {
                  event.stopPropagation();
                  handleSelect(project);
                }}
                style={{
                  position: 'absolute',
                  left: `${placement.x}%`,
                  top: `${placement.y}%`,
                  transform: `translate(-50%, -50%) scale(${placement.scale})`,
                  zIndex: placement.zIndex,
                  opacity:
                    selectedProject && selectedProject.id !== project.id
                      ? placement.opacity * 0.35
                      : placement.opacity,
                  background: 'transparent',
                  border: 'none',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.55rem',
                  color: 'inherit',
                  cursor: 'pointer',
                  transition: 'opacity 220ms ease, transform 220ms ease',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 'clamp(2.5rem, 4vw, 3.2rem)',
                    height: 'clamp(2.5rem, 4vw, 3.2rem)',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 35% 30%, #ffffff, ${project.color})`,
                    boxShadow: `0 0 22px ${project.color}66, 0 0 44px ${project.color}22`,
                  }}
                />
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.66rem',
                    letterSpacing: '0.1em',
                    textShadow: '0 0 12px rgba(0,0,0,0.9)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {project.name}
                </span>
              </button>
            );
          })}
        </div>

        {deferredProject && (
          <aside className="project-detail-panel" role="dialog" aria-modal="false">
            <GlassCard accent={deferredProject.color}>
              <button
                type="button"
                aria-label="Close project detail panel"
                onClick={() => setSelectedProject(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '2.4rem',
                  height: '2.4rem',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--star-white)',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>

              <p className="eyebrow" style={{ color: deferredProject.color }}>
                Project Focus
              </p>
              <h3
                style={{
                  margin: '0.7rem 0 0.4rem',
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                }}
              >
                {deferredProject.name}
              </h3>
              <p style={{ margin: 0, color: 'var(--text-dim)', lineHeight: 1.75 }}>
                {deferredProject.description}
              </p>

              <div
                className="project-screenshot"
                style={{
                  background: `linear-gradient(135deg, ${deferredProject.color}44, rgba(255,255,255,0.03))`,
                }}
              >
                <span className="font-mono" style={{ color: 'var(--text-dim)' }}>
                  Screenshot Placeholder
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {deferredProject.techStack.map((tech) => (
                  <SkillPill key={tech} name={tech} accent={deferredProject.color} />
                ))}
              </div>

              <div className="project-links">
                <a
                  className="primary-button"
                  href={deferredProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Live
                </a>
                <a
                  className="outline-button"
                  href={deferredProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </div>
            </GlassCard>
          </aside>
        )}
      </div>
    </section>
  );
}
