'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import SpaceBackground from '@/components/PlanetBackground';
import MagneticButton from '@/components/MagneticButton';
import { Mail, Send } from 'lucide-react';

/* lucide-react no longer ships an Instagram glyph (trademark) — minimal
   inline replacement matching the same stroke style/weight. */
function InstagramIcon({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-7.914 1.174 4 4 0 0 1 7.914-1.174z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/* ─── shared animation variants ─────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: EASE },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.08 },
  }),
};

/* ─── reusable scroll-reveal wrapper ────────────────────────────── */
function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={delay}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
}

/* ─── data ───────────────────────────────────────────────────────── */
const caseStudies = [
  {
    name: 'Justyn AI',
    handle: '@justyn.ai',
    instagram: 'https://www.instagram.com/justyn.ai',
    detail:
      'An AI-focused creator sharing practical, hands-on knowledge with a growing audience. Worked together on turning that expertise into a structured educational product.',
    helpedWith: ['Course strategy', 'Course structure', 'Educational product packaging', 'Launch preparation'],
  },
  {
    name: 'Synsation',
    handle: '@synsation_',
    instagram: 'https://www.instagram.com/synsation_',
    detail:
      'A creator-led education project built around specialized, niche knowledge. Focused on shaping the content into a clear, sellable course experience.',
    helpedWith: ['Course structure', 'Product positioning', 'Educational product packaging', 'Launch preparation'],
  },
];

const principles = [
  { value: '0–500k', label: 'Follower range I work with: from early creators to established niche audiences.' },
  { value: '1st', label: 'Educational product: turning knowledge you already share into a course people can buy.' },
  { value: 'Full setup', label: 'Strategy, curriculum, production flow, sales funnel, launch, and technical implementation.' },
];

const steps = [
  { n: '01', title: 'Positioning',   desc: 'Clarify what your audience already trusts you for, and turn that into a course idea people can understand quickly.' },
  { n: '02', title: 'Offer',         desc: 'Shape the promise, audience, format, price logic, and outcome without overcomplicating the product.' },
  { n: '03', title: 'Structure',     desc: 'Turn your knowledge into lessons, modules, worksheets, and a student journey that feels useful.' },
  { n: '04', title: 'Launch Setup',  desc: 'Prepare the page, messaging, emails, content angles, and lightweight sales flow.' },
  { n: '05', title: 'Iteration',     desc: 'Use feedback from the first launch to improve the product before adding more complexity.' },
];

const notes = [
  'Most creators do not need a complicated funnel first. They need a clear promise, a useful product, and a simple path from content to course.',
  'If your videos, posts, tutorials, demos, threads, or lessons already help people understand something, the next product can be education.',
];

/* ─── nav link style ─────────────────────────────────────────────── */
const navLinkCls =
  'text-[13px] text-[#7A7A7A] hover:text-[#F0EFEA] transition-colors duration-200 tracking-wide';

/* ═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY  = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOp = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="relative min-h-screen text-[#F0EFEA]">

      {/* ── SPACE BG ─────────────────────────────────────────────── */}
      <SpaceBackground />

      {/* ── NAV ──────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          background: 'rgba(5,5,5,0.72)', borderBottom: '1px solid rgba(240,239,234,0.06)' }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-[56px] flex items-center justify-between">
          <span className="text-[13px] tracking-[0.14em] uppercase font-medium">
            cvoter developer
          </span>
          <nav className="hidden md:flex items-center gap-8">
            {['About', 'Process', 'Cases', 'Contact'].map(l => (
              <a key={l} href={l === 'Cases' ? '#cases' : `#${l.toLowerCase()}`} className={navLinkCls}>{l}</a>
            ))}
          </nav>
          <a
            href="#contact"
            className="text-[13px] border px-4 py-1.5 rounded-sm transition-all duration-200
              border-[rgba(240,239,234,0.18)] text-[#F0EFEA] hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
          >
            Let's Work Together
          </a>
        </div>
      </motion.header>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20 overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOp }}
          className="max-w-6xl mx-auto w-full"
        >
          <motion.p
            variants={fadeIn} initial="hidden" animate="visible" custom={0}
            className="text-[12px] tracking-[0.22em] uppercase text-[#4A6FA5] mb-8 font-mono"
          >
            Independent Course Specialist
          </motion.p>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-[clamp(48px,7.5vw,108px)] font-semibold tracking-[-0.035em] leading-[0.92] mb-8 max-w-4xl"
          >
            Turn what you know<br />
            into a course<br />
            <span className="text-[#C9A84C]">people can buy.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="text-[17px] text-[#7A7A7A] max-w-[500px] leading-[1.7] mb-12"
          >
            I help YouTubers, Instagram creators, TikTok creators, AI creators,
            educators, developers, and niche influencers turn knowledge they already
            share into online courses — whether they are starting from zero or already
            have a few hundred thousand followers.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="#contact" variant="solid">
              Let's Work Together
              <span className="opacity-50 text-[11px]">→</span>
            </MagneticButton>
            <MagneticButton href="#cases" variant="ghost">
              View Cases
              <span className="opacity-50 text-[11px]">↓</span>
            </MagneticButton>
          </motion.div>

          {/* mission coordinates */}
          <motion.div
            variants={fadeIn} initial="hidden" animate="visible" custom={8}
            className="absolute bottom-10 right-6 md:right-12 text-right hidden md:block"
          >
            <p className="text-[11px] font-mono text-[#7A7A7A] leading-relaxed opacity-50">
              LAT 37.3382° N<br />LONG 121.8863° W<br />ALT ∞
            </p>
          </motion.div>
        </motion.div>

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-10 bg-[rgba(240,239,234,0.12)]" />
          <span className="text-[10px] font-mono text-[#7A7A7A] tracking-[0.2em] uppercase">Scroll</span>
        </motion.div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────── */}
      <section id="about" className="relative py-32 px-6 md:px-12 border-t border-[rgba(240,239,234,0.06)]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[280px_1fr] gap-16 md:gap-24">
          <Reveal>
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#4A6FA5] font-mono mb-3">
              Philosophy
            </p>
            <div className="w-6 h-px bg-[#C9A84C] mb-6" />
            <p className="text-[13px] text-[#7A7A7A] leading-relaxed">
              Helping creators turn shared knowledge into a course before the idea gets buried under content calendars and platform noise.
            </p>
          </Reveal>

          <div>
            <Reveal delay={1}>
              <h2 className="text-[clamp(28px,4vw,48px)] font-semibold tracking-[-0.025em] leading-[1.1] mb-10">
                If people already learn from your content, you may already have the foundation for a course.
                <br />The next step is turning that knowledge into <span className="text-[#9EAAB8]">structured education.</span>
              </h2>
            </Reveal>
            <div className="space-y-5 text-[16px] text-[#7A7A7A] leading-[1.8] max-w-2xl">
              {[
                `I work with creators across YouTube, Instagram, TikTok, AI, education, development, and niche expert spaces — from people just starting to audiences around 500,000 followers.`,
                `The goal is simple: take what you already teach, explain, build, review, or demonstrate, then package it into a clear educational product.`,
                `I help with strategy, curriculum, production planning, sales pages, launch preparation, and the technical setup that makes the course feel real and trustworthy.`,
              ].map((p, i) => (
                <Reveal key={i} delay={i + 2}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────────── */}
      <section id="process" className="relative py-32 px-6 md:px-12 border-t border-[rgba(240,239,234,0.06)]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-20">
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#4A6FA5] font-mono mb-4">
              The Process
            </p>
            <h2 className="text-[clamp(28px,4vw,48px)] font-semibold tracking-[-0.025em] leading-[1.1]">
              A calm path from expertise to launch.
            </h2>
          </Reveal>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[19px] md:left-[27px] top-0 bottom-0 w-px bg-[rgba(240,239,234,0.06)]" />

            <div className="space-y-0">
              {steps.map((step, i) => (
                <Reveal key={step.n} delay={i} className="relative pl-14 md:pl-20 pb-14 last:pb-0">
                  {/* dot */}
                  <div className="absolute left-0 top-1 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center
                    border border-[rgba(240,239,234,0.1)] rounded-sm bg-[#050505]">
                    <span className="text-[11px] font-mono text-[#4A6FA5]">{step.n}</span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <h3 className="text-[22px] md:text-[28px] font-semibold tracking-[-0.02em] shrink-0">
                      {step.title}
                    </h3>
                    <p className="text-[15px] text-[#7A7A7A] leading-relaxed max-w-md">
                      {step.desc}
                    </p>
                  </div>

                  {i < steps.length - 1 && (
                    <div className="mt-6 ml-[-2px] text-[#4A6FA5] opacity-30 text-[11px] font-mono">↓</div>
                  )}
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={6} className="mt-20 md:ml-20">
            <div className="relative overflow-hidden border border-[rgba(240,239,234,0.10)] bg-[linear-gradient(135deg,rgba(240,239,234,0.075),rgba(74,111,165,0.055)_48%,rgba(5,5,5,0.78))] p-8 md:p-12 shadow-[0_30px_90px_-60px_rgba(158,170,184,0.55)]">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_80%_20%,rgba(201,168,76,0.16),transparent_34%)]" />
              <div className="relative grid md:grid-cols-[0.8fr_1.2fr] gap-8 md:gap-12 items-start">
                <p className="text-[11px] tracking-[0.22em] uppercase text-[#C9A84C] font-mono">
                  Done-for-you build
                </p>
                <div>
                  <h3 className="text-[clamp(28px,4vw,46px)] font-semibold tracking-[-0.035em] leading-[1.02] mb-6">
                    We handle everything for you.
                  </h3>
                  <p className="text-[16px] md:text-[17px] text-[#B8B8B2] leading-[1.75] max-w-2xl">
                    From course strategy and curriculum to production, sales funnel, launch and technical setup.
                    You keep creating content while we take care of building and launching your educational product.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CASE STUDIES ─────────────────────────────────────────── */}
      <section id="cases" className="relative py-24 px-6 md:px-12 border-t border-[rgba(240,239,234,0.06)]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-14">
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#4A6FA5] font-mono mb-4">
              Selected Projects
            </p>
            <h2 className="text-[clamp(28px,4vw,48px)] font-semibold tracking-[-0.025em] leading-[1.1] max-w-2xl">
              Small, focused projects — no inflated claims.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-px bg-[rgba(240,239,234,0.05)] border border-[rgba(240,239,234,0.05)]">
            {caseStudies.map((project, i) => (
              <Reveal key={project.name} delay={i}>
                <a
                  href={project.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-[#050505] p-8 md:p-10 min-h-[300px] flex flex-col justify-between hover:bg-[#0b0b0b] transition-all duration-500 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-[11px] tracking-[0.18em] uppercase text-[#7A7A7A] font-mono">
                        {project.handle}
                      </p>
                      <span className="text-[13px] text-[#4A6FA5] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Instagram ↗
                      </span>
                    </div>
                    <h3 className="text-[28px] md:text-[34px] font-semibold tracking-[-0.03em] mb-6 group-hover:text-[#C9A84C] transition-colors duration-300">
                      {project.name}
                    </h3>
                    <p className="text-[15px] text-[#7A7A7A] leading-[1.75] max-w-md">
                      {project.detail}
                    </p>
                  </div>
                  <div className="mt-10 flex flex-wrap gap-2">
                    {project.helpedWith.map(item => (
                      <span
                        key={item}
                        className="text-[11px] font-mono text-[#9EAAB8] border border-[rgba(158,170,184,0.22)] rounded-full px-3 py-1.5"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPROACH ─────────────────────────────────────────────── */}
      <section id="results" className="relative py-32 px-6 md:px-12 border-t border-[rgba(240,239,234,0.06)]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-20">
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#4A6FA5] font-mono mb-4">
              Who This Is For
            </p>
            <h2 className="text-[clamp(28px,4vw,48px)] font-semibold tracking-[-0.025em] leading-[1.1] max-w-2xl">
              For creators who are already sharing knowledge — even if the audience is small today.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-px bg-[rgba(240,239,234,0.05)] border border-[rgba(240,239,234,0.05)] mb-24">
            {principles.map(({ value, label }, i) => (
              <Reveal key={value} delay={i}>
                <div className="bg-[#050505] p-8 md:p-10 min-h-[220px] flex flex-col gap-5 hover:bg-[#0a0a0a] transition-colors duration-300">
                  <span className="text-[clamp(34px,4vw,54px)] font-semibold tracking-[-0.04em] leading-none text-[#F0EFEA]">
                    {value}
                  </span>
                  <span className="text-[14px] text-[#7A7A7A] leading-[1.7]">
                    {label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {notes.map((note, i) => (
              <Reveal key={note} delay={i * 2}>
                <div className="flex flex-col gap-7 border-t border-[rgba(240,239,234,0.08)] pt-8">
                  <p className="text-[18px] md:text-[20px] leading-[1.65] text-[#F0EFEA] font-light">
                    {note}
                  </p>
                  <div className="w-5 h-px bg-[#C9A84C]" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────── */}
      <section id="contact" className="relative py-32 px-6 md:px-12 border-t border-[rgba(240,239,234,0.06)]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[280px_1fr] gap-16 md:gap-24">
          <Reveal>
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#4A6FA5] font-mono mb-3">
              Contact
            </p>
            <div className="w-6 h-px bg-[#C9A84C] mb-6" />
            <p className="text-[13px] text-[#7A7A7A] leading-relaxed">
              Ready to turn what you already share into a course?
            </p>
          </Reveal>

          <div>
            <Reveal delay={1}>
              <h2 className="text-[clamp(28px,4.5vw,56px)] font-semibold tracking-[-0.03em] leading-[1.0] mb-5">
                Let&apos;s build something<br />
                <span className="text-[#9EAAB8]">that lasts.</span>
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="text-[16px] text-[#7A7A7A] mb-12 max-w-sm leading-relaxed">
                If your content already teaches, explains, demonstrates, or inspires, I can help you package it into a course people understand, trust, and want to buy.
              </p>
            </Reveal>

            <Reveal delay={3} className="mb-14">
              <MagneticButton href="mailto:cvoterok@gmail.com" variant="solid">
                Let's Work Together
                <span className="opacity-40 text-[11px]">→</span>
              </MagneticButton>
            </Reveal>

            <div className="flex flex-col gap-4">
              {[
                { label: 'Email',     value: 'cvoterok@gmail.com',   href: 'mailto:cvoterok@gmail.com',                Icon: Mail },
                { label: 'Telegram',  value: '@kvoter',               href: 'https://t.me/kvoter',                      Icon: Send },
                { label: 'Instagram', value: '@cvotercrypto',         href: 'https://instagram.com/cvotercrypto',       Icon: InstagramIcon },
              ].map(({ label, value, href, Icon }, i) => (
                <Reveal key={label} delay={i + 4}>
                  <a
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group border-b border-[rgba(240,239,234,0.05)] pb-4 hover:border-[rgba(201,168,76,0.25)] transition-colors duration-300"
                  >
                    <Icon className="w-4 h-4 text-[#7A7A7A] group-hover:text-[#C9A84C] transition-colors duration-300 shrink-0" strokeWidth={1.5} />
                    <span className="text-[14px] text-[#F0EFEA]">
                      <span className="text-[#9EAAB8]">{label}</span>
                      <span className="text-[#7A7A7A] mx-2">—</span>
                      <span className="group-hover:text-[#C9A84C] transition-colors duration-300">{value}</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-[rgba(240,239,234,0.06)] py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <span className="text-[12px] text-[#7A7A7A] font-mono">
            © {new Date().getFullYear()} cvoter developer
          </span>
          <span className="text-[12px] text-[#7A7A7A] font-mono">
            Independent Course Specialist
          </span>
        </div>
      </footer>

    </div>
  );
}
