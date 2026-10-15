import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { PCBExperience } from "@/components/pcb-experience";
import { Arrow } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { BoardExplorer } from "@/components/board-explorer";
import { MachinePreview } from "@/components/machine-preview";
import { ContactCTA } from "@/components/contact-cta";
import { customers } from "@/lib/company";
import { Media } from "@/components/media";
import { pageMetadata } from "@/lib/seo";
import { CountUp } from "@/components/count-up";
import finishedPoster from "../../public/media/pcb-finished-current.webp";

export const metadata = pageMetadata("Precision PCB Manufacturing", "Professional-grade PCBs made in Pune since 1999. Double-sided and multilayer manufacturing up to 12 layers, with electrical testing of every board.", "/");

export default function Home() {
  return <div className="home-page">
    <PCBExperience />
    <section className="highlights container" aria-label="Manufacturing highlights"><Reveal><p><strong><CountUp value={1999} from={1990} /></strong><span>Manufacturing in Pune since</span></p></Reveal><Reveal delay={0.07}><p><strong><CountUp value={2} />–<CountUp value={12} from={2} delay={0.07} /></strong><span>Layers, built to your design</span></p></Reveal><Reveal delay={0.14}><p><strong><CountUp value={100} suffix="%" delay={0.14} /></strong><span>Of boards electrically tested</span></p></Reveal><Reveal delay={0.21}><p><strong>FR4</strong><span>TG135 glass epoxy laminate</span></p></Reveal></section>
    <section className="intro-statement container"><Reveal className="intro-copy"><h2>Your idea.<br />Made tangible.</h2><p>From the first prototype to small-volume production, we make the boards that bring your design to life.</p><Link className="text-link" href="/about">Get to know Prototech <Arrow /></Link></Reveal><Reveal className="intro-detail" variant="image"><Image src="/media/pcb-detail.webp" alt="Illustrative close-up of copper traces and gold contacts on a printed circuit board" width={800} height={640} sizes="(max-width: 700px) 100vw, 50vw" /></Reveal></section>
    <section className="explorer-section container"><Suspense fallback={<div className="explorer-fallback"><h2>Your next board</h2><p>Double-sided and multilayer PCBs up to 12 layers.</p><Link href="/capabilities">Read manufacturing specifications</Link></div>}><BoardExplorer /></Suspense></section>
    <section className="factory-section container"><MachinePreview /></section>
    <section className="product-preview container"><div className="section-heading"><Reveal><h2>A closer connection</h2></Reveal><Link href="/products" className="text-link">Explore the board gallery <Arrow /></Link></div><div className="product-preview-grid"><Reveal variant="image"><Link href="/products" className="product-preview-large"><Image src="/media/pcb-artwork.webp" alt="PCB circuitry, illustrative artwork" width={1536} height={1024} sizes="(max-width: 700px) 100vw, 65vw" /><span>Built around the circuit.</span></Link></Reveal><Reveal variant="image" delay={0.12}><Link href="/products" className="product-preview-small"><Image src="/media/pcb-edge.webp" alt="PCB edge detail, illustrative artwork" width={700} height={827} sizes="(max-width: 700px) 100vw, 32vw" /><span>Considered down to the contact.</span></Link></Reveal></div><p className="image-disclosure">PCB artwork is illustrative. Original product photographs are available in the company’s <a href="https://protomlb.in/our-products" target="_blank" rel="noreferrer">photo gallery</a>.</p></section>
    <section className="customer-section"><div className="container"><Reveal className="customer-heading"><h2>In good company</h2><p>Connections that go beyond the circuit board.</p></Reveal><ul className="customer-logo-row">{customers.map((customer, index) => <li key={customer.name}><Reveal variant="image" delay={index * 0.07}><Media file={customer.image} alt={customer.short} contain /></Reveal></li>)}</ul><Link className="text-link" href="/customers">Meet our customers <Arrow /></Link></div></section>
    <div className="pcb-quote"><Reveal className="pcb-quote-art" variant="image"><Image src={finishedPoster} alt="" sizes="(max-width: 700px) 240px, 390px" /></Reveal><ContactCTA /></div>
  </div>;
}
