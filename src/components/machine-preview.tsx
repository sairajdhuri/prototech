"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { machines } from "@/lib/company";
import { Media } from "./media";
import { Arrow } from "./icons";
import { Reveal } from "./reveal";

const selectedMachines = [machines[0], machines[5], machines[2], machines[11]];
export function MachinePreview() {
  const [selected, setSelected] = useState<(typeof selectedMachines)[number]>(selectedMachines[0]);
  const reduced = useReducedMotion();
  return <div className="machine-preview"><Reveal className="machine-list"><h2>Inside the factory</h2><p>A closer look at the equipment behind your board.</p><div aria-label="Machinery preview">{selectedMachines.map(machine => <motion.button key={machine.id} aria-pressed={selected.id === machine.id} whileHover={reduced ? undefined : { x: 5 }} whileTap={reduced ? undefined : { scale: 0.98 }} transition={{ duration: 0.18 }} onClick={() => setSelected(machine)} onMouseEnter={() => setSelected(machine)} onFocus={() => setSelected(machine)}>{machine.name}<Arrow diagonal /></motion.button>)}</div><Link className="text-link" href="/machinery">Explore our machinery <Arrow /></Link></Reveal><Reveal className="machine-feature" variant="image" delay={0.1}><motion.div key={selected.id} initial={reduced ? false : { opacity: 0.8, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}><Media file={selected.image} alt={`${selected.model} at Prototech’s Pune facility`} /><div className="machine-feature-caption"><strong>{selected.model}</strong><span>{selected.origin}</span><p>{selected.detail}</p></div></motion.div></Reveal></div>;
}
