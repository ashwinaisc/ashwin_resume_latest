'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import type { Metric, Profile } from '@/data/types';
import Magnetic from '@/components/Magnetic';

function Counter({ metric }: { metric: Metric }) {
  const [value, setValue] = useState(metric.value);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      const start = performance.now();
      const tick = (time: number) => { const progress = Math.min((time - start) / 1100, 1); setValue(metric.value * (1 - Math.pow(1 - progress, 3))); if (progress < 1) frame = requestAnimationFrame(tick); };
      frame = requestAnimationFrame(tick); observer.disconnect();
    });
    if (ref.current) observer.observe(ref.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [metric.value]);
  return <div className="metric" ref={ref} aria-label={`${metric.value}${metric.suffix ?? ''} ${metric.label}`}><strong aria-hidden="true">{value.toFixed(metric.decimals ?? 0).padStart(2, '0')}<span>{metric.suffix}</span></strong><span aria-hidden="true">{metric.label}</span></div>;
}
export default function Hero({ profile }: { profile: Profile }) {
  return <section id="home" className="hero">
    <div className="hero-watermark" aria-hidden="true">{profile.firstName}</div>
    <div className="hero-content"><div className="eyebrow hero-eyebrow"><span className="status-dot" />01 / UI/UX DESIGN & FRONTEND</div>
      <p className="hero-intro">{profile.name.toUpperCase()} <span>— DESIGNER. DEVELOPER. THINKER.</span></p>
      <h1><span>BUILDING IDEAS</span><span className="gradient-text">INTO EXPERIENCES<span className="neon-period">.</span></span></h1>
      <p className="hero-description">At the intersection of design, code and storytelling.<br />I create digital experiences that look sharp.<br className="desktop-break" /> And work beautifully.</p>
      <div className="hero-actions"><Magnetic><a className="button primary" href="#projects">EXPLORE WORK <ArrowUpRight size={19} /></a></Magnetic><Magnetic><a className="button secondary" href={profile.resumeUrl} download>DOWNLOAD RÉSUMÉ <Download size={17} /></a></Magnetic></div>
      <div className="hero-metrics">{profile.metrics.map(metric => <Counter key={metric.label} metric={metric} />)}</div>
    </div>
    <div className="hero-coordinate" aria-hidden="true"><span>DESIGN × TECHNOLOGY</span><span>EST. 2015 — ALWAYS EVOLVING</span></div>
    <div className="hero-footer"><a href="#about" className="scroll-cue"><span className="scroll-icon"><ArrowDown size={16} /></span>SCROLL TO DISCOVER</a><span className="location-label">INDIA <span className="red">↔</span> IRELAND</span>{profile.available && <span className="availability"><span className="status-dot" />OPEN TO OPPORTUNITIES</span>}</div>
  </section>;
}
