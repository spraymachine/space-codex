import { useCallback, useEffect, useRef, useState } from 'react';

const PARTICLE_COUNT = 220;
const FULL_DURATION = 3600;
const QUICK_DURATION = 850;

function getSessionFlag() {
  try {
    return window.sessionStorage.getItem('bigBangPlayed') === 'true';
  } catch {
    return false;
  }
}

function setSessionFlag() {
  try {
    window.sessionStorage.setItem('bigBangPlayed', 'true');
  } catch {
    // Ignore storage failures in privacy-restricted environments.
  }
}

export default function BigBang({ onComplete }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const [visible, setVisible] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [alreadyPlayed] = useState(getSessionFlag);

  const finish = useCallback(() => {
    window.cancelAnimationFrame(rafRef.current);
    setSessionFlag();
    setVisible(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) {
      return undefined;
    }

    const ctx = canvas.getContext('2d');
    const duration = alreadyPlayed ? QUICK_DURATION : FULL_DURATION;
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 7.5;
      return {
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.8 + 1,
        seed: index * 0.73,
        targetX:
          window.innerWidth * 0.5 +
          Math.cos(index * 1.618 + index * 0.37) *
            (window.innerWidth * (0.16 + Math.random() * 0.42)),
        targetY:
          window.innerHeight * 0.5 +
          Math.sin(index * 1.213 + index * 0.41) *
            (window.innerHeight * (0.14 + Math.random() * 0.35)),
        color:
          index % 4 === 0 ? '#ffd700' : index % 5 === 0 ? '#ff8a33' : '#ffffff',
      };
    });

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    let skipTimer = 0;
    if (!alreadyPlayed) {
      skipTimer = window.setTimeout(() => setShowSkip(true), 1000);
    }

    const start = performance.now();

    const draw = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      if (alreadyPlayed) {
        ctx.fillStyle = `rgba(0, 0, 0, ${1 - progress})`;
        ctx.fillRect(0, 0, width, height);

        if (progress >= 1) {
          finish();
          return;
        }

        rafRef.current = window.requestAnimationFrame(draw);
        return;
      }

      if (progress < 0.16) {
        const pulse = 1 + Math.sin(elapsed * 0.022) * 0.35;
        const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 90);
        glow.addColorStop(0, 'rgba(255,255,255,0.95)');
        glow.addColorStop(0.15, 'rgba(255,215,0,0.65)');
        glow.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 55 * pulse, 0, Math.PI * 2);
        ctx.fill();
      } else if (progress < 0.46) {
        const explodeProgress = (progress - 0.16) / 0.3;

        if (explodeProgress < 0.18) {
          const flashAlpha = (1 - explodeProgress / 0.18) * 0.84;
          ctx.fillStyle = `rgba(255,248,220,${flashAlpha})`;
          ctx.fillRect(0, 0, width, height);
        }

        particles.forEach((particle) => {
          const distance = explodeProgress * 110;
          particle.x = centerX + particle.vx * distance;
          particle.y = centerY + particle.vy * distance;
          const alpha = 1 - explodeProgress * 0.4;

          ctx.globalAlpha = alpha;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(
            particle.x,
            particle.y,
            particle.size * (1 - explodeProgress * 0.35),
            0,
            Math.PI * 2
          );
          ctx.fill();
        });
      } else {
        const settleProgress = (progress - 0.46) / 0.54;
        particles.forEach((particle) => {
          const startX = centerX + particle.vx * 110;
          const startY = centerY + particle.vy * 110;
          const currentX = startX + (particle.targetX - startX) * settleProgress;
          const currentY = startY + (particle.targetY - startY) * settleProgress;

          ctx.globalAlpha = Math.max(0, 0.8 - settleProgress * 0.78);
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(currentX, currentY, particle.size * 0.44, 0, Math.PI * 2);
          ctx.fill();
        });

        const veilAlpha = Math.max(0, settleProgress - 0.7) / 0.3;
        if (veilAlpha > 0) {
          ctx.globalAlpha = veilAlpha;
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, width, height);
        }
      }

      ctx.globalAlpha = 1;

      if (progress >= 1) {
        finish();
        return;
      }

      rafRef.current = window.requestAnimationFrame(draw);
    };

    rafRef.current = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.clearTimeout(skipTimer);
      window.removeEventListener('resize', resize);
    };
  }, [alreadyPlayed, finish, visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
      {!alreadyPlayed && showSkip && (
        <button
          className="outline-button font-mono"
          style={{
            position: 'absolute',
            right: 'clamp(1rem, 4vw, 2rem)',
            bottom: 'clamp(1rem, 4vh, 2rem)',
            fontSize: '0.68rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
          onClick={finish}
        >
          Skip Intro
        </button>
      )}
    </div>
  );
}
