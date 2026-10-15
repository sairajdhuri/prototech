"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow, CloseIcon } from "./icons";
import { keepDialogFocus } from "./dialog-focus";
import { motion, useReducedMotion } from "motion/react";

export type GalleryItem = { id: string; name: string; image: string; kind: "photograph" | "illustration"; detail: string };
export function Gallery({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const modal = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const select = useCallback((index: number) => {
    setSelected(index);
    const url = new URL(location.href);
    url.searchParams.set("image", items[index].id);
    history.replaceState(null, "", url);
    if (!modal.current?.open) modal.current?.showModal();
  }, [items]);
  useEffect(() => {
    const id = new URL(location.href).searchParams.get("image");
    const index = items.findIndex(item => item.id === id);
    if (index >= 0) {
      const timer = window.setTimeout(() => select(index), 0);
      return () => window.clearTimeout(timer);
    }
  }, [items, select]);
  function close() {
    modal.current?.close();
  }
  function cleanup() {
    setSelected(null);
    const url = new URL(location.href);
    url.searchParams.delete("image");
    history.replaceState(null, "", url);
    lastTrigger.current?.focus();
  }
  function step(direction: number) { if (selected !== null) select((selected + direction + items.length) % items.length); }
  const item = selected !== null ? items[selected] : null;
  return <><div className="gallery-grid">{items.map((picture, index) => <button className={`gallery-item${index === 0 ? " gallery-item-featured" : ""}`} key={picture.id} onClick={event => { lastTrigger.current = event.currentTarget; select(index); }} aria-label={`View ${picture.name}`}><div className="gallery-image"><Image src={picture.image} alt={`${picture.name}, ${picture.kind}`} fill sizes={index === 0 ? "(max-width: 700px) 100vw, 66vw" : "(max-width: 700px) 100vw, 33vw"} /></div><div className="gallery-caption"><span>{picture.name}</span><Arrow diagonal /></div><p>{picture.detail}</p></button>)}</div><dialog ref={modal} className="lightbox" aria-label="Board image viewer" onClose={cleanup} onClick={event => { if (event.currentTarget === event.target) close(); }} onKeyDown={event => { keepDialogFocus(event); if (event.key === "ArrowRight") { event.preventDefault(); step(1); } if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); } }}><div className="lightbox-top"><p>{item?.name}</p><button className="icon-button" onClick={close} aria-label="Close image viewer"><CloseIcon /></button></div>{item && <motion.div key={item.id} className="lightbox-image" initial={false} animate={reduced ? { opacity: 1 } : { opacity: [0.6, 1], scale: [0.985, 1] }} transition={{ duration: 0.22 }}><Image src={item.image} alt={`${item.name}, ${item.kind}`} fill sizes="90vw" /></motion.div>}<div className="lightbox-bottom"><button className="icon-button" aria-label="Previous image" onClick={() => step(-1)}><span className="rotate-arrow"><Arrow /></span></button><p aria-live="polite">{selected !== null ? `${selected + 1} of ${items.length}` : ""}<span>{item?.kind === "illustration" ? "Illustrative artwork" : "Original Prototech photograph"}</span></p><button className="icon-button" aria-label="Next image" onClick={() => step(1)}><Arrow /></button></div></dialog></>;
}
