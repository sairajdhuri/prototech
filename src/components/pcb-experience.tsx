"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ButtonLink } from "./button";
import { Arrow } from "./icons";
import { Reveal } from "./reveal";
import stackPoster from "../../public/media/pcb-stack-current.webp";
import studioBackdrop from "../../public/media/pcb-studio-v2.webp";

export function PCBExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const host = canvasRef.current;
    if (!root || !host) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const track = root.querySelector<HTMLElement>(".pcb-visual-track")!;
    const chapter = root.querySelector<HTMLElement>(".pcb-chapter")!;
    const copy = root.querySelector<HTMLElement>(".pcb-chapter-copy")!;
    const space = root.querySelector<HTMLElement>(".pcb-hero-space")!;
    // The mobile track ends before the copy, so the travelling board cannot cover it.
    function sizeTrack() {
      const desktop = window.matchMedia("(min-width: 901px)").matches;
      track.style.top = desktop ? "" : `${space.offsetTop}px`;
      track.style.height = desktop ? "" : `${chapter.offsetTop + copy.offsetTop - space.offsetTop - 24}px`;
    }
    sizeTrack();
    const observer = new ResizeObserver(sizeTrack);
    observer.observe(root);
    async function setup() {
      try {
        const [{ createPCBScene }, { gsap }, { ScrollTrigger }] = await Promise.all([
          import("./pcb-scene"), import("gsap"), import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const scene = await createPCBScene(host!);
        if (cancelled) { scene.dispose(); return; }
        const media = gsap.matchMedia();
        cleanup = () => {
          media.revert(); scene.dispose();
          host!.parentElement?.classList.remove("webgl-ready");
          root!.classList.remove("pcb-on-dark");
        };
        host!.parentElement?.classList.add("webgl-ready");
        media.add({ all: "all", motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 901px)" }, context => {
          const { motion, desktop } = context.conditions!;
          const visual = root!.querySelector<HTMLElement>(".pcb-visual")!;
          const progress = root!.querySelector<HTMLElement>(".pcb-assembly-progress")!;
          const status = root!.querySelector<HTMLElement>(".pcb-assembly-status")!;
          gsap.set(visual, { xPercent: 0 });
          sizeTrack();
          ScrollTrigger.addEventListener("refreshInit", sizeTrack);
          scene.state.spread = 1; scene.state.turn = -0.3; scene.state.tilt = 0.035; scene.state.scale = 1; scene.state.dark = 0;
          scene.render();
          ScrollTrigger.create({ trigger: chapter, start: "top 48%", end: "bottom top", toggleClass: { targets: root!, className: "pcb-on-dark" } });
          if (!motion) {
            gsap.set(progress, { scaleX: 0 });
            status.textContent = "Copper + FR4 · Layer stack";
            return () => { ScrollTrigger.removeEventListener("refreshInit", sizeTrack); };
          }
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            onUpdate: () => {
              scene.render();
              const label = scene.state.spread > 0.7 ? "Copper + FR4 · Layer stack" : scene.state.spread > 0.08 ? "Aligning the layers" : "One precisely bonded board";
              if (status.textContent !== label) status.textContent = label;
            },
            scrollTrigger: { trigger: root, start: () => `top ${getComputedStyle(root!).getPropertyValue("--header-height")}`, end: () => `+=${chapter.offsetTop}`, scrub: 0.8, invalidateOnRefresh: true },
          });
          timeline.to(scene.state, { turn: -0.08, tilt: 0, spread: 0.92, duration: 0.22 })
            .to(scene.state, { spread: 0.14, turn: -0.5, tilt: 0.065, dark: 1, duration: 0.58 })
            .to(scene.state, { spread: 0, turn: -0.38, tilt: 0.02, duration: 0.2 });
          timeline.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
          timeline.to(root!.querySelector(".pcb-hero-bottom"), { autoAlpha: 0, y: -12, duration: 0.14 }, 0);
          if (desktop) timeline.to(scene.state, { scale: 1.15, duration: 0.7, ease: "power1.inOut" }, 0.16);
          gsap.fromTo(root!.querySelector(".pcb-scroll-hint svg"), { y: -3 }, { y: 3, duration: 0.8, ease: "sine.inOut", repeat: 3, yoyo: true });
          return () => { ScrollTrigger.removeEventListener("refreshInit", sizeTrack); };
        });
        ScrollTrigger.refresh();
      } catch (error) {
        cleanup?.();
        cleanup = undefined;
        console.warn("PCB illustration is using its static fallback.", error);
      }
    }
    const start = () => { if (!cancelled) void setup(); };
    const idle = window.requestIdleCallback?.(start, { timeout: 1500 });
    const timer = idle === undefined ? window.setTimeout(start, 0) : undefined;
    return () => {
      cancelled = true;
      if (idle !== undefined) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
      observer.disconnect(); cleanup?.();
      track.style.top = ""; track.style.height = "";
    };
  }, []);

  return <div className="pcb-experience" ref={rootRef}>
    <div className="pcb-visual-track">
      <figure className="pcb-visual" aria-label="Illustrative multilayer PCB with the white Prototech company symbol. Scroll to align and bond the separated copper and FR4 layers.">
        <div className="pcb-model">
          <Image className="pcb-fallback" src={stackPoster} alt="Separated PCB layers with copper pads, FR4 cores and the white Prototech company symbol" fill preload unoptimized />
          <div className="pcb-canvas" ref={canvasRef} />
        </div>
        <ol className="pcb-layer-key" aria-label="Illustrated board layers"><li>Solder mask</li><li>Copper layer</li><li>Prepreg</li><li>Core</li><li>Inner copper</li><li>Bottom layer</li></ol>
        <figcaption><span className="pcb-assembly-status">Copper + FR4 · Layer stack</span><span className="pcb-progress-track"><span className="pcb-assembly-progress" /></span><span>Construction illustration</span></figcaption>
      </figure>
    </div>
    <section className="pcb-hero">
      <Image className="pcb-studio-backdrop" src={studioBackdrop} alt="" fill preload unoptimized />
      <div className="pcb-hero-copy">
        <Reveal><h1>Engineered<br /><span>from the inside out.</span></h1></Reveal>
        <Reveal delay={0.08}><p>High-quality double-sided and multilayer PCBs for innovators who build what’s next. Made in Pune since 1999.</p></Reveal>
        <Reveal delay={0.16} className="pcb-hero-actions"><ButtonLink href="/quote">Request a quote</ButtonLink><Link className="text-link" href="/capabilities">Explore capabilities <Arrow /></Link></Reveal>
      </div>
      <div className="pcb-hero-bottom"><p>Engineered in layers.<br />Built to make connections.</p><a className="pcb-scroll-hint" href="#inside-the-board">Scroll to bring it together <svg width="18" height="24" viewBox="0 0 18 24" fill="none" aria-hidden="true"><path d="M9 2v19m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.5" /></svg></a></div>
      <div className="pcb-hero-space" aria-hidden="true" />
    </section>
    <section className="pcb-chapter" id="inside-the-board" aria-labelledby="pcb-chapter-title">
      <div className="pcb-chapter-copy"><Reveal><h2 id="pcb-chapter-title">More than<br />just boards.</h2></Reveal><Reveal delay={0.08}><p>From rapid prototyping to small-volume production, we make the connections that bring your next idea to life.</p></Reveal><Reveal delay={0.16}><Link className="text-link" href="/capabilities">Explore the specifications <Arrow /></Link></Reveal></div>
      <div className="pcb-chapter-specs"><Reveal><strong>0.15 <span>mm</span></strong><h3>Track & spacing</h3><p>Published inner and outer layer track and spacing.</p></Reveal><Reveal delay={0.08}><strong>0.25 <span>mm</span></strong><h3>Plated through holes</h3><p>Finished hole capability, supported by CNC drilling.</p></Reveal><Reveal delay={0.16}><strong>460 <span>mm</span></strong><h3>Room for your design</h3><p>Multilayer finished boards up to 460 × 460 mm.</p></Reveal></div>
    </section>
  </div>;
}
