"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { boardTypes } from "@/lib/company";
import { Arrow } from "./icons";
import { Reveal } from "./reveal";

export function BoardExplorer() {
  const search = useSearchParams();
  const path = usePathname();
  const reduce = useReducedMotion();
  const selected = boardTypes.find(item => item.id === search.get("board")) || boardTypes[0];
  function select(id: string) {
    const params = new URLSearchParams(search.toString());
    params.set("board", id);
    window.history.replaceState(null, "", `${path}?${params}`);
  }
  return <div className="board-explorer">
    <Reveal className="explorer-menu"><h2>Your next board</h2><p>Start with the construction.<br /> We’ll help with the details.</p><div className="board-options" aria-label="Board construction">{boardTypes.map(board => <motion.button key={board.id} whileTap={reduce ? undefined : { scale: 0.98 }} onClick={() => select(board.id)} aria-pressed={selected.id === board.id}>{board.name}<Arrow diagonal /></motion.button>)}</div><Link className="text-link" href="/capabilities">All manufacturing specifications <Arrow /></Link></Reveal>
    <div className={`explorer-stage tone-${selected.tone}`}><motion.div key={selected.id} className="explorer-image" initial={reduce ? false : { opacity: 0.8, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}><Image src={selected.image} alt={`${selected.name} PCB construction illustration`} width={720} height={540} sizes="(max-width: 700px) 100vw, 60vw" /></motion.div><div className="explorer-caption"><span>Construction illustration</span><span>{selected.layers}</span></div></div>
    <div className="explorer-detail" aria-live="polite"><p>{selected.description}</p><Link href={`/quote?pcbType=${selected.id}&layers=${selected.id === "multilayer" ? 4 : selected.id === "single-sided" ? 1 : 2}`} className="text-link">Quote this board <Arrow /></Link></div>
  </div>;
}
