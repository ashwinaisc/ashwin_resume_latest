import { ArrowUpRight } from 'lucide-react';
import { profile } from '@/data/profile';
import CinematicVideo from '@/components/CinematicVideo';
import CustomCursor from '@/components/CustomCursor';
import LenisProvider from '@/components/LenisProvider';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Certifications from '@/components/sections/Certifications';
import Skills from '@/components/sections/Skills';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return <LenisProvider><a href="#main" className="skip-link">Skip to content</a><CinematicVideo /><CustomCursor /><Navbar firstName={profile.firstName} /><main id="main"><Hero profile={profile} /><div className="content-surface"><About profile={profile} /><Projects profile={profile} /><Experience journey={profile.journey} /><Certifications certifications={profile.certifications} /><Skills profile={profile} /><Contact profile={profile} /></div></main><footer className="site-footer"><a href="#home" className="brand">Ashwin<span>.</span></a><p>© {new Date().getFullYear()} {profile.name}<span>CRAFTED WITH INTENT.</span></p><a href="#home" className="text-link">BACK TO TOP <ArrowUpRight size={17} /></a></footer></LenisProvider>;
}
