export type SkillCategory = 'Languages' | 'Frontend' | 'Backend' | 'Databases' | 'Cloud & DevOps' | 'Core CS' | 'UI/UX Design' | 'Graphic Design' | 'Digital Marketing' | 'Development Tools';
export type Metric = { label: string; value: number; suffix?: string; decimals?: number };
export type Milestone = {
  id: string; kind: 'work' | 'education'; title: string; organization: string;
  period: string; sortDate: string; location?: string; current?: boolean; details: string[];
};
export type Project = {
  id: string; name: string; category: string; description: string;
  stack: string[]; highlights: string[]; github?: string; live?: string; image?: string;
};
export type Certification = {
  id: string; name: string; issuer: string; issued?: string;
  credentialId?: string; verificationUrl?: string;
  /** Only populate when verification has actually been performed. */
  verifiedAt?: string;
  /** Optional SHA-256 of the actual certificate file; never a generated fake. */
  sha256?: string;
  competencies: string[]; color: string;
};
export type Profile = {
  name: string; firstName: string; role: string; bio: string; location?: string;
  email: string; phone?: string; resumeUrl: string; available: boolean;
  spokenLanguages: string[];
  strengths: { title: string; description: string }[];
  metrics: Metric[]; skills: Partial<Record<SkillCategory, string[]>>;
  journey: Milestone[]; projects: Project[]; certifications: Certification[];
  socials: { label: string; url: string }[];
};
