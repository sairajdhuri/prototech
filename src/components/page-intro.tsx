import { Reveal } from "./reveal";

export function PageIntro({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="page-intro container"><Reveal><h1>{title}</h1></Reveal><Reveal delay={0.07}><div className="page-intro-copy">{children}</div></Reveal></section>;
}
