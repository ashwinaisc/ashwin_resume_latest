import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const profile = JSON.parse(readFileSync(new URL('../src/data/profile.json', import.meta.url), 'utf8'));
assert(profile?.name && profile.email && profile.bio, 'Profile identity and bio are required.');
assert(profile.journey.length > 0 && profile.skills, 'Résumé content must be populated.');
assert(existsSync(new URL('../public/video/portfolio-background.mp4', import.meta.url)), 'Background video is required.');
assert(existsSync(new URL(`../public${profile.resumeUrl}`, import.meta.url)), 'Downloadable résumé must exist.');
for (const cert of profile.certifications) {
  assert(/^#[0-9a-f]{6}$/i.test(cert.color), 'Credential color must be a six-digit hex.');
  if (cert.verifiedAt) assert(cert.verificationUrl, 'Verified records require issuer evidence.');
  if (cert.sha256) assert(/^[0-9a-f]{64}$/i.test(cert.sha256), 'Certificate hash must be a real SHA-256 digest.');
}
for (const item of [...profile.socials.map(s => s.url), ...profile.projects.flatMap(p => [p.github, p.live].filter(Boolean))]) assert(new URL(item).protocol === 'https:', 'External links must use HTTPS.');
console.log(`Content ready: ${profile.name}, ${profile.journey.length} milestones, ${profile.certifications.length} course records.`);
