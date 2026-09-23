'use client';
import { useEffect, type ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;
    let frame = 0;
    const tick = (time: number) => { lenis?.raf(time); frame = requestAnimationFrame(tick); };
    const setup = () => {
      cancelAnimationFrame(frame); lenis?.destroy(); lenis = null;
      if (!media.matches) { lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false }); frame = requestAnimationFrame(tick); }
    };
    const anchor = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || !lenis || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const id = link.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -100, onComplete: () => {
        history.replaceState(null, '', `#${id}`);
        target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
      } });
    };
    setup(); media.addEventListener('change', setup); document.addEventListener('click', anchor);
    return () => { cancelAnimationFrame(frame); lenis?.destroy(); media.removeEventListener('change', setup); document.removeEventListener('click', anchor); };
  }, []);
  return children;
}
