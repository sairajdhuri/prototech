import { PageIntro } from "@/components/page-intro";
import { EnquiryForm } from "@/components/enquiry-form";
import { company } from "@/lib/company";
import { Arrow } from "@/components/icons";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Contact", "Contact Prototech in Narhe, Pune. Email sales@protomlb.in, call +91 7620795067, or send an enquiry about your printed circuit board project.", "/contact");
export default function Contact() {
  return <><PageIntro title="Let’s talk boards."><p>A technical question, a new design, or a production requirement. Start a conversation with our Pune team.</p></PageIntro><section className="contact-layout container"><aside className="contact-details"><h2>Reach our team</h2><a className="contact-direct" href={`mailto:${company.email}`}>{company.email}<Arrow diagonal /></a><a className="contact-direct" href={company.phoneHref}>{company.phone}<Arrow diagonal /></a><div className="contact-address"><h3>Visit our facility</h3><address>{company.address}</address><p>Published hours: {company.hours}.<br />Please call to arrange your visit.</p><a className="text-link" href={company.directions} target="_blank" rel="noreferrer">Get directions <Arrow diagonal /></a></div><div className="contact-quote-note"><h3>Ready for a quotation?</h3><p>Use the dedicated quote form to include board dimensions, layer count and design files.</p><a href="/quote" className="text-link">Request a quote <Arrow /></a></div></aside><EnquiryForm kind="enquiry" /></section><section className="location-band"><div className="container"><h2>Pune, Maharashtra.</h2><p>Renuka Industrial Estate, Narhe</p><a href={company.directions} className="button button-light" target="_blank" rel="noreferrer">Open in Google Maps <Arrow diagonal /></a></div></section></>;
}
