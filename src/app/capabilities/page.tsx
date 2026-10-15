import Link from "next/link";
import { Suspense } from "react";
import { PageIntro } from "@/components/page-intro";
import { Reveal } from "@/components/reveal";
import { ContactCTA } from "@/components/contact-cta";
import { BoardExplorer } from "@/components/board-explorer";
import { capabilityGroups } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Manufacturing Capabilities", "PCB technical specifications: 2–12 layers, FR4 TG135, track and spacing, plated holes, copper thickness, surface finishes and flying probe testing.", "/capabilities");
export default function Capabilities() {
  return <><PageIntro title="Built to your specification."><p>From layer count to the final surface finish, the technical details belong at the centre of the conversation.</p></PageIntro><section className="capability-intro container"><div className="capability-large"><strong>2–12</strong><span>Layers, manufactured in Pune.</span></div><p>Double-sided and multilayer PCBs on FR4 TG135 glass epoxy laminate. All boards electrically tested.</p></section><section className="specification-tables container">{capabilityGroups.map(group => <Reveal key={group.title} className="specification-group"><h2>{group.title}</h2><div className="table-scroll" role="region" aria-label={`${group.title} specifications`} tabIndex={0}><table><caption className="sr-only">{group.title}: published manufacturing specifications</caption><thead><tr><th scope="col">Specification</th><th scope="col">Published capability</th></tr></thead><tbody>{group.rows.map(([name, value]) => <tr key={name}><th scope="row">{name}</th><td>{value}</td></tr>)}</tbody></table></div></Reveal>)}</section><section className="spec-note container"><h2>Confirm your design</h2><p>These values reproduce Prototech’s published specifications. They describe general capability; availability and suitability should be confirmed for your particular board.</p><p>Source: <a href="https://protomlb.in/capabilities" target="_blank" rel="noreferrer">Prototech’s original capability sheet</a>. Share your Gerber files and technical requirements through the <Link href="/quote">quote form</Link>.</p></section><section className="explorer-section container"><Suspense fallback={<p>Single-sided, double-sided and multilayer boards. <Link href="/quote">Request a quote</Link>.</p>}><BoardExplorer /></Suspense></section><ContactCTA /></>;
}
