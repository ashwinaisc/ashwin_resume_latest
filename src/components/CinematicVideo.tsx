'use client';
import { useEffect, useRef, useState } from 'react';
import { clamp } from '@/lib/motion';

export default function CinematicVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const readyRef = useRef(false);
  const pausedRef = useRef(false);
  const reducedRef = useRef(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let duration = 0, scroll = 0, progress = 0, dx = 0, dy = 0, tiltX = 0, tiltY = 0;
    let frame = 0;
    readyRef.current = false;
    currentRef.current = 0;
    targetRef.current = 0;
    const updateTarget = () => {
      targetRef.current = clamp(progress, 0, 1) * Math.max(0, duration - 0.04);
    };
    const measureScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      scroll = height > 0 ? clamp(window.scrollY / height, 0, 1) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${scroll})`;
    };
    const onScroll = () => {
      measureScroll();
      // The latest input controls the playhead, so either interaction can reach
      // the full clip. No primary-pointer media query can disable a real mouse.
      progress = scroll;
      updateTarget();
    };
    const onMove = (event: MouseEvent | PointerEvent) => {
      if ('pointerType' in event && event.pointerType === 'touch') return;
      if (reducedRef.current || pausedRef.current) return;
      const mouseX = clamp(event.clientX / window.innerWidth, 0, 1);
      const y = clamp(event.clientY / window.innerHeight, 0, 1);
      progress = mouseX;
      dx = mouseX - 0.5; dy = y - 0.5;
      if (glowRef.current) glowRef.current.style.background = `radial-gradient(ellipse at ${mouseX * 100}% ${y * 100}%, rgba(196,0,36,0.18), transparent 65%)`;
      updateTarget();
    };
    const initialize = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      duration = video.duration;
      if (!readyRef.current) {
        readyRef.current = true; currentRef.current = 0;
        video.pause();
        try { video.currentTime = 0; } catch {}
      }
      updateTarget();
    };
    const tick = () => {
      if (!document.hidden && !reducedRef.current && !pausedRef.current) {
        if (readyRef.current) {
          currentRef.current += (targetRef.current - currentRef.current) * 0.10;
          // Keep LERP running while the decoder is busy, but never cancel an
          // in-flight seek every animation frame. Compare against the actual
          // media playhead so rounded or failed seeks are retried automatically.
          // Metadata readiness is sufficient; do not gate on readyState >= 2.
          if (!video.seeking && Math.abs(currentRef.current - video.currentTime) > 0.001) {
            try { video.currentTime = currentRef.current; } catch {}
          }
        }
        tiltX += (dx - tiltX) * 0.08; tiltY += (dy - tiltY) * 0.08;
        if (sceneRef.current) sceneRef.current.style.transform = `scale(1.06) translate3d(${tiltX * -15}px, ${tiltY * -15}px, 0) rotateX(${tiltY * -2}deg) rotateY(${tiltX * 2}deg)`;
      }
      frame = requestAnimationFrame(tick);
    };
    const onPreference = () => {
      reducedRef.current = media.matches;
      setReducedMotion(media.matches);
      if (media.matches && sceneRef.current) sceneRef.current.style.transform = 'scale(1.06)';
    };
    // Native playback is never part of this effect, including browser restores.
    const ensurePaused = () => video.pause();
    const onResize = () => { measureScroll(); updateTarget(); };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.documentElement);
    video.addEventListener('loadedmetadata', initialize); video.addEventListener('canplay', initialize);
    video.addEventListener('play', ensurePaused);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize); media.addEventListener('change', onPreference);
    ensurePaused(); onPreference(); initialize(); onScroll(); frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame); resizeObserver.disconnect();
      video.removeEventListener('loadedmetadata', initialize); video.removeEventListener('canplay', initialize);
      video.removeEventListener('play', ensurePaused);
      window.removeEventListener('pointermove', onMove); window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize); media.removeEventListener('change', onPreference);
    };
  }, []);
  return <>
    <div className={`cinematic ${failed ? 'video-unavailable' : ''}`} aria-hidden="true">
      <div ref={sceneRef} className="cine-scene"><video ref={videoRef} src="/video/portfolio-background.mp4" playsInline muted preload="auto" onError={() => setFailed(true)} /></div>
      <div className="cine-shade" /><div className="cine-vignette" /><div ref={glowRef} id="cine-glow" className="cine-glow" /><div className="cine-grain" /><div className="cine-scan" />
    </div>
    <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
    {!failed && <button className="motion-switch" aria-pressed={paused || reducedMotion} disabled={reducedMotion} onClick={() => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); }}>{reducedMotion ? '◉ REDUCED MOTION' : paused ? '◉ MOTION PAUSED' : '◉ MOTION ON'}</button>}
  </>;
}
