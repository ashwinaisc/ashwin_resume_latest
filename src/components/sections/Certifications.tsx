'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Fingerprint, GraduationCap, MoveHorizontal, ShieldCheck, X } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { clamp, frontIndex, shortestDelta } from '@/lib/motion';
import type { Certification } from '@/data/types';

export default function Certifications({ certifications }: { certifications: Certification[] }) {
  const count = certifications.length;
  const step = count ? 360 / count : 360;
  const sectionRef = useRef<HTMLElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const angleRef = useRef(0), velocityRef = useRef(0), targetRef = useRef<number | null>(null);
  const draggingRef = useRef(false), autoRef = useRef(true), focusRef = useRef(false), modalRef = useRef(false);
  const reducedRef = useRef(false), visibleRef = useRef(false), idleUntilRef = useRef(0);
  const samplesRef = useRef<{ x: number; time: number }[]>([]);
  const gestureRef = useRef({ x: 0, y: 0, lastX: 0, moved: false, card: -1, pointer: -1 });
  const [radius, setRadius] = useState(480);
  const [front, setFront] = useState(0);
  const frontRef = useRef(0);
  const keyboardFocusRef = useRef(false);
  const [auto, setAuto] = useState(true);
  const [selected, setSelected] = useState<Certification | null>(null);
  const [digest, setDigest] = useState('');

  const center = useCallback((index: number) => {
    velocityRef.current = 0;
    const delta = shortestDelta(angleRef.current, -index * step);
    targetRef.current = angleRef.current + delta;
    if (reducedRef.current) angleRef.current = targetRef.current;
    idleUntilRef.current = performance.now() + 2400;
  }, [step]);

  const activate = (index: number) => {
    if (index < 0 || index >= count) return;
    if (Math.abs(shortestDelta(angleRef.current, -index * step)) > 8) { center(index); return; }
    center(index);
    returnFocusRef.current = document.activeElement as HTMLElement;
    setSelected(certifications[index]); modalRef.current = true;
  };

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const resize = () => setRadius(window.innerWidth >= 1024 ? 480 : window.innerWidth >= 640 ? 380 : 275);
    const preference = () => { reducedRef.current = media.matches; if (media.matches) { autoRef.current = false; setAuto(false); velocityRef.current = 0; } };
    resize(); preference(); window.addEventListener('resize', resize); media.addEventListener('change', preference);
    const observer = new IntersectionObserver(entries => { visibleRef.current = entries[0].isIntersecting; }, { rootMargin: '150px' });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { window.removeEventListener('resize', resize); media.removeEventListener('change', preference); observer.disconnect(); };
  }, []);

  useEffect(() => {
    let frame = 0, lastTime = 0, renderedAngle = Number.NaN;
    const tick = (time: number) => {
      const dt = lastTime ? clamp((time - lastTime) / (1000 / 60), 0.25, 3) : 1;
      lastTime = time;
      if (visibleRef.current && !document.hidden && !modalRef.current && !draggingRef.current) {
        if (targetRef.current !== null) {
          const delta = targetRef.current - angleRef.current;
          angleRef.current += reducedRef.current ? delta : delta * (1 - Math.pow(0.87, dt));
          if (Math.abs(delta) < 0.04) {
            angleRef.current = targetRef.current; targetRef.current = null;
            if (keyboardFocusRef.current) { cardRefs.current[frontIndex(angleRef.current, count)]?.focus({ preventScroll: true }); keyboardFocusRef.current = false; }
          }
        } else if (Math.abs(velocityRef.current) > 0.006 && !reducedRef.current) {
          angleRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.945, dt);
          idleUntilRef.current = time + 1500;
        } else if (autoRef.current && !focusRef.current && !reducedRef.current && time > idleUntilRef.current && count > 1) {
          angleRef.current += 0.06 * dt;
        }
      }
      if (renderedAngle !== angleRef.current) {
      renderedAngle = angleRef.current;
      if (cylinderRef.current) cylinderRef.current.style.transform = `translateZ(${-radius}px) rotateY(${angleRef.current}deg)`;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const cosine = Math.cos((index * step + angleRef.current) * Math.PI / 180);
        const visible = cosine >= 0;
        card.style.visibility = visible ? 'visible' : 'hidden';
        card.style.opacity = visible ? String(0.45 + cosine * 0.55) : '0';
        card.setAttribute('aria-hidden', String(!visible));
        card.tabIndex = frontIndex(angleRef.current, count) === index ? 0 : -1;
      });
      const nextFront = frontIndex(angleRef.current, count);
      if (frontRef.current !== nextFront) { frontRef.current = nextFront; setFront(nextFront); }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [count, radius, step]);

  useEffect(() => {
    if (!selected) return;
    dialogRef.current?.showModal();
    setDigest('');
    let disposed = false;
    if (selected.sha256) setDigest(selected.sha256);
    else if (crypto.subtle) {
      crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify({ id: selected.id, name: selected.name, issuer: selected.issuer, competencies: selected.competencies }))).then(buffer => {
        if (!disposed) setDigest(Array.from(new Uint8Array(buffer)).map(byte => byte.toString(16).padStart(2, '0')).join(''));
      }).catch(() => { if (!disposed) setDigest('unavailable'); });
    } else setDigest('unavailable');
    return () => { disposed = true; };
  }, [selected]);

  const close = () => {
    dialogRef.current?.close(); setSelected(null); modalRef.current = false;
    idleUntilRef.current = performance.now() + 2400;
    (returnFocusRef.current?.isConnected ? returnFocusRef.current : cardRefs.current[frontRef.current])?.focus();
  };
  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || draggingRef.current) return;
    const card = (event.target as HTMLElement).closest<HTMLElement>('[data-card-index]');
    gestureRef.current = { x: event.clientX, y: event.clientY, lastX: event.clientX, moved: false, card: Number(card?.dataset.cardIndex ?? -1), pointer: event.pointerId };
    samplesRef.current = [{ x: event.clientX, time: performance.now() }];
    draggingRef.current = true; velocityRef.current = 0; targetRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || gestureRef.current.pointer !== event.pointerId) return;
    const gesture = gestureRef.current;
    if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 6) gesture.moved = true;
    angleRef.current += (event.clientX - gesture.lastX) * 0.24;
    gesture.lastX = event.clientX;
    const time = performance.now();
    samplesRef.current = [...samplesRef.current.filter(sample => time - sample.time < 120), { x: event.clientX, time }];
  };
  const onUp = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    if (!draggingRef.current || gestureRef.current.pointer !== event.pointerId) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const samples = samplesRef.current.filter(sample => performance.now() - sample.time < 140);
    if (!cancelled && gestureRef.current.moved && samples.length > 1 && !reducedRef.current) {
      const first = samples[0], last = samples[samples.length - 1];
      velocityRef.current = clamp((last.x - first.x) / Math.max(1, last.time - first.time) * 16.667 * 0.24, -10, 10);
    }
    idleUntilRef.current = performance.now() + 1800;
    if (!cancelled && !gestureRef.current.moved) activate(gestureRef.current.card);
  };

  if (!count) return null;
  return <section id="certifications" ref={sectionRef} className="section certifications-section"><SectionHeading number="05" label="CONTINUOUS LEARNING" title="The learning never stops" text="Six Meta frontend courses listed in my professional development. Drag to explore each one." />
    <div className="gallery-toolbar"><span><MoveHorizontal size={16} /> DRAG TO EXPLORE</span><button aria-pressed={auto} onClick={() => { autoRef.current = !auto; setAuto(!auto); }} data-magnetic>[ AUTO-SPIN {auto ? 'ON' : 'PAUSED'} ]</button></div>
    <div className="gallery-stage" role="region" aria-roledescription="carousel" aria-label="Professional development courses" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={event => onUp(event)} onPointerCancel={event => onUp(event, true)} onLostPointerCapture={() => { draggingRef.current = false; }} onFocusCapture={() => { focusRef.current = true; }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) focusRef.current = false; }} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); keyboardFocusRef.current = true; center((frontRef.current + (event.key === 'ArrowRight' ? 1 : -1) + count) % count); } }}>
      <div className="gallery-floor" aria-hidden="true" /><div ref={cylinderRef} className="gallery-cylinder" style={{ transform: `translateZ(${-radius}px) rotateY(0deg)` }}>
        {certifications.map((cert, index) => <button key={cert.id} ref={element => { cardRefs.current[index] = element; }} data-card-index={index} className={`credential-card ${front === index ? 'is-front' : ''}`} style={{ '--credential-color': cert.color, transform: `translate(-50%, -50%) rotateY(${index * step}deg) translateZ(${radius}px)`, backfaceVisibility: 'hidden' } as CSSProperties} aria-label={`${cert.name}, ${index + 1} of ${count}. ${front === index ? 'Open course details' : 'Rotate to front'}`} tabIndex={index === 0 ? 0 : -1} onClick={event => { if (event.detail === 0) activate(index); }}>
          <span className="credential-top"><span className="issuer-mark">∞</span><span>{cert.issuer}<small>PROFESSIONAL DEVELOPMENT</small></span><ArrowUpRight size={18} /></span>
          <span className="credential-emblem"><GraduationCap size={42} strokeWidth={1} /><span className="emblem-ring" /></span>
          <span className="credential-name">{cert.name}</span><span className="credential-code">{cert.credentialId ?? `COURSE / ${String(index + 1).padStart(2, '0')}`}</span><span className="credential-bottom"><span>{cert.verifiedAt ? 'VERIFIED CREDENTIAL' : 'RÉSUMÉ-LISTED COURSE'}</span><span>VIEW RECORD ↗</span></span>
        </button>)}
      </div>
    </div>
    <div className="gallery-controls"><button className="icon-button" aria-label="Previous course" onClick={() => center((frontRef.current - 1 + count) % count)}><ArrowLeft size={18} /></button><div className="gallery-dots">{certifications.map((cert, index) => <button key={cert.id} aria-label={`Center ${cert.name}`} aria-pressed={front === index} onClick={() => center(index)}><span /></button>)}</div><button className="icon-button" aria-label="Next course" onClick={() => center((frontRef.current + 1) % count)}><ArrowRight size={18} /></button></div>
    <p className="gallery-caption">{String(front + 1).padStart(2, '0')} / {String(count).padStart(2, '0')} <span>CLICK THE FRONT CARD TO INSPECT</span></p>
    <dialog ref={dialogRef} className="credential-dialog" aria-labelledby="credential-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} data-lenis-prevent>
      {selected && <div className="dialog-content"><div className="dialog-top"><span className="eyebrow"><ShieldCheck size={15} /> CREDENTIAL INSPECTION</span><button className="icon-button" aria-label="Close course details" onClick={close} autoFocus><X size={20} /></button></div><span className="issuer-badge">∞ {selected.issuer}</span><h3 id="credential-title">{selected.name}</h3><dl className="verification-data"><div><dt>Record status</dt><dd>{selected.verifiedAt ? 'Verified' : 'Listed in résumé'}</dd></div><div><dt>Verified date</dt><dd>{selected.verifiedAt ?? 'Not independently verified'}</dd></div>{selected.issued && <div><dt>Issued</dt><dd>{selected.issued}</dd></div>}{selected.credentialId && <div><dt>Credential ID</dt><dd>{selected.credentialId}</dd></div>}</dl><p className="mono small-label">COMPETENCIES</p><div className="tag-row">{selected.competencies.map(skill => <span key={skill}>{skill}</span>)}</div><div className="hash-panel"><span><Fingerprint size={16} /> {selected.sha256 ? 'CERTIFICATE FILE FINGERPRINT' : 'COURSE RECORD FINGERPRINT'}</span><code>{digest === 'unavailable' ? 'Fingerprint unavailable in this browser.' : digest ? `SHA256://${digest}` : 'Calculating SHA-256…'}</code><p>{selected.sha256 ? 'SHA-256 identifies the supplied certificate file.' : 'This hash identifies this portfolio’s course record. It is not proof of completion or issuer verification.'}</p></div>{selected.verificationUrl ? <a className="button primary" href={selected.verificationUrl} target="_blank" rel="noreferrer">VERIFY WITH ISSUER <ArrowUpRight size={16} /></a> : <p className="verification-note">The résumé does not include a certificate ID, issue date or verification link.</p>}</div>}
    </dialog>
  </section>;
}

