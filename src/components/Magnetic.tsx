'use client';
import { useRef, type ReactNode } from 'react';

export default function Magnetic({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  return <span ref={ref} className={`magnetic ${className}`} data-magnetic
    onPointerMove={event => {
      if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches || !ref.current) return;
      const rect = event.currentTarget.getBoundingClientRect();
      ref.current.style.transform = `translate3d(${(event.clientX - rect.left - rect.width / 2) * 0.12}px, ${(event.clientY - rect.top - rect.height / 2) * 0.12}px, 0)`;
    }} onPointerLeave={() => { if (ref.current) ref.current.style.transform = ''; }}>{children}</span>;
}
