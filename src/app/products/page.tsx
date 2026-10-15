import fs from "node:fs/promises";
import path from "node:path";
import { PageIntro } from "@/components/page-intro";
import { Gallery, type GalleryItem } from "@/components/gallery";
import { ContactCTA } from "@/components/contact-cta";
import { boardTypes } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("PCB Products", "Explore single-sided, double-sided and multilayer PCB construction. View board illustrations and Prototech’s original product gallery.", "/products");
export default async function Products() {
  const originals: { id: string; image: string; name: string }[] = JSON.parse(await fs.readFile(path.join(process.cwd(), "public/media/products.json"), "utf8"));
  const items: GalleryItem[] = originals.length ? originals.map(item => ({ ...item, kind: "photograph", detail: "Original product photograph from Prototech’s gallery." })) : [
    { id: "circuit-detail", name: "The circuit, up close", image: "/media/pcb-artwork.webp", kind: "illustration", detail: "Illustrative PCB artwork showing contacts, pads and traces." },
    ...boardTypes.map(board => ({ id: board.id, name: board.name, image: board.image, kind: "illustration" as const, detail: `${board.layers}. ${board.description}` })),
  ];
  return <><PageIntro title="Made for your circuit."><p>Single-sided, double-sided and multilayer printed circuit boards. Each starts with a design of your own.</p></PageIntro><section className="product-gallery container">{!originals.length && <p className="gallery-disclosure">The images below are technical illustrations, not photographs of manufactured products. View Prototech’s <a href="https://protomlb.in/our-products" target="_blank" rel="noreferrer">original product photographs</a>.</p>}<Gallery items={items} /></section><section className="product-materials container"><h2>Choose the finish</h2><div><p>Prototech’s published surface finishes include HAL with lead, lead-free HAL and ENIG. Solder mask colours include green, white, blue, black and red.</p><p>FR4 TG135 glass epoxy laminate is the listed base material. Discuss material thickness, copper thickness and finish with our team before production.</p><a href="/capabilities" className="text-link">See full specifications</a></div></section><ContactCTA /></>;
}
