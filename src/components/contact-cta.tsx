import { ButtonLink } from "./button";
import { Reveal } from "./reveal";
import { company } from "@/lib/company";

export function ContactCTA() {
  return <section className="contact-cta"><div className="container cta-inner"><Reveal><h2>Let’s build something<br />exceptional.</h2></Reveal><Reveal className="cta-copy" variant="side" delay={0.12}><p>Have a board in mind? Share your specifications with our Pune manufacturing team.</p><ButtonLink href="/quote" light>Request a quote</ButtonLink><a className="cta-email" href={`mailto:${company.email}`}>{company.email}</a></Reveal></div></section>;
}
