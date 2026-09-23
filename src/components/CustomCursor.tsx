'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const query = matchMedia('(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)');
    const ring = ringRef.current, dot = dotRef.current;
    if (!ring || !dot) return;
    let frame = 0, x = -100, y = -100, rx = -100, ry = -100, active = false;
    const move = (event: PointerEvent) => {
      x = event.clientX; y = event.clientY;
      ring.style.opacity = '1'; dot.style.opacity = '1';
      active = !!(event.target as HTMLElement).closest('[data-magnetic], a, button, input, textarea');
    };
    const leave = () => { ring.style.opacity = '0'; dot.style.opacity = '0'; };
    const tick = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${active ? 1.65 : 1})`;
      dot.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      frame = requestAnimationFrame(tick);
    };
    const setup = () => {
      cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave);
      leave();
      if (query.matches) { window.addEventListener('pointermove', move, { passive: true }); document.addEventListener('pointerleave', leave); frame = requestAnimationFrame(tick); }
    };
    setup(); query.addEventListener('change', setup);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); query.removeEventListener('change', setup); };
  }, []);
  return <><div ref={ringRef} className="cursor-ring" aria-hidden="true" /><div ref={dotRef} className="cursor-dot" aria-hidden="true" /></>;
}
