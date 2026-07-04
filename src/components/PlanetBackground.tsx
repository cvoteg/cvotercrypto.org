'use client';

import { useEffect, useRef } from 'react';

interface Star { x: number; y: number; r: number; a: number; spd: number; ph: number; }
interface Dust { x: number; y: number; vx: number; vy: number; life: number; }
interface ShootingStar { x: number; y: number; vx: number; vy: number; life: number; }

type PlanetKind = 'rocky' | 'icy' | 'gas' | 'ringed' | 'moon' | 'distant';

type PlanetFlight = {
  kind: PlanetKind;
  depth: 'far' | 'mid' | 'near';
  start: [number, number];
  mid: [number, number];
  end: [number, number];
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  opacity: number;
  blur: number;
};

const PLANETS: PlanetFlight[] = [
  { kind: 'ringed', depth: 'near', start: [112, 18], mid: [78, 32], end: [-28, 62], size: 300, duration: 58, delay: 0, rotate: -18, opacity: 0.28, blur: 0 },
  { kind: 'icy', depth: 'far', start: [-18, 18], mid: [38, 16], end: [118, 24], size: 150, duration: 72, delay: 13, rotate: 16, opacity: 0.22, blur: 1.3 },
  { kind: 'gas', depth: 'mid', start: [116, 74], mid: [68, 64], end: [-20, 48], size: 230, duration: 66, delay: 28, rotate: 24, opacity: 0.26, blur: 0.6 },
  { kind: 'moon', depth: 'far', start: [86, -14], mid: [58, 18], end: [14, 112], size: 92, duration: 52, delay: 43, rotate: -10, opacity: 0.18, blur: 1.8 },
  { kind: 'rocky', depth: 'near', start: [-26, 66], mid: [24, 54], end: [126, 36], size: 250, duration: 64, delay: 57, rotate: 14, opacity: 0.25, blur: 0 },
  { kind: 'distant', depth: 'far', start: [108, 6], mid: [66, 14], end: [-16, 20], size: 110, duration: 84, delay: 73, rotate: 8, opacity: 0.16, blur: 2.2 },
];

const DEPTH = {
  far: { mouse: 0.006, scroll: 0.015 },
  mid: { mouse: 0.014, scroll: 0.04 },
  near: { mouse: 0.026, scroll: 0.075 },
} as const;

export default function PlanetBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pointer = useRef({ x: -9999, y: -9999, sx: 0, sy: 0, active: false });
  const scrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    const dust: Dust[] = [];
    const shooting: ShootingStar[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.round((w * h) / 13500) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1 + 0.25,
        a: Math.random() * 0.32 + 0.12,
        spd: Math.random() * 0.45 + 0.12,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    const onMove = (e: MouseEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      pointer.current.active = true;
      if (!reduce && Math.random() > 0.78) {
        dust.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          life: 1,
        });
        if (dust.length > 16) dust.shift();
      }
    };

    const spawnShooting = () => {
      if (reduce) return;
      shooting.push({
        x: -80,
        y: Math.random() * h * 0.36,
        vx: 6 + Math.random() * 3,
        vy: 1.4 + Math.random() * 1.8,
        life: 1,
      });
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', () => { pointer.current.active = false; });

    let shootingTimer = window.setTimeout(function loop() {
      spawnShooting();
      shootingTimer = window.setTimeout(loop, 12000 + Math.random() * 12000);
    }, 7000);

    let t = 0;
    let raf = 0;
    const render = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const twinkle = reduce ? s.a : s.a + Math.sin(t * s.spd + s.ph) * 0.16;
        ctx.globalAlpha = Math.max(0.03, Math.min(0.55, twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = '#F0EFEA';
        ctx.fill();
      }

      for (let i = dust.length - 1; i >= 0; i--) {
        const p = dust[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        if (p.life <= 0) {
          dust.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life * 0.22;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1 * p.life + 0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#9EAAB8';
        ctx.fill();
      }

      for (let i = shooting.length - 1; i >= 0; i--) {
        const sh = shooting[i];
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life -= 0.008;
        if (sh.life <= 0 || sh.x > w + 100) {
          shooting.splice(i, 1);
          continue;
        }
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - 86, sh.y - 24);
        grad.addColorStop(0, 'rgba(240,239,234,0.62)');
        grad.addColorStop(1, 'rgba(240,239,234,0)');
        ctx.globalAlpha = sh.life;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - 86, sh.y - 24);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(shootingTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onMove = (e: MouseEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      pointer.current.active = true;
    };
    const onScroll = () => { scrollY.current = window.scrollY; };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    let raf = 0;
    const tick = () => {
      pointer.current.sx += (pointer.current.x - pointer.current.sx) * 0.045;
      pointer.current.sy += (pointer.current.y - pointer.current.sy) * 0.045;
      const nx = pointer.current.sx - window.innerWidth / 2;
      const ny = pointer.current.sy - window.innerHeight / 2;

      planetRefs.current.forEach((el, index) => {
        if (!el) return;
        const planet = PLANETS[index];
        const depth = DEPTH[planet.depth];
        el.style.setProperty('--px', `${reduce ? 0 : nx * depth.mouse}px`);
        el.style.setProperty('--py', `${reduce ? 0 : ny * depth.mouse - scrollY.current * depth.scroll}px`);
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{
        background:
          'radial-gradient(120% 100% at 50% 120%, rgba(74,111,165,0.18), rgba(10,10,14,0.92) 48%, #050505 72%),' +
          'radial-gradient(80% 60% at 70% 20%, rgba(201,168,76,0.06), transparent 55%),' +
          '#050505',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 44% at 58% 18%, rgba(74,111,165,0.075), transparent 62%),' +
            'radial-gradient(50% 42% at 86% 88%, rgba(201,168,76,0.035), transparent 66%)',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />

      {PLANETS.map((planet, index) => (
        <div
          key={`${planet.kind}-${index}`}
          ref={(el) => { planetRefs.current[index] = el; }}
          className="planet-flight absolute left-0 top-0"
          style={{
            ['--sx' as string]: `${planet.start[0]}vw`,
            ['--sy' as string]: `${planet.start[1]}vh`,
            ['--mx' as string]: `${planet.mid[0]}vw`,
            ['--my' as string]: `${planet.mid[1]}vh`,
            ['--ex' as string]: `${planet.end[0]}vw`,
            ['--ey' as string]: `${planet.end[1]}vh`,
            ['--size' as string]: `${planet.size}px`,
            ['--dur' as string]: `${planet.duration}s`,
            ['--delay' as string]: `${planet.delay}s`,
            ['--rot' as string]: `${planet.rotate}deg`,
            ['--opacity' as string]: planet.opacity,
            ['--blur' as string]: `${planet.blur}px`,
          }}
        >
          <div className={`planet-render planet-${planet.kind}`} />
        </div>
      ))}
    </div>
  );
}
