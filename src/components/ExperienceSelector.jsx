const EXPERIENCES = [
  {
    route: '/space',
    title: 'Space Voyage',
    subtitle: 'Available now',
    description:
      'A cinematic solar-system portfolio with scroll-driven planets and a Saturn project orbit.',
    available: true,
  },
  {
    route: '/max',
    title: 'Maximalist',
    subtitle: 'Coming soon',
    description:
      'An expressive, editorial version for oversized motion, type, and experimentation.',
    available: false,
  },
  {
    route: '/min',
    title: 'Minimalist',
    subtitle: 'Coming soon',
    description:
      'A clean, distilled portfolio mode focused on speed, clarity, and essential storytelling.',
    available: false,
  },
];

export default function ExperienceSelector({ navigate }) {
  const handleSelect = (route, available) => {
    if (!available) {
      return;
    }

    localStorage.setItem('preferredExperience', route);
    navigate(route);
  };

  return (
    <main className="selector-shell">
      <div className="selector-backdrop" aria-hidden="true" />
      <header className="selector-header">
        <p className="eyebrow">Choose your route</p>
        <h1>Portfolio Experiences</h1>
        <p className="selector-copy">
          Start with the flagship voyage through the solar system, or preview
          the future modes waiting on the launchpad.
        </p>
      </header>

      <section className="selector-grid" aria-label="Experience selector">
        {EXPERIENCES.map((experience) => (
          <article
            key={experience.route}
            className={`glass selector-card${
              experience.available ? ' selector-card-active' : ''
            }`}
          >
            {experience.route === '/space' && (
              <div className="selector-stars" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            )}

            <p className="selector-status">{experience.subtitle}</p>
            <h2>{experience.title}</h2>
            <p>{experience.description}</p>
            <button
              className={experience.available ? 'primary-button' : 'outline-button'}
              onClick={() => handleSelect(experience.route, experience.available)}
              disabled={!experience.available}
            >
              {experience.available ? 'Launch Experience' : 'In Development'}
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
