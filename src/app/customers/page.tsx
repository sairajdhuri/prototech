import { PageIntro } from "@/components/page-intro";
import { Media } from "@/components/media";
import { Reveal } from "@/components/reveal";
import { ContactCTA } from "@/components/contact-cta";
import { customers } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Our Customers", "Customers listed by Prototech include Schneider Electric India, BHEL, Uno Minda, Rishabh Instruments, Star Engineers and TATA Autocomp.", "/customers");
export default function Customers() {
  return <>
    <PageIntro title="Connections that matter."><p>Meet some of the companies we manufacture printed circuit boards for.</p></PageIntro>
    <section className="customer-catalogue container" aria-label="Our customers">
      {customers.map((customer, index) => <Reveal className="customer-entry" key={customer.name} delay={index * 0.05} variant="fade">
        <div className="customer-logo"><Media file={customer.image} alt={customer.short + " logo"} fallbackLabel={customer.short} contain /></div>
        <p className="customer-name">{customer.name}</p>
      </Reveal>)}
    </section>
    <ContactCTA />
  </>;
}
