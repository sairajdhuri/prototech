import { PageIntro } from "@/components/page-intro";
import { Reveal } from "@/components/reveal";
import { Media } from "@/components/media";
import { ContactCTA } from "@/components/contact-cta";
import { machines } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Manufacturing Machinery", "Explore Prototech’s equipment: Pluritec CNC drilling, Anger lamination, MANIA flying probe testing, Orbotech optical inspection and finishing machinery.", "/machinery");

const stages = [
  { id: "Drilling", name: "Drilling & routing" },
  { id: "Fabrication", name: "Fabrication" },
  { id: "Finishing", name: "Finishing" },
  { id: "Testing", name: "Testing & inspection" },
];

// Only include specifications that add information beyond the equipment name.
const specifications: Record<string, { model?: string; detail?: string }> = {
  "cnc-drilling": { model: "Pluritec Multistation", detail: "Westwind single spindle · 125,000 rpm · Air bearing" },
  "cnc-routing": { model: "Pluritec Minima", detail: "Westwind single spindle · 80,000 rpm · Air bearing" },
  "routing": { detail: "Single spindle · 24,000 rpm" },
  "lamination": { model: "Anger" },
  "etching": { model: "Fibre abrasive" },
  "flying-probe": { model: "Speedy MPP 4504" },
};

export default function Machinery() {
  return <>
    <PageIntro title="Precision has a process."><p>From CNC drilling to electrical testing, explore the equipment at our Pune facility.</p></PageIntro>
    <nav className="machinery-jump container" aria-label="Machinery sections">
      {stages.map(stage => <a key={stage.id} href={"#" + stage.id.toLowerCase()}>{stage.name}</a>)}
    </nav>
    <section className="machine-catalogue container" aria-label="Manufacturing equipment">
      {stages.map(stage => <div className="machine-group" key={stage.id} id={stage.id.toLowerCase()}>
        <h2>{stage.name}</h2>
        <div className="machine-catalogue-grid">
          {machines.filter(machine => machine.stage === stage.id).map((machine, index) => {
            const specification = specifications[machine.id];
            return <Reveal key={machine.id} delay={index * 0.04} variant="fade" className="machine-catalogue-item">
              <Media file={machine.image} alt={machine.model + " at Prototech’s Pune facility"} hideIfUnavailable />
              <div>
                <h3>{machine.name}</h3>
                {specification?.model && <p className="machine-model">{specification.model}</p>}
                {specification?.detail && <p>{specification.detail}</p>}
                {machine.origin !== "Local manufacture" && <span className="machine-origin">{machine.origin}</span>}
              </div>
            </Reveal>;
          })}
        </div>
        {stage.id === "Fabrication" && <div className="equipment-note"><h3>LED exposing</h3></div>}
      </div>)}
    </section>
    <div className="source-note container"><p>Equipment specifications from <a href="https://protomlb.in/machinery" target="_blank" rel="noreferrer">Prototech’s machinery inventory</a>.</p></div>
    <ContactCTA />
  </>;
}
