import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Profile } from '@/data/types';
import SectionHeading from '@/components/SectionHeading';
export default function Projects({ profile }: { profile: Profile }) {
  return <section id="projects" className="section work-section">
    <SectionHeading number="04" label="SELECTED WORK" title="Live pages. Real projects" text="Two landing pages I created for My Health School, each with a different approach to storytelling and enquiries." />
    <div className="projects-grid featured-projects">{profile.projects.map(project => <article className="project-card featured-project" key={project.id}>
      {project.image && <div className="project-screenshot"><Image src={project.image} alt={`${project.name} landing page screenshot`} width={1280} height={720} sizes="(max-width: 760px) 100vw, 50vw" /></div>}
      <div className="project-content"><p className="eyebrow">{project.category}</p><h3>{project.name}</h3><p>{project.description}</p><h4 className="contribution-label">Project highlights</h4><ul className="project-highlights">{project.highlights.map(item => <li key={item}>{item}</li>)}</ul><div className="tag-row">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div>{project.live && <a className="button primary project-live-link" href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name} live website (opens in a new tab)`}>VISIT LIVE WEBSITE <ArrowUpRight size={18} /></a>}</div>
    </article>)}</div>
    <div className="work-footer"><p className="work-context">More visual design work on Behance.</p><a className="text-link" href="https://www.behance.net/ashwinaisc" target="_blank" rel="noopener noreferrer">EXPLORE BEHANCE <ArrowUpRight size={18} /></a></div>
  </section>;
}
