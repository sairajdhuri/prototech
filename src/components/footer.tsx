import Link from "next/link";
import { company, navigation } from "@/lib/company";
import { Arrow } from "./icons";
import { Brand } from "./brand";
import { Reveal } from "./reveal";

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-upper"><div><Link className="brand" href="/" translate="no"><Brand /></Link><p>Printed circuit boards.<br />Made in Pune. Since 1999.</p></div>
      <nav className="footer-nav" aria-label="Footer navigation">{navigation.filter(item => item.href !== "/").map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/quote">Request a quote</Link></nav>
      <address><a href={`mailto:${company.email}`}>{company.email}</a><a href={company.phoneHref}>{company.phone}</a><p>{company.address}</p><a className="text-link" href={company.directions} target="_blank" rel="noreferrer">Get directions <Arrow diagonal /></a></address>
    </div>
    <Reveal variant="image"><div className="footer-wordmark" aria-hidden="true" translate="no">prototech.</div></Reveal>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Prototech</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/credits">Image credits</Link></div><span>Pune, India</span></div>
  </footer>;
}
