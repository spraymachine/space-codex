import { lazy, Suspense } from 'react';
import { useRoute } from './hooks/useRoute';

const SpaceExperience = lazy(() =>
  import('./experiences/space/SpaceExperience')
);
const ExperienceSelector = lazy(() =>
  import('./components/ExperienceSelector')
);

const DEV_DEFAULT_EXPERIENCE = '/space';

function LoadingScreen() {
  return (
    <div className="app-loading-screen" aria-live="polite">
      <p className="font-mono">Calibrating star charts...</p>
    </div>
  );
}

function ComingSoonScreen({ title, navigate }) {
  return (
    <main className="app-placeholder-screen">
      <div className="glass app-placeholder-card">
        <p className="eyebrow">Future Experience</p>
        <h1>{title}</h1>
        <p>
          This alternate portfolio mode is reserved for a later launch. The
          space experience is ready right now.
        </p>
        <button className="ghost-button" onClick={() => navigate('/space')}>
          Enter Space
        </button>
      </div>
    </main>
  );
}

export default function App() {
  const { route, navigate } = useRoute();

  const effectiveRoute =
    route === '/' && DEV_DEFAULT_EXPERIENCE ? DEV_DEFAULT_EXPERIENCE : route;

  return (
    <Suspense fallback={<LoadingScreen />}>
      {effectiveRoute === '/' && <ExperienceSelector navigate={navigate} />}
      {effectiveRoute === '/space' && <SpaceExperience navigate={navigate} />}
      {effectiveRoute === '/max' && (
        <ComingSoonScreen title="Maximalist Mode" navigate={navigate} />
      )}
      {effectiveRoute === '/min' && (
        <ComingSoonScreen title="Minimalist Mode" navigate={navigate} />
      )}
      {!['/', '/space', '/max', '/min'].includes(effectiveRoute) && (
        <ComingSoonScreen title="Route Not Found" navigate={navigate} />
      )}
    </Suspense>
  );
}
