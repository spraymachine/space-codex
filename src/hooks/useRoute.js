import { startTransition, useEffect, useState } from 'react';

const DEFAULT_ROUTE = '/';

function getHashRoute() {
  if (typeof window === 'undefined') {
    return DEFAULT_ROUTE;
  }

  const hash = window.location.hash.replace(/^#/, '');
  return hash || DEFAULT_ROUTE;
}

export function useRoute() {
  const [route, setRoute] = useState(getHashRoute);

  useEffect(() => {
    const handleHashChange = () => {
      startTransition(() => {
        setRoute(getHashRoute());
      });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path) => {
    if (window.location.hash === `#${path}`) {
      startTransition(() => {
        setRoute(path);
      });
      return;
    }

    window.location.hash = path;
  };

  return { route, navigate };
}
