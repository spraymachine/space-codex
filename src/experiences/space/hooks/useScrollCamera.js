import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollCamera(enabled = true) {
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      scrollProgressRef.current = 0;
      return undefined;
    }

    let trigger = null;
    const rafId = window.requestAnimationFrame(() => {
      trigger = ScrollTrigger.create({
        trigger: '#space-scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        },
      });
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      trigger?.kill();
    };
  }, [enabled]);

  return scrollProgressRef;
}
