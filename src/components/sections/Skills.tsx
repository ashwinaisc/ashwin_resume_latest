import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import type { Profile } from '@/data/types';
export default function Skills({ profile }: { profile: Profile }) {
  return <section id="skills" className="section"><SectionHeading number="06" label="TOOLS OF THE TRADE" title="A multidisciplinary toolkit" text="The tools change. The curiosity stays. Design, development and marketing, working together." /><div className="skills-grid">{Object.entries(profile.skills).map(([category, skills], index) => <article className="skill-group" key={category}><div><span className="mono red">0{index + 1}</span><ArrowUpRight size={18} /></div><h3>{category}</h3><div className="skill-pills">{skills?.map(skill => <span key={skill}>{skill}</span>)}</div></article>)}</div><div className="spoken-languages"><span className="mono">HUMAN LANGUAGES</span>{profile.spokenLanguages.map(language => <span key={language}>{language}</span>)}</div></section>;
}
