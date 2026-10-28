import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import type { Profile } from '@/data/types';
export default function Hero({ profile }: { profile: Profile }) {
  return <section id="home" className="hero">
    <div className="hero-watermark" aria-hidden="true">{profile.firstName}</div>
    <div className="hero-content">
      <div className="eyebrow hero-eyebrow"><span className="status-dot" />DIGITAL DESIGNER · WEB UI</div>
      <p className="hero-intro">{profile.name}</p>
      <h1><span>WEB INTERFACES.</span><span className="gradient-text">BRAND EXPERIENCES.</span></h1>
      <p className="hero-description">I’m a digital designer combining visual design, responsive frontend development and marketing experience to bring brands to life online.</p>
      <div className="hero-actions"><a className="button primary" href="#projects">EXPLORE MY WORK <ArrowUpRight size={19} /></a><a className="button secondary" href={profile.resumeUrl} download>DOWNLOAD RÉSUMÉ <Download size={17} /></a></div>
      <ul className="hero-focus" aria-label="Design focus"><li>Web & UI design</li><li>Responsive development</li><li>Brand & campaign design</li></ul>
    </div>
    <div className="hero-footer"><a href="#projects" className="scroll-cue"><span className="scroll-icon"><ArrowDown size={16} /></span>EXPLORE MY PRACTICE</a>{profile.available && <span className="availability"><span className="status-dot" />OPEN TO DESIGN ROLES</span>}</div>
  </section>;
}
