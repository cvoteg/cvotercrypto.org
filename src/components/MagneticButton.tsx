'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'solid' | 'ghost';
  className?: string;
  target?: string;
  rel?: string;
  strength?: number;
}

/**
 * Premium magnetic CTA.
 * - Follows the cursor with a smooth spring while hovered.
 * - Inner label counter-parallaxes slightly for depth.
 * - Tactile press (scale down) + satisfying hover scale.
 * - Elegant border-sweep highlight on the ghost variant.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  className = '',
  target,
  rel,
  strength = 0.4,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springCfg = { stiffness: 180, damping: 20, mass: 0.45 };
  const sx = useSpring(x, springCfg);
  const sy = useSpring(y, springCfg);
  const rot = useTransform(sx, (v) => Math.max(-0.7, Math.min(0.7, v * 0.015)));

  const lx = useTransform(sx, (v) => v * 0.22);
  const ly = useTransform(sy, (v) => v * 0.22);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    'relative inline-flex items-center justify-center gap-3 text-[14px] font-medium select-none rounded-full px-8 py-4 will-change-transform outline-none focus-visible:ring-2 focus-visible:ring-[#9EAAB8]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]';

  const variants: Record<string, string> = {
    solid:
      'bg-[#F0EFEA] text-[#050505] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),inset_0_-10px_18px_rgba(0,0,0,0.08),0_14px_38px_-20px_rgba(240,239,234,0.5)]',
    ghost:
      'text-[#F0EFEA] border border-[rgba(240,239,234,0.18)] bg-[rgba(240,239,234,0.025)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_30px_-22px_rgba(240,239,234,0.35)] overflow-hidden',
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy, rotate: rot }}
      whileHover={{
        scale: 1.035,
        y: -2,
        boxShadow:
          variant === 'solid'
            ? 'inset 0 1px 0 rgba(255,255,255,0.84), inset 0 -10px 18px rgba(0,0,0,0.08), 0 22px 58px -24px rgba(240,239,234,0.58)'
            : 'inset 0 1px 0 rgba(255,255,255,0.12), 0 20px 52px -26px rgba(158,170,184,0.42)',
      }}
      whileTap={{ scale: 0.965, y: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 24, mass: 0.45 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {/* border sweep for ghost */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          background:
            variant === 'solid'
              ? 'linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.36) 44%, transparent 58%)'
              : 'radial-gradient(120px circle at 50% 50%, rgba(74,111,165,0.14), transparent 64%)',
        }}
      />
      <motion.span style={{ x: lx, y: ly }} className="relative flex items-center gap-3">
        {children}
      </motion.span>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} className="inline-block">
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block bg-transparent border-0 p-0">
      {content}
    </button>
  );
}
