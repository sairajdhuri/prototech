"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { company, navigation } from "@/lib/company";
import { Arrow, CloseIcon, MenuIcon } from "./icons";
import { Brand } from "./brand";
import { keepDialogFocus } from "./dialog-focus";

export function Header() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  function open() {
    if (!dialog.current) return;
    dialog.current.showModal();
    if (!reduced) animate(dialog.current, { opacity: [0.8, 1], y: [-12, 0] }, { duration: 0.24, ease: [0.22, 1, 0.36, 1] });
  }
  function close() { dialog.current?.close(); trigger.current?.focus(); }
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1180px)");
    const handle = () => { if (media.matches) dialog.current?.close(); };
    media.addEventListener("change", handle);
    return () => media.removeEventListener("change", handle);
  }, []);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Prototech home" translate="no"><Brand /></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}</nav>
      <Link className="header-quote" href="/quote">Request a quote <Arrow diagonal /></Link>
      <button className="menu-trigger" ref={trigger} aria-label="Open navigation" aria-haspopup="dialog" onClick={open}><MenuIcon /></button>
    </header>
    <dialog ref={dialog} className="mobile-dialog" aria-label="Navigation" onKeyDown={keepDialogFocus} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="mobile-menu-top"><span className="brand" translate="no"><Brand /></span><button className="icon-button" aria-label="Close navigation" onClick={close}><CloseIcon /></button></div>
      <nav aria-label="Mobile navigation">{navigation.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onNavigate={() => dialog.current?.close()}>{link.label}<Arrow diagonal /></Link>)}<Link className="mobile-quote" href="/quote" onNavigate={() => dialog.current?.close()}>Request a quote<Arrow /></Link></nav>
      <a className="mobile-menu-email" href={`mailto:${company.email}`}>{company.email}</a>
    </dialog>
  </>;
}
