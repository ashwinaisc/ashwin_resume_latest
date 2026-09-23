'use client';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BriefcaseBusiness, GraduationCap, MapPin } from 'lucide-react';
import type { Milestone } from '@/data/types';
import SectionHeading from '@/components/SectionHeading';
const filters = [{ id: 'all', label: 'All' }, { id: 'work', label: 'Work Experience' }, { id: 'education', label: 'Education' }];
export default function Experience({ journey }: { journey: Milestone[] }) {
  const [filter, setFilter] = useState('all');
  const reduced = useReducedMotion();
  const items = [...journey].sort((a, b) => b.sortDate.localeCompare(a.sortDate)).filter(item => filter === 'all' || item.kind === filter);
  return <section id="experience" className="section"><SectionHeading number="04" label="THE JOURNEY" title="Every chapter adds something" text="From computer science to creative practice. A timeline of learning, building and moving forward." />
    <div className="filter-pills" aria-label="Filter journey">{filters.map(item => <button key={item.id} onClick={() => setFilter(item.id)} aria-pressed={filter === item.id}>{filter === item.id && <motion.span layoutId="journey-filter" className="filter-active" transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 28 }} />}<span>{item.label}</span></button>)}</div>
    <p className="sr-only" role="status">Showing {items.length} milestones</p><div className="timeline"><div className="timeline-spine" aria-hidden="true" /><AnimatePresence mode="popLayout" initial={false}>{items.map((item, index) => <motion.article layout={!reduced} key={item.id} initial={{ opacity: 0, y: reduced ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 30 }} className={`milestone ${index % 2 ? 'right' : 'left'} ${item.kind}`}>
      <div className={`waypoint ${item.current ? 'current' : ''}`} aria-hidden="true">{item.kind === 'work' ? <BriefcaseBusiness size={14} /> : <GraduationCap size={15} />}</div>
      <div className="milestone-card"><div className="milestone-top"><span>{item.kind === 'work' ? 'EXPERIENCE' : 'EDUCATION'}</span>{item.current && <span className="current-label">● CURRENT</span>}</div><p className="milestone-date">{item.period}</p><h3>{item.title}</h3><h4>{item.organization}</h4>{item.location && <p className="milestone-location"><MapPin size={12} />{item.location}</p>}{item.details.length > 0 && <ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul>}</div>
    </motion.article>)}</AnimatePresence></div>
  </section>;
}
