'use client';
import { useState } from 'react';
import { ArrowUpRight, Code2, ScanLine } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import type { Profile } from '@/data/types';
export default function About({ profile }: { profile: Profile }) {
  const categories = Object.entries(profile.skills);
  const [selected, setSelected] = useState(categories[0]?.[0] ?? '');
  return <section id="about" className="section"><SectionHeading number="02" label="THE PERSON BEHIND THE PIXELS" title="A little human. A little system" />
    <div className="about-grid"><div className="about-copy"><p className="large-copy">A designer’s eye.<br /><span>A developer’s mindset.</span></p><p>{profile.bio}</p><div className="about-location"><ScanLine size={19} /><span>{profile.location}</span></div><a href="#contact" className="text-link">MAKE SOMETHING MEANINGFUL <ArrowUpRight size={17} /></a></div>
      <div className="terminal"><div className="terminal-bar"><span className="terminal-lights"><i /><i /><i /></span><span>ashwin / profile.ts</span><Code2 size={15} /></div><div className="terminal-body"><p className="terminal-comment">{'// curiosity is a core dependency'}</p><p><span className="code-purple">const</span> <span className="code-blue">designer</span> = {'{'}</p><dl><div><dt>name:</dt><dd>&quot;{profile.name}&quot;,</dd></div><div><dt>focus:</dt><dd>&quot;Design × Development&quot;,</dd></div><div><dt>approach:</dt><dd>&quot;Understand. Create. Refine.&quot;</dd></div></dl><p>{'};'}</p><div className="terminal-divider" /><p className="terminal-comment">{'// explore the toolkit'}</p><div className="skill-tabs" aria-label="Explore skills">{categories.map(([category]) => <button key={category} aria-pressed={selected === category} onClick={() => setSelected(category)}>{category}</button>)}</div><div className="terminal-skills" aria-live="polite">{categories.find(([category]) => category === selected)?.[1]?.map(skill => <span key={skill}>{skill}</span>)}</div><p className="terminal-prompt"><span>❯</span> ready_to_create<span className="caret" /></p></div></div>
    </div><div className="strengths">{profile.strengths.map((strength, i) => <article key={strength.title}><span className="mono red">0{i + 1} /</span><h3>{strength.title}</h3><p>{strength.description}</p></article>)}</div>
  </section>;
}

