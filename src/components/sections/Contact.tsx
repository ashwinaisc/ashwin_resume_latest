'use client';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Copy, Mail, Send } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import Magnetic from '@/components/Magnetic';
import type { Profile } from '@/data/types';
export default function Contact({ profile }: { profile: Profile }) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('');
  const [draft, setDraft] = useState('');
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setStatus('Email address copied.'); }
    catch { setStatus(`Copy this address: ${profile.email}`); }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim(), email = String(data.get('email') ?? '').trim(), message = String(data.get('message') ?? '').trim();
    if (!name || !email || !message) { setStatus('Please complete your name, email and message.'); return; }
    const url = `mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio enquiry from ${name}`)}&body=${encodeURIComponent(`Hi Ashwin,\n\n${message}\n\n${name}\n${email}`)}`;
    setDraft(url); setStatus('Your email draft is ready. Send it from your email app.');
    window.location.href = url;
  };
  return <section id="contact" className="section contact-section"><SectionHeading number="07" label="START A CONVERSATION" title="Let’s make something matter" />
    <div className="contact-grid"><div className="contact-copy"><h3>Good things start<br />with a <span>hello.</span></h3><p>Have an idea, a role, or a creative challenge?<br />Let’s connect and see where it takes us.</p>{profile.available && <div className="availability"><span className="status-dot" />OPEN TO OPPORTUNITIES</div>}<div className="email-row"><a href={`mailto:${profile.email}`}>{profile.email}</a><button className="icon-button" onClick={copy} aria-label="Copy email address">{copied ? <Check size={18} /> : <Copy size={18} />}</button></div>{profile.phone && <a className="phone-link" href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>}<div className="social-links">{profile.socials.map(social => <Magnetic key={social.label}><a href={social.url} target="_blank" rel="noreferrer">{social.label}<ArrowUpRight size={16} /></a></Magnetic>)}</div></div>
      <form className="contact-form" onSubmit={submit}><div className="form-header"><Mail size={16} /><span>NEW TRANSMISSION</span><span className="red">↗</span></div><div className="form-row"><label>Your name<input name="name" autoComplete="name" required maxLength={100} /></label><label>Email address<input type="email" name="email" autoComplete="email" required maxLength={254} /></label></div><label>What are you thinking?<textarea name="message" rows={4} required maxLength={3000} /></label><p className="form-note">Opens a draft in your email app. Nothing is sent until you send it.</p><button type="submit" className="button primary" data-magnetic>LET’S CONNECT <Send size={16} /></button>{draft && <a className="draft-link" href={draft}>Open the email draft again <ArrowUpRight size={14} /></a>}</form>
    </div><p className="contact-status" role="status">{status}</p>
  </section>;
}
