export default function SkillPill({ name, accent = 'rgba(255,255,255,0.16)' }) {
  return (
    <span
      className="font-mono"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: '2rem',
        padding: '0.45rem 0.8rem',
        borderRadius: '999px',
        border: `1px solid ${accent}`,
        background: 'rgba(255,255,255,0.03)',
        color: 'var(--star-white)',
        fontSize: '0.72rem',
        letterSpacing: '0.08em',
      }}
    >
      {name}
    </span>
  );
}
