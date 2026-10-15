"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { originalImage } from "@/lib/company";
import originalAssets from "../../public/media/original-assets.json";
import { suppliedAssets } from "@/lib/assets";

export function Media({ file, alt, className = "", contain = false, fallbackLabel, hideIfUnavailable = false }: { file: string; alt: string; className?: string; contain?: boolean; fallbackLabel?: string; hideIfUnavailable?: boolean }) {
  const localSource = suppliedAssets[file] || ((originalAssets as string[]).includes(file) ? `/media/original/${file}` : null);
  const [source, setSource] = useState<string | null>(localSource);
  const [remote, setRemote] = useState(!localSource);
  useEffect(() => {
    if (!remote) return;
    const probe = new window.Image();
    probe.onload = () => setSource(originalImage(file));
    probe.src = originalImage(file);
    return () => { probe.onload = null; };
  }, [file, remote]);
  function recover() { setSource(null); setRemote(true); }
  if (!source && hideIfUnavailable) return null;
  return <div className={`media ${className}${contain ? " media-contain" : ""}${file === "Img.gif" ? " media-schneider" : ""}${file === "CorporateFilm.png" || file === "tata-autocomp-systems-launches-vrla-batteries.webp" ? " media-dark-logo" : ""}`}>
    {source ? <Image src={source} alt={alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 60vw" unoptimized={source.startsWith("https:") || file.endsWith(".gif")} onError={recover} /> : <div className="media-unavailable"><span>{fallbackLabel || alt}</span>{!contain && <a href={originalImage(file)} target="_blank" rel="noreferrer">View original image</a>}</div>}
  </div>;
}
