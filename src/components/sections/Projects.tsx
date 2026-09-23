'use client';
import { useRef, type PointerEvent } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import type { Profile, Project } from '@/data/types';
import SectionHeading from '@/components/SectionHeading';

function WorkCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const move = (event: PointerEvent<HTMLElement>) => {
    if (!ref.current || event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width, y = (event.clientY - rect.top) / rect.height;
    ref.current.style.transform = `perspective(1000px) rotateX(${(y - 0.5) * -5}deg) rotateY(${(x - 0.5) * 5}deg)`;
    ref.current.style.setProperty('--spot-x', `${x * 100}%`); ref.current.style.setProperty('--spot-y', `${y * 100}%`);
  };
  return <article ref={ref} className={`project-card project-${index}`} onPointerMove={move} onPointerLeave={() => { if (ref.current) ref.current.style.transform = ''; }}>
    <div className="project-visual" aria-hidden="true"><span className="project-number">0{index + 1}</span><div className={`work-art art-${index}`}>
      {index === 0 ? <div className="wireframe"><div className="wire-nav"><i /><i /><i /></div><div className="wire-content"><div><i /><i /><i /><b /></div><span /></div><div className="wire-bottom"><i /><i /><i /></div><span className="art-cursor">↖</span></div> : index === 1 ? <div className="code-art"><span>&lt;experience&gt;</span><b>MAKE<br />IT WORK<span>.</span></b><span>&lt;/experience&gt;</span></div> : <div className="brand-art"><span className="brand-art-label">FORM / FEELING / FUNCTION</span><b>Aa<span>↗</span></b><div><i /><i /><i /><i /></div></div>}
    </div><span className="visual-caption">{['INTERFACE STUDY', 'WEB DEVELOPMENT', 'VISUAL COMMUNICATION'][index % 3]}</span></div>
    <div className="project-content"><span className="eyebrow">{project.category}</span><h3>{project.name}</h3><p>{project.description}</p><ul className="project-highlights">{project.highlights.map(item => <li key={item}>{item}</li>)}</ul><div className="tag-row">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div>{(project.github || project.live) && <div className="project-links">{project.github && <a href={project.github} target="_blank" rel="noreferrer"><Github size={15} /> Source <ArrowUpRight size={14} /></a>}{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={16} /></a>}</div>}</div>
  </article>;
}
export default function Projects({ profile }: { profile: Profile }) {
  return <section id="projects" className="section"><SectionHeading number="03" label="SELECTED WORK" title="Ideas, made tangible" text="A selection of the work I do, drawn from my design and development roles." /><div className="projects-grid">{profile.projects.map((project, index) => <WorkCard key={project.id} project={project} index={index} />)}</div><div className="work-footer"><span className="mono">DESIGN. BUILD. REFINE. REPEAT.</span><a className="text-link" href="https://www.behance.net/ashwinaisc" target="_blank" rel="noreferrer" data-magnetic>EXPLORE MY BEHANCE <ArrowUpRight size={18} /></a></div></section>;
}
