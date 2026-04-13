import { useEffect, useRef } from 'react';

export function useOrbitControls(containerRef, { enabled = false, onAngleChange }) {
  const isDraggingRef = useRef(false);
  const angleRef = useRef(0);
  const startXRef = useRef(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !enabled) {
      return undefined;
    }

    const updateAngle = (clientX) => {
      const delta = (clientX - startXRef.current) * 0.006;
      startXRef.current = clientX;
      angleRef.current += delta;
      onAngleChange?.(angleRef.current);
    };

    const handlePointerDown = (event) => {
      if (event.target instanceof Element) {
        const interactiveTarget = event.target.closest(
          'button, a, input, textarea, select'
        );

        if (interactiveTarget) {
          return;
        }
      }

      isDraggingRef.current = true;
      startXRef.current = event.clientX;
      element.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event) => {
      if (!isDraggingRef.current) {
        return;
      }

      updateAngle(event.clientX);
    };

    const handlePointerUp = (event) => {
      isDraggingRef.current = false;
      element.releasePointerCapture?.(event.pointerId);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        angleRef.current -= 0.2;
        onAngleChange?.(angleRef.current);
      }

      if (event.key === 'ArrowRight') {
        angleRef.current += 0.2;
        onAngleChange?.(angleRef.current);
      }
    };

    element.addEventListener('pointerdown', handlePointerDown);
    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', handlePointerUp);
    element.addEventListener('pointerleave', handlePointerUp);
    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('pointerdown', handlePointerDown);
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerup', handlePointerUp);
      element.removeEventListener('pointerleave', handlePointerUp);
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, enabled, onAngleChange]);

  return angleRef;
}
