import { useState } from 'react';

export default function GlassCard({
  children,
  accent,
  className = '',
  style = {},
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`glass ${className}`.trim()}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(1.15rem, 2vw, 1.6rem)',
        borderColor: hovered && accent ? accent : undefined,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition:
          'transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease',
        boxShadow: hovered
          ? '0 28px 70px rgba(0, 0, 0, 0.45)'
          : '0 20px 56px rgba(0, 0, 0, 0.34)',
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {accent && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-30% auto auto -10%',
            width: '12rem',
            height: '12rem',
            borderRadius: '50%',
            background: accent,
            opacity: hovered ? 0.18 : 0.1,
            filter: 'blur(40px)',
            pointerEvents: 'none',
            transition: 'opacity 220ms ease',
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}
