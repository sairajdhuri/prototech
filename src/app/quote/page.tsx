import { PageIntro } from "@/components/page-intro";
import { EnquiryForm } from "@/components/enquiry-form";
import { company } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Request a Quote", "Request a PCB manufacturing quotation. Share layer count, board dimensions, quantity, requirements and optional Gerber files with Prototech.", "/quote");
export default async function Quote({ searchParams }: { searchParams: Promise<{ pcbType?: string; layers?: string }> }) {
  const params = await searchParams;
  const type = ["single-sided", "double-sided", "multilayer"].includes(params.pcbType || "") ? params.pcbType! : "double-sided";
  const allowed = type === "single-sided" ? [1] : type === "double-sided" ? [2] : [4, 6, 8, 10, 12];
  const layer = allowed.includes(Number(params.layers)) ? Number(params.layers) : allowed[0];
  return <><PageIntro title="Your design. Our next board."><p>Tell us what you need to manufacture. Share your specifications and files for a quotation from our team.</p></PageIntro><section className="quote-layout container"><aside className="quote-notes"><h2>Start with the details</h2><p>Board type, dimensions, quantity and layer count give us the foundation for your quotation.</p><h3>Have Gerber files?</h3><p>Attach one ZIP archive with your board files, or a PDF with technical requirements. Maximum attachment size: 5 MB.</p><h3>Need to discuss first?</h3><a href={`mailto:${company.email}`}>{company.email}</a><a href={company.phoneHref}>{company.phone}</a><div className="quote-published-note"><p>Multilayer capability: up to 12 layers.<br />Maximum published MLB size: 460 × 460 mm.</p><p>We’ll confirm your material, finish and schedule for the specific design.</p></div></aside><EnquiryForm kind="quote" initialType={type} initialLayers={layer} /></section></>;
}
