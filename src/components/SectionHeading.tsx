export default function SectionHeading({ number, label, title, text }: { number: string; label: string; title: string; text?: string }) {
  return <header className="section-heading"><div className="eyebrow"><span className="tiny-cross">+</span> {number} / {label}</div><div className="heading-row"><h2>{title}<span className="red">.</span></h2>{text && <p>{text}</p>}</div></header>;
}
