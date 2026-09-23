'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
const links = [['about', 'About'], ['projects', 'Work'], ['experience', 'Journey'], ['certifications', 'Credentials'], ['skills', 'Skills']];

export default function Navbar({ firstName }: { firstName: string }) {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    drawerRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); }
      if (event.key === 'Tab') {
        const nodes = [buttonRef.current, ...Array.from(drawerRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])].filter(Boolean) as HTMLElement[];
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [open]);
  return <header className="nav-shell"><nav className="navbar" aria-label="Main navigation">
    <a className="brand" href="#home" aria-label={`${firstName} home`}>{firstName}<span>.</span></a>
    <div className="nav-links">{links.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>
      {active === id && <motion.span className="nav-pill" layoutId="nav-pill" transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 32 }} />}<span>{label}</span>
    </a>)}</div>
    <a href="#contact" className="nav-contact" data-magnetic>Let’s talk <ArrowUpRight size={15} /></a>
    <button ref={buttonRef} className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    {open && <div id="mobile-nav" ref={drawerRef} className="mobile-nav">{[...links, ['contact', 'Contact']].map(([id, label], i) => <a href={`#${id}`} key={id} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}<ArrowUpRight size={20} /></a>)}</div>}
  </nav></header>;
}
