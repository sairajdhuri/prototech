"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { enquirySchema, quoteSchema, fileMetadataError } from "@/lib/validation";
import { Arrow } from "./icons";

type Errors = Record<string, string>;
export function EnquiryForm({ kind, initialType = "double-sided", initialLayers = 2 }: { kind: "enquiry" | "quote"; initialType?: string; initialLayers?: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pcbType, setPcbType] = useState(initialType);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [fileName, setFileName] = useState("");
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    const navigation = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest("a");
      if (!link || link.target === "_blank" || event.ctrlKey || event.metaKey || event.button !== 0) return;
      const url = new URL(link.href, location.href);
      if (url.origin === location.origin && url.pathname !== location.pathname && !window.confirm("You have an unsent form. Leave this page and discard it?")) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", navigation, true);
    return () => { window.removeEventListener("beforeunload", warn); document.removeEventListener("click", navigation, true); };
  }, [dirty]);
  function showErrors(next: Errors) {
    setErrors(next);
    const first = Object.keys(next)[0];
    const target = formRef.current?.elements.namedItem(first);
    if (target instanceof HTMLElement) target.focus();
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setFeedback(null);
    const form = event.currentTarget;
    const body = new FormData(form);
    const result = (kind === "quote" ? quoteSchema : enquirySchema).safeParse(Object.fromEntries(body.entries()));
    const next: Errors = {};
    if (!result.success) for (const issue of result.error.issues) next[String(issue.path[0])] ||= issue.message;
    const attachment = body.get("attachment");
    if (attachment instanceof File && (attachment.size > 0 || attachment.name)) {
      const invalid = fileMetadataError(attachment);
      if (invalid) next.attachment = invalid;
    }
    if (Object.keys(next).length) { showErrors(next); setFeedback({ success: false, message: "Check the highlighted fields before sending." }); return; }
    setErrors({}); setPending(true);
    try {
      const response = await fetch("/api/submissions", { method: "POST", body, signal: AbortSignal.timeout(25000) });
      const data = await response.json();
      if (!response.ok || !data.ok || !data.id) {
        if (data.fields) showErrors(data.fields);
        setFeedback({ success: false, message: data.message || "Your message wasn’t sent. Please email sales@protomlb.in." });
      } else {
        setFeedback({ success: true, message: data.message });
        setDirty(false); form.reset(); setFileName(""); setPcbType(initialType);
      }
    } catch { setFeedback({ success: false, message: "Delivery could not be confirmed. Please contact sales@protomlb.in before resubmitting." }); }
    finally { setPending(false); }
  }
  const field = (name: string, label: string, type = "text", required = false, autocomplete = "off", extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => <div className="field"><label htmlFor={name}>{label}{!required && <span>Optional</span>}</label><input id={name} name={name} type={type} autoComplete={autocomplete} required={required} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} spellCheck={type === "email" ? false : undefined} {...extra} />{errors[name] && <p className="field-error" id={`${name}-error`}>{errors[name]}</p>}</div>;
  const layers = pcbType === "single-sided" ? [1] : pcbType === "double-sided" ? [2] : [4, 6, 8, 10, 12];
  return <form ref={formRef} className="enquiry-form" method="post" action="/api/submissions" encType="multipart/form-data" noValidate onSubmit={submit} onChange={() => setDirty(true)} aria-busy={pending}>
    <input type="hidden" name="kind" value={kind} /><div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <fieldset disabled={pending}><legend>{kind === "quote" ? "Your contact details" : "Send an enquiry"}</legend><div className="form-grid">{field("fullName", "Full name", "text", true, "name", { maxLength: 100 })}{field("company", "Company name", "text", kind === "quote", "organization", { maxLength: 160 })}{field("email", "Email address", "email", true, "email", { maxLength: 254 })}{field("phone", "Phone number", "tel", kind === "quote", "tel", { maxLength: 30 })}</div>
      {kind === "quote" && <><h2 className="form-subtitle">Your board specifications</h2><div className="form-grid"><div className="field"><label htmlFor="pcbType">PCB type</label><select id="pcbType" name="pcbType" value={pcbType} onChange={event => setPcbType(event.target.value)} aria-invalid={!!errors.pcbType} aria-describedby={errors.pcbType ? "pcbType-error" : undefined}><option value="single-sided">Single-sided</option><option value="double-sided">Double-sided</option><option value="multilayer">Multilayer</option></select>{errors.pcbType && <p className="field-error" id="pcbType-error">{errors.pcbType}</p>}</div><div className="field"><label htmlFor="layers">Number of layers</label><select key={pcbType} id="layers" name="layers" defaultValue={layers.includes(initialLayers) ? initialLayers : layers[0]} aria-invalid={!!errors.layers} aria-describedby={errors.layers ? "layers-error" : undefined}>{layers.map(layer => <option key={layer} value={layer}>{layer} {layer === 1 ? "layer" : "layers"}</option>)}</select>{errors.layers && <p className="field-error" id="layers-error">{errors.layers}</p>}</div>{field("width", "Board width (mm)", "number", true, "off", { min: 0.01, step: "0.01", inputMode: "decimal", max: pcbType === "multilayer" ? 460 : 2000 })}{field("height", "Board height (mm)", "number", true, "off", { min: 0.01, step: "0.01", inputMode: "decimal", max: pcbType === "multilayer" ? 460 : 2000 })}{field("quantity", "Quantity (boards)", "number", true, "off", { min: 1, step: 1, max: 1000000, inputMode: "numeric" })}</div></>}
      <div className="field field-full"><label htmlFor="requirements">{kind === "quote" ? "Requirements" : "Your message"}</label><textarea id="requirements" name="requirements" rows={5} required minLength={10} maxLength={5000} autoComplete="off" aria-invalid={!!errors.requirements} aria-describedby={errors.requirements ? "requirements-error" : "requirements-help"} /><p id="requirements-help" className="field-help">{kind === "quote" ? "Include material, thickness, copper weight, finish, solder mask colour and your preferred delivery date." : "Tell us about your board, question or project."}</p>{errors.requirements && <p className="field-error" id="requirements-error">{errors.requirements}</p>}</div>
      {kind === "quote" && <div className="field file-field"><label htmlFor="attachment">Design files<span>Optional</span></label><input id="attachment" name="attachment" type="file" accept=".zip,.pdf,.gbr,.ger,.gtl,.gbl,.gts,.gbs,.gto,.gbo,.drl" onChange={event => setFileName(event.target.files?.[0]?.name || "")} aria-invalid={!!errors.attachment} aria-describedby="attachment-help attachment-error" /><p className="field-help" id="attachment-help">{fileName || "One ZIP, PDF, Gerber or drill file. Maximum 5 MB. Files are sent as email attachments."}</p>{fileName && <button className="file-remove" type="button" onClick={() => { const input = formRef.current?.elements.namedItem("attachment"); if (input instanceof HTMLInputElement) input.value = ""; setFileName(""); }}>Remove attachment</button>}<p className="field-error" id="attachment-error">{errors.attachment}</p></div>}
      <div className="form-submit"><button className="button" type="submit" disabled={pending}>{pending ? <><span className="spinner" aria-hidden="true" />Sending…</> : <>{kind === "quote" ? "Send quote request" : "Send enquiry"}<Arrow /></>}</button><p>By submitting, you agree to our <Link href="/privacy">privacy policy</Link>. We use your details to respond to your request.</p></div>
    </fieldset><div className={`form-feedback${feedback?.success ? " is-success" : ""}`} role="status" aria-live="polite" tabIndex={feedback ? 0 : -1}>{feedback && <p>{feedback.message}</p>}</div>
  </form>;
}
