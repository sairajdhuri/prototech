export function Arrow({ className = "", diagonal = false }: { className?: string; diagonal?: boolean }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function CloseIcon() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth="1.5" /></svg>; }
export function MenuIcon() { return <svg width="26" height="24" viewBox="0 0 26 24" fill="none" aria-hidden="true"><path d="M2 8h22M2 16h22" stroke="currentColor" strokeWidth="1.5" /></svg>; }
