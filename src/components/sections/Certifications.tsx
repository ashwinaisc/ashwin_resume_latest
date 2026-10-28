import type { Certification } from '@/data/types';
import SectionHeading from '@/components/SectionHeading';
export default function Certifications({ certifications }: { certifications: Certification[] }) {
  return <section id="certifications" className="section learning-section"><SectionHeading number="05" label="PROFESSIONAL DEVELOPMENT" title="Design informed by development" text="Frontend coursework supporting my design practice." /><details className="learning-details"><summary>Meta frontend coursework <span>{certifications.length} courses</span></summary><ul className="learning-list">{certifications.map(course => <li key={course.id}><h3>{course.name}</h3><p>{course.competencies.join(' · ')}</p>{course.verificationUrl && <a className="text-link" href={course.verificationUrl} target="_blank" rel="noreferrer">View issuer record ↗</a>}</li>)}</ul><p className="work-context">Courses listed in my résumé. Issuer verification links will appear when available.</p></details></section>;
}
